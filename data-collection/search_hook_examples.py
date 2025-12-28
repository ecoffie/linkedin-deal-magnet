#!/usr/bin/env python3
"""
LinkedIn Hook Examples Searcher
================================

Searches for and extracts LinkedIn hook examples from articles, blog posts, and guides.
Specifically targets government contractor (GovCon) content.

Uses web search and content extraction to build a dataset of:
- Hooks (opening lines)
- Full posts (complete content)
- Metadata (source, date, engagement if available)
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from datetime import datetime
from typing import List, Dict, Optional
import os
from urllib.parse import urlparse, quote_plus

USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
REQUEST_DELAY = 2  # seconds between requests


class HookExampleSearcher:
    """Search for and extract LinkedIn hook examples from web content"""
    
    def __init__(self, output_dir: str = 'scraped-data/hook-examples'):
        self.output_dir = output_dir
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})
        os.makedirs(output_dir, exist_ok=True)
        self.examples = []
    
    def search_duckduckgo(self, query: str, max_results: int = 20) -> List[str]:
        """
        Search DuckDuckGo for relevant articles
        
        Note: DuckDuckGo doesn't have an official API, so this uses HTML parsing.
        For production, consider using Google Custom Search API or SerpAPI.
        """
        try:
            search_url = f"https://html.duckduckgo.com/html/?q={quote_plus(query)}"
            response = self.session.get(search_url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            urls = []
            
            # DuckDuckGo result selectors
            results = soup.select('.result__a')
            for result in results[:max_results]:
                url = result.get('href', '')
                if url and url.startswith('http'):
                    urls.append(url)
            
            time.sleep(REQUEST_DELAY)
            return urls
            
        except Exception as e:
            print(f"Error searching DuckDuckGo: {e}")
            return []
    
    def scrape_article(self, url: str) -> Optional[Dict]:
        """Scrape an article/blog post for LinkedIn hook examples"""
        try:
            print(f"Scraping: {url}")
            
            # Use proxy for CORS
            proxy_url = f"https://api.allorigins.win/get?url={requests.utils.quote(url)}"
            response = self.session.get(proxy_url, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            html_content = data.get('contents', '')
            
            if not html_content:
                return None
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Extract main content
            content = self._extract_article_content(soup)
            
            # Extract title
            title = soup.find('title')
            title_text = title.get_text(strip=True) if title else ''
            
            # Extract meta description
            meta_desc = soup.find('meta', property='og:description') or soup.find('meta', {'name': 'description'})
            description = meta_desc.get('content', '') if meta_desc else ''
            
            # Extract examples from content
            examples = self._extract_hook_examples(content)
            
            if examples:
                return {
                    'source_url': url,
                    'source_title': title_text,
                    'source_description': description,
                    'scraped_at': datetime.now().isoformat(),
                    'examples': examples
                }
            
            return None
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return None
    
    def _extract_article_content(self, soup: BeautifulSoup) -> str:
        """Extract main article content"""
        # Common article content selectors
        selectors = [
            'article',
            '.article-content',
            '.post-content',
            '.entry-content',
            'main article',
            '.content',
            '#content',
            'article .content',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                # Remove script and style tags
                for tag in element.find_all(['script', 'style', 'nav', 'footer', 'aside']):
                    tag.decompose()
                return element.get_text(separator='\n', strip=True)
        
        # Fallback to body
        body = soup.find('body')
        if body:
            for tag in body.find_all(['script', 'style', 'nav', 'footer', 'header', 'aside']):
                tag.decompose()
            return body.get_text(separator='\n', strip=True)
        
        return ''
    
    def _extract_hook_examples(self, content: str) -> List[Dict]:
        """Extract hook examples from article content"""
        examples = []
        
        # Patterns to find examples in articles
        # Look for numbered lists, bullet points, code blocks, or quote blocks
        
        lines = content.split('\n')
        current_example = None
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
            
            # Look for numbered examples (1., 2., etc.)
            numbered_match = re.match(r'^(\d+)[.)]\s*(.+)$', line)
            if numbered_match:
                hook_text = numbered_match.group(2).strip()
                if self._looks_like_hook(hook_text):
                    if current_example:
                        examples.append(current_example)
                    current_example = {'hook': hook_text, 'post': None}
            
            # Look for bullet points with hooks
            elif re.match(r'^[-*•]\s*(.+)$', line):
                bullet_text = line[2:].strip()
                if self._looks_like_hook(bullet_text) and len(bullet_text) < 200:
                    if current_example:
                        examples.append(current_example)
                    current_example = {'hook': bullet_text, 'post': None}
            
            # Look for code blocks or quote blocks (often used for examples)
            elif line.startswith('```') or line.startswith('>'):
                # Might contain examples
                continue
            
            # If we have a current example and find a longer text, it might be the full post
            elif current_example and len(line) > 100:
                if not current_example.get('post'):
                    # Check if this looks like a full post
                    if self._looks_like_post(line):
                        current_example['post'] = line
                        examples.append(current_example)
                        current_example = None
        
        if current_example:
            examples.append(current_example)
        
        # Also try to extract examples from structured patterns
        # Look for patterns like "Example:" or "Hook:" followed by text
        example_patterns = [
            r'Example\s*\d*[.:]\s*(.+?)(?=\n\n|\nExample|\n\d+[.)]|$)',
            r'Hook\s*\d*[.:]\s*(.+?)(?=\n\n|\nHook|\n\d+[.)]|$)',
            r'^"([^"]+)"\s*-\s*(.+?)(?=\n\n|$)',
        ]
        
        for pattern in example_patterns:
            matches = re.finditer(pattern, content, re.MULTILINE | re.DOTALL | re.IGNORECASE)
            for match in matches:
                if len(match.groups()) >= 2:
                    hook = match.group(1).strip()
                    post = match.group(2).strip()
                else:
                    hook = match.group(1).strip()
                    post = None
                
                if self._looks_like_hook(hook):
                    examples.append({'hook': hook, 'post': post})
        
        return examples[:50]  # Limit examples per article
    
    def _looks_like_hook(self, text: str) -> bool:
        """Determine if text looks like a LinkedIn hook"""
        if not text or len(text) < 10:
            return False
        
        # Hooks are usually shorter
        if len(text) > 300:
            return False
        
        # Common hook patterns
        hook_indicators = [
            r'^(Why|How|What|When|Where|Are|Is|Do|Does|Can|Will|I|My|The|Stop|Unpopular|Hot take|After|I\'ve|I\'m)',
            r'^\d+',
            r'^(The top|The \d+|Here\'s|Let me|If you)',
        ]
        
        for pattern in hook_indicators:
            if re.match(pattern, text, re.IGNORECASE):
                return True
        
        return False
    
    def _looks_like_post(self, text: str) -> bool:
        """Determine if text looks like a full LinkedIn post"""
        # Posts are usually longer
        if len(text) < 100:
            return False
        
        # Check for common post characteristics
        word_count = len(text.split())
        return 50 <= word_count <= 1000
    
    def search_and_extract(self, search_queries: List[str], max_results_per_query: int = 10) -> List[Dict]:
        """Search for articles and extract hook examples"""
        all_examples = []
        urls_processed = set()
        
        for query in search_queries:
            print(f"\n🔍 Searching for: '{query}'")
            urls = self.search_duckduckgo(query, max_results=max_results_per_query)
            
            for url in urls:
                if url in urls_processed:
                    continue
                urls_processed.add(url)
                
                article_data = self.scrape_article(url)
                if article_data and article_data.get('examples'):
                    all_examples.append(article_data)
                    print(f"  ✓ Found {len(article_data['examples'])} examples")
                
                time.sleep(REQUEST_DELAY)
        
        self.examples = all_examples
        return all_examples
    
    def save_examples(self, filename: str = None):
        """Save extracted examples to JSON file"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'hook_examples_{timestamp}.json'
        
        filepath = os.path.join(self.output_dir, filename)
        
        # Flatten examples for easier use
        flattened = []
        for article in self.examples:
            for example in article.get('examples', []):
                flattened.append({
                    'hook': example.get('hook'),
                    'post': example.get('post'),
                    'source_url': article.get('source_url'),
                    'source_title': article.get('source_title'),
                    'scraped_at': article.get('scraped_at'),
                })
        
        output = {
            'metadata': {
                'total_examples': len(flattened),
                'total_sources': len(self.examples),
                'generated_at': datetime.now().isoformat(),
            },
            'examples': flattened,
            'sources': self.examples
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Saved {len(flattened)} examples to {filepath}")
        return filepath


def get_govcon_search_queries() -> List[str]:
    """Get list of search queries for GovCon LinkedIn hooks"""
    return [
        'best LinkedIn hooks government contractors 2025',
        'LinkedIn hooks GovCon examples',
        'viral LinkedIn posts government contracting',
        'LinkedIn content templates federal contractors',
        'government contractor LinkedIn post examples',
        'LinkedIn hooks for B2G sales',
        'federal contracting LinkedIn content strategy',
        'LinkedIn post templates government contractors',
        'top LinkedIn hooks Neal O\'Grady',
        'LinkedIn hooks Jodie Cook examples',
        'Alex Groberman LinkedIn posts',
        'Logan Gott LinkedIn swipe files',
        'LinkedIn hook templates government services',
        'B2G LinkedIn content examples 2025',
        'federal sales LinkedIn posts',
    ]


def main():
    """Main function"""
    print("=" * 60)
    print("LinkedIn Hook Examples Searcher")
    print("=" * 60)
    print()
    print("This script searches for LinkedIn hook examples from articles")
    print("specifically targeting government contractor (GovCon) content.")
    print()
    print("⚠️  Note: This uses web scraping. Be respectful of rate limits.")
    print()
    
    searcher = HookExampleSearcher()
    
    # Get search queries
    queries = get_govcon_search_queries()
    
    print(f"Will search {len(queries)} queries")
    print("\nStarting search...\n")
    
    # Search and extract
    results = searcher.search_and_extract(queries, max_results_per_query=10)
    
    # Save results
    searcher.save_examples()
    
    # Print summary
    total_examples = sum(len(article.get('examples', [])) for article in results)
    print(f"\n{'=' * 60}")
    print(f"Summary:")
    print(f"  Articles processed: {len(results)}")
    print(f"  Total examples found: {total_examples}")
    print(f"{'=' * 60}")


if __name__ == '__main__':
    main()

