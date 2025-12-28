#!/usr/bin/env python3
"""
Manual Hook Collector
=====================

Interactive script to manually collect hook examples from articles, PDFs, or guides.
Use this when you find a great article or guide with LinkedIn hook examples.

This is often more reliable than automated scraping for structured content.
"""

import json
import os
import re
from datetime import datetime
from typing import List, Dict

class ManualHookCollector:
    """Interactive tool for manually collecting hook examples"""
    
    def __init__(self, output_dir: str = 'scraped-data/hook-examples'):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.examples = []
        self.current_source = {}
    
    def collect_from_source(self, source_title: str, source_url: str = ''):
        """Start collecting examples from a source"""
        self.current_source = {
            'source_title': source_title,
            'source_url': source_url,
            'examples': [],
            'collected_at': datetime.now().isoformat()
        }
        
        print(f"\n📝 Collecting from: {source_title}")
        if source_url:
            print(f"   URL: {source_url}")
        print("\nEnter hook examples. Type 'done' when finished.")
        print("Format: Enter the hook on one line, then the full post (if available)")
        print("Or just the hook if you only have the hook.\n")
        
        example_count = 0
        
        while True:
            print(f"\n--- Example {example_count + 1} ---")
            hook = input("Hook (or 'done' to finish): ").strip()
            
            if hook.lower() == 'done':
                break
            
            if not hook:
                print("Skipping empty hook...")
                continue
            
            # Ask for full post (optional)
            print("\nFull post (optional - press Enter to skip):")
            post_lines = []
            while True:
                line = input()
                if line.strip() == '':
                    break
                post_lines.append(line)
            
            post = '\n'.join(post_lines).strip() if post_lines else None
            
            example = {
                'hook': hook,
                'post': post if post else None
            }
            
            self.current_source['examples'].append(example)
            example_count += 1
            
            print(f"✓ Added example {example_count}")
        
        if self.current_source['examples']:
            self.examples.append(self.current_source)
            print(f"\n✓ Collected {len(self.current_source['examples'])} examples from {source_title}")
    
    def save_all(self, filename: str = None):
        """Save all collected examples"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'manual_hooks_{timestamp}.json'
        
        filepath = os.path.join(self.output_dir, filename)
        
        # Flatten examples
        flattened = []
        for source in self.examples:
            for example in source.get('examples', []):
                flattened.append({
                    'hook': example.get('hook'),
                    'post': example.get('post'),
                    'source_title': source.get('source_title'),
                    'source_url': source.get('source_url'),
                    'collected_at': source.get('collected_at'),
                })
        
        output = {
            'metadata': {
                'total_examples': len(flattened),
                'total_sources': len(self.examples),
                'generated_at': datetime.now().isoformat(),
                'collection_method': 'manual'
            },
            'examples': flattened,
            'sources': self.examples
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Saved {len(flattened)} examples to {filepath}")
        return filepath
    
    def add_from_text(self, source_title: str, text: str, source_url: str = ''):
        """
        Add examples from a text block (e.g., copied from an article)
        Attempts to parse structured content automatically
        """
        print(f"\n📄 Parsing examples from text: {source_title}")
        
        lines = text.split('\n')
        examples = []
        current_hook = None
        current_post = []
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_hook and current_post:
                    examples.append({
                        'hook': current_hook,
                        'post': '\n'.join(current_post).strip()
                    })
                    current_hook = None
                    current_post = []
                continue
            
            # Look for numbered hooks (1., 2., etc.)
            numbered_match = re.match(r'^(\d+)[.)]\s*(.+)$', line)
            if numbered_match:
                if current_hook and current_post:
                    examples.append({
                        'hook': current_hook,
                        'post': '\n'.join(current_post).strip()
                    })
                current_hook = numbered_match.group(2).strip()
                current_post = []
                continue
            
            # Look for bullet points
            bullet_match = re.match(r'^[-*•]\s*(.+)$', line)
            if bullet_match:
                bullet_text = bullet_match.group(1).strip()
                # If it's short, it's probably a hook
                if len(bullet_text) < 200:
                    if current_hook and current_post:
                        examples.append({
                            'hook': current_hook,
                            'post': '\n'.join(current_post).strip()
                        })
                    current_hook = bullet_text
                    current_post = []
                    continue
            
            # Otherwise, add to post
            if current_hook:
                current_post.append(line)
        
        # Add last example
        if current_hook:
            examples.append({
                'hook': current_hook,
                'post': '\n'.join(current_post).strip() if current_post else None
            })
        
        if examples:
            source_data = {
                'source_title': source_title,
                'source_url': source_url,
                'examples': examples,
                'collected_at': datetime.now().isoformat()
            }
            self.examples.append(source_data)
            print(f"✓ Parsed {len(examples)} examples")
        else:
            print("⚠️  No examples found in text")
        
        return examples


def main():
    """Main interactive function"""
    import re
    
    print("=" * 60)
    print("Manual Hook Collector")
    print("=" * 60)
    print()
    print("Use this tool to manually collect hook examples from:")
    print("- Articles you find online")
    print("- PDF guides")
    print("- Blog posts")
    print("- Your own research")
    print()
    
    collector = ManualHookCollector()
    
    while True:
        print("\n" + "=" * 60)
        print("Options:")
        print("1. Add examples from a source (interactive)")
        print("2. Add examples from text block (paste & parse)")
        print("3. View collected examples")
        print("4. Save and exit")
        print("=" * 60)
        
        choice = input("\nChoose option (1-4): ").strip()
        
        if choice == '1':
            title = input("Source title: ").strip()
            url = input("Source URL (optional): ").strip()
            collector.collect_from_source(title, url)
        
        elif choice == '2':
            title = input("Source title: ").strip()
            url = input("Source URL (optional): ").strip()
            print("\nPaste the text (containing hooks/examples):")
            print("Press Enter twice when finished\n")
            
            text_lines = []
            empty_count = 0
            while True:
                line = input()
                if line.strip() == '':
                    empty_count += 1
                    if empty_count >= 2:
                        break
                else:
                    empty_count = 0
                    text_lines.append(line)
            
            text = '\n'.join(text_lines)
            collector.add_from_text(title, text, url)
        
        elif choice == '3':
            total = sum(len(s.get('examples', [])) for s in collector.examples)
            print(f"\nCollected {total} examples from {len(collector.examples)} sources:")
            for i, source in enumerate(collector.examples, 1):
                print(f"  {i}. {source.get('source_title')}: {len(source.get('examples', []))} examples")
        
        elif choice == '4':
            if collector.examples:
                collector.save_all()
            print("\nGoodbye!")
            break
        
        else:
            print("Invalid option. Please choose 1-4.")


if __name__ == '__main__':
    main()

