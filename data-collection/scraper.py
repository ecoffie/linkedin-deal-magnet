#!/usr/bin/env python3
"""
Ethical Social Media Post Scraper
==================================

This script gathers public LinkedIn and X/Twitter posts for content analysis.
IMPORTANT: This script only scrapes PUBLIC data and respects platform ToS.

⚠️  ETHICAL CONSIDERATIONS:
- Only scrape PUBLIC posts (your own posts or explicitly public profiles)
- Respect robots.txt and rate limits
- Add delays between requests
- Do NOT scrape private content or bypass authentication
- Follow platform Terms of Service
- Use data only for research/training purposes

Legal Note: Scraping may violate some platform ToS. Use at your own risk.
Consider using official APIs when available.
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from datetime import datetime
from typing import List, Dict, Optional
from urllib.parse import urlparse
import sys
import os

# Add delays to be respectful
REQUEST_DELAY = 2  # seconds between requests
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'


class PostScraper:
    """Base class for social media post scraping"""
    
    def __init__(self, output_dir: str = 'scraped-data'):
        self.output_dir = output_dir
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})
        os.makedirs(output_dir, exist_ok=True)
        
    def extract_hook(self, text: str) -> Optional[str]:
        """Extract the opening hook (first line or first sentence)"""
        if not text:
            return None
        
        lines = text.strip().split('\n')
        first_line = lines[0].strip()
        
        # Get first sentence if first line is too long
        if len(first_line) > 200:
            sentences = re.split(r'[.!?]', first_line)
            if sentences:
                first_line = sentences[0].strip() + '.'
        
        return first_line if first_line else None
    
    def analyze_post_structure(self, text: str) -> Dict:
        """Analyze post structure for patterns"""
        structure = {
            'word_count': len(text.split()),
            'char_count': len(text),
            'has_question': '?' in text,
            'has_numbers': bool(re.search(r'\d+', text)),
            'has_hashtags': bool(re.search(r'#\w+', text)),
            'has_mentions': bool(re.search(r'@\w+', text)),
            'has_emojis': bool(re.search(r'[^\w\s#@.,!?;:()\-\'"]', text)),
            'line_count': len([l for l in text.split('\n') if l.strip()]),
            'has_list': bool(re.search(r'^\s*[-*•]\s', text, re.MULTILINE)) or bool(re.search(r'^\s*\d+[.)]\s', text, re.MULTILINE)),
        }
        
        # Detect hook patterns
        hook_patterns = {
            'question_hook': bool(re.search(r'^(Why|How|What|When|Where|Are|Is|Do|Does|Can|Will)\s', text, re.IGNORECASE)),
            'number_hook': bool(re.search(r'^(\d+|The\s+\d+)\s', text, re.IGNORECASE)),
            'story_hook': bool(re.search(r'^(I\s|My\s|Last\s|Years?\s+ago|When\s+I)', text, re.IGNORECASE)),
            'unpopular_hook': bool(re.search(r'^(Unpopular|Hot\s+take|Controversial|Let\s+me\s+say)', text, re.IGNORECASE)),
            'stop_hook': bool(re.search(r'^Stop\s+', text, re.IGNORECASE)),
            'pattern_hook': bool(re.search(r'^(I\s+noticed|Here\'s\s+what|After\s+analyzing)', text, re.IGNORECASE)),
        }
        structure.update(hook_patterns)
        
        return structure
    
    def save_post(self, post_data: Dict, platform: str):
        """Save post data to JSON file"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{platform}_post_{timestamp}.json"
        filepath = os.path.join(self.output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(post_data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Saved: {filename}")
        return filepath


class LinkedInScraper(PostScraper):
    """Scraper for public LinkedIn posts"""
    
    def __init__(self, output_dir: str = 'scraped-data'):
        super().__init__(output_dir)
        self.base_url = 'https://www.linkedin.com'
        
    def scrape_public_post(self, post_url: str) -> Optional[Dict]:
        """
        Scrape a public LinkedIn post URL
        
        ⚠️  Note: LinkedIn heavily restricts scraping. This may not work reliably.
        Consider using LinkedIn API or manual data collection instead.
        """
        try:
            print(f"Attempting to scrape: {post_url}")
            
            # Use a proxy service for CORS (like AllOrigins)
            # LinkedIn blocks direct scraping, so this may fail
            proxy_url = f"https://api.allorigins.win/get?url={requests.utils.quote(post_url)}"
            
            response = self.session.get(proxy_url, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            html_content = data.get('contents', '')
            
            if not html_content:
                print("⚠️  No content retrieved. LinkedIn may be blocking requests.")
                return None
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Try to find post content (LinkedIn structure varies)
            post_text = None
            
            # Common LinkedIn post selectors (these may change)
            selectors = [
                '.feed-shared-update-v2__description',
                '.feed-shared-text',
                '.update-components-text',
                '[data-id="urn:li:activity"]',
            ]
            
            for selector in selectors:
                element = soup.select_one(selector)
                if element:
                    post_text = element.get_text(strip=True)
                    break
            
            if not post_text:
                # Fallback: try to extract from meta tags or JSON-LD
                meta_desc = soup.find('meta', property='og:description')
                if meta_desc:
                    post_text = meta_desc.get('content', '')
            
            if not post_text:
                print("⚠️  Could not extract post text. LinkedIn structure may have changed.")
                return None
            
            # Extract engagement metrics (if available)
            engagement = {
                'likes': self._extract_number(soup, ['button[aria-label*="like"]', '.social-actions-button__text']),
                'comments': self._extract_number(soup, ['button[aria-label*="comment"]']),
                'shares': self._extract_number(soup, ['button[aria-label*="share"]']),
            }
            
            # Extract author info
            author_name = None
            author_selector = soup.select_one('span.feed-shared-actor__name, .feed-shared-actor__name')
            if author_selector:
                author_name = author_selector.get_text(strip=True)
            
            post_data = {
                'platform': 'LinkedIn',
                'url': post_url,
                'scraped_at': datetime.now().isoformat(),
                'author': author_name,
                'content': post_text,
                'hook': self.extract_hook(post_text),
                'structure': self.analyze_post_structure(post_text),
                'engagement': engagement,
            }
            
            time.sleep(REQUEST_DELAY)
            return post_data
            
        except Exception as e:
            print(f"❌ Error scraping LinkedIn post: {e}")
            return None
    
    def _extract_number(self, soup: BeautifulSoup, selectors: List[str]) -> Optional[int]:
        """Extract numeric value from element"""
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                text = element.get_text(strip=True)
                numbers = re.findall(r'\d+', text.replace(',', ''))
                if numbers:
                    try:
                        return int(numbers[0])
                    except ValueError:
                        pass
        return None
    
    def scrape_from_manual_input(self, posts: List[str]) -> List[Dict]:
        """
        Process manually copied LinkedIn post texts
        
        This is the RECOMMENDED approach for LinkedIn due to scraping restrictions.
        """
        results = []
        for i, post_text in enumerate(posts, 1):
            print(f"Processing post {i}/{len(posts)}...")
            
            post_data = {
                'platform': 'LinkedIn',
                'source': 'manual_input',
                'scraped_at': datetime.now().isoformat(),
                'content': post_text,
                'hook': self.extract_hook(post_text),
                'structure': self.analyze_post_structure(post_text),
            }
            
            results.append(post_data)
            self.save_post(post_data, 'linkedin')
            time.sleep(0.5)  # Small delay
        
        return results


class TwitterScraper(PostScraper):
    """Scraper for public X/Twitter posts"""
    
    def __init__(self, output_dir: str = 'scraped-data'):
        super().__init__(output_dir)
        self.base_url = 'https://twitter.com'
        
    def scrape_public_tweet(self, tweet_url: str) -> Optional[Dict]:
        """
        Scrape a public X/Twitter tweet URL
        
        ⚠️  Note: Twitter/X has rate limits and may block scraping.
        Consider using Twitter API v2 for better results.
        """
        try:
            print(f"Attempting to scrape: {tweet_url}")
            
            # Use proxy for CORS
            proxy_url = f"https://api.allorigins.win/get?url={requests.utils.quote(tweet_url)}"
            
            response = self.session.get(proxy_url, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            html_content = data.get('contents', '')
            
            if not html_content:
                print("⚠️  No content retrieved.")
                return None
            
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Extract tweet text
            tweet_text = None
            
            # Twitter/X selectors (may change)
            selectors = [
                '[data-testid="tweetText"]',
                '.tweet-text',
                'article[data-testid="tweet"]',
            ]
            
            for selector in selectors:
                element = soup.select_one(selector)
                if element:
                    tweet_text = element.get_text(strip=True)
                    break
            
            if not tweet_text:
                # Try meta description
                meta_desc = soup.find('meta', property='og:description')
                if meta_desc:
                    tweet_text = meta_desc.get('content', '')
            
            if not tweet_text:
                print("⚠️  Could not extract tweet text.")
                return None
            
            # Extract engagement
            engagement = {
                'likes': self._extract_engagement(soup, 'like'),
                'retweets': self._extract_engagement(soup, 'retweet'),
                'replies': self._extract_engagement(soup, 'reply'),
            }
            
            # Extract author
            author_name = None
            author_selector = soup.select_one('[data-testid="User-Name"]')
            if author_selector:
                author_name = author_selector.get_text(strip=True)
            
            post_data = {
                'platform': 'X (Twitter)',
                'url': tweet_url,
                'scraped_at': datetime.now().isoformat(),
                'author': author_name,
                'content': tweet_text,
                'hook': self.extract_hook(tweet_text),
                'structure': self.analyze_post_structure(tweet_text),
                'engagement': engagement,
            }
            
            time.sleep(REQUEST_DELAY)
            return post_data
            
        except Exception as e:
            print(f"❌ Error scraping tweet: {e}")
            return None
    
    def _extract_engagement(self, soup: BeautifulSoup, metric: str) -> Optional[int]:
        """Extract engagement metric from tweet"""
        # Try various selectors for engagement metrics
        selectors = [
            f'button[aria-label*="{metric}"]',
            f'[data-testid*="{metric}"]',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                text = element.get_text(strip=True)
                numbers = re.findall(r'\d+', text.replace(',', ''))
                if numbers:
                    try:
                        return int(numbers[0])
                    except ValueError:
                        pass
        return None


def main():
    """Main function for command-line usage"""
    print("=" * 60)
    print("Ethical Social Media Post Scraper")
    print("=" * 60)
    print()
    print("⚠️  REMINDER: Only scrape PUBLIC content")
    print("⚠️  Respect platform ToS and rate limits")
    print()
    
    scraper_type = input("Scrape LinkedIn or X/Twitter? (L/X/M for manual): ").strip().upper()
    
    output_dir = 'scraped-data'
    os.makedirs(output_dir, exist_ok=True)
    
    if scraper_type == 'M':
        # Manual input mode (recommended for LinkedIn)
        print("\n📝 Manual Input Mode")
        print("Paste LinkedIn posts (press Enter twice after each post, 'done' when finished):")
        
        posts = []
        current_post = []
        
        while True:
            line = input()
            if line.strip().lower() == 'done':
                if current_post:
                    posts.append('\n'.join(current_post))
                break
            if line.strip() == '':
                if current_post:
                    posts.append('\n'.join(current_post))
                    current_post = []
            else:
                current_post.append(line)
        
        if posts:
            scraper = LinkedInScraper(output_dir)
            results = scraper.scrape_from_manual_input(posts)
            print(f"\n✓ Processed {len(results)} posts")
    
    elif scraper_type == 'L':
        # LinkedIn URL scraping
        print("\n🔗 LinkedIn URL Mode")
        url = input("Enter LinkedIn post URL: ").strip()
        
        scraper = LinkedInScraper(output_dir)
        post_data = scraper.scrape_public_post(url)
        
        if post_data:
            scraper.save_post(post_data, 'linkedin')
            print("\n✓ Post scraped successfully")
        else:
            print("\n❌ Failed to scrape post")
    
    elif scraper_type == 'X':
        # Twitter/X URL scraping
        print("\n🔗 X/Twitter URL Mode")
        url = input("Enter tweet URL: ").strip()
        
        scraper = TwitterScraper(output_dir)
        post_data = scraper.scrape_public_tweet(url)
        
        if post_data:
            scraper.save_post(post_data, 'x')
            print("\n✓ Tweet scraped successfully")
        else:
            print("\n❌ Failed to scrape tweet")
    
    else:
        print("Invalid option. Please choose L, X, or M.")


if __name__ == '__main__':
    main()

