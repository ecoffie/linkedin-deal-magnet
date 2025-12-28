#!/usr/bin/env python3
"""
Post Analysis Script
====================

Analyzes collected social media posts to extract:
- Common hook patterns
- Effective structures
- Engagement correlations
- Insights for knowledge base updates
"""

import json
import os
from collections import Counter, defaultdict
from typing import List, Dict
import re

class PostAnalyzer:
    """Analyze collected posts for patterns and insights"""
    
    def __init__(self, data_dir: str = 'scraped-data'):
        self.data_dir = data_dir
        self.posts = []
    
    def load_posts(self) -> List[Dict]:
        """Load all post JSON files from directory"""
        if not os.path.exists(self.data_dir):
            print(f"Directory {self.data_dir} does not exist")
            return []
        
        posts = []
        for filename in os.listdir(self.data_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(self.data_dir, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        post = json.load(f)
                        posts.append(post)
                except Exception as e:
                    print(f"Error loading {filename}: {e}")
        
        self.posts = posts
        print(f"Loaded {len(posts)} posts")
        return posts
    
    def analyze_hooks(self) -> Dict:
        """Analyze hook patterns across posts"""
        hooks = []
        hook_categories = defaultdict(int)
        
        for post in self.posts:
            hook = post.get('hook', '')
            if hook:
                hooks.append(hook)
                
                # Categorize hooks
                structure = post.get('structure', {})
                if structure.get('question_hook'):
                    hook_categories['question'] += 1
                if structure.get('number_hook'):
                    hook_categories['number'] += 1
                if structure.get('story_hook'):
                    hook_categories['story'] += 1
                if structure.get('unpopular_hook'):
                    hook_categories['unpopular_opinion'] += 1
                if structure.get('stop_hook'):
                    hook_categories['stop'] += 1
                if structure.get('pattern_hook'):
                    hook_categories['pattern'] += 1
        
        # Find most common hook words/phrases
        hook_words = []
        for hook in hooks:
            words = hook.lower().split()[:5]  # First 5 words
            hook_words.extend(words)
        
        common_words = Counter(hook_words).most_common(20)
        
        return {
            'total_hooks': len(hooks),
            'hook_categories': dict(hook_categories),
            'common_hook_words': common_words,
            'sample_hooks': hooks[:10]
        }
    
    def analyze_structure(self) -> Dict:
        """Analyze post structure patterns"""
        structures = {
            'word_count_avg': 0,
            'word_count_median': 0,
            'has_questions': 0,
            'has_numbers': 0,
            'has_hashtags': 0,
            'has_lists': 0,
            'has_emojis': 0,
        }
        
        word_counts = []
        question_count = 0
        number_count = 0
        hashtag_count = 0
        list_count = 0
        emoji_count = 0
        
        for post in self.posts:
            structure = post.get('structure', {})
            word_count = structure.get('word_count', 0)
            word_counts.append(word_count)
            
            if structure.get('has_question'):
                question_count += 1
            if structure.get('has_numbers'):
                number_count += 1
            if structure.get('has_hashtags'):
                hashtag_count += 1
            if structure.get('has_list'):
                list_count += 1
            if structure.get('has_emojis'):
                emoji_count += 1
        
        if word_counts:
            word_counts.sort()
            structures['word_count_avg'] = sum(word_counts) / len(word_counts)
            structures['word_count_median'] = word_counts[len(word_counts) // 2]
        
        structures['has_questions'] = question_count
        structures['has_numbers'] = number_count
        structures['has_hashtags'] = hashtag_count
        structures['has_lists'] = list_count
        structures['has_emojis'] = emoji_count
        
        total = len(self.posts)
        if total > 0:
            structures['question_percentage'] = (question_count / total) * 100
            structures['number_percentage'] = (number_count / total) * 100
            structures['list_percentage'] = (list_count / total) * 100
        
        return structures
    
    def analyze_engagement(self) -> Dict:
        """Analyze engagement patterns (if available)"""
        engagement_data = []
        
        for post in self.posts:
            engagement = post.get('engagement', {})
            if engagement:
                likes = engagement.get('likes') or engagement.get('like') or 0
                comments = engagement.get('comments') or engagement.get('comment') or engagement.get('replies') or 0
                shares = engagement.get('shares') or engagement.get('share') or engagement.get('retweets') or 0
                
                if likes > 0 or comments > 0 or shares > 0:
                    engagement_data.append({
                        'likes': likes,
                        'comments': comments,
                        'shares': shares,
                        'total': likes + comments + shares,
                        'hook': post.get('hook', ''),
                        'structure': post.get('structure', {})
                    })
        
        if not engagement_data:
            return {'message': 'No engagement data available'}
        
        # Sort by total engagement
        engagement_data.sort(key=lambda x: x['total'], reverse=True)
        
        # Analyze top performers
        top_10 = engagement_data[:10]
        
        # Find common patterns in top performers
        top_hook_patterns = defaultdict(int)
        for item in top_10:
            structure = item['structure']
            if structure.get('question_hook'):
                top_hook_patterns['question'] += 1
            if structure.get('number_hook'):
                top_hook_patterns['number'] += 1
            if structure.get('story_hook'):
                top_hook_patterns['story'] += 1
        
        avg_engagement = sum(item['total'] for item in engagement_data) / len(engagement_data)
        
        return {
            'total_with_engagement': len(engagement_data),
            'average_engagement': avg_engagement,
            'top_performers': [
                {
                    'hook': item['hook'],
                    'engagement': item['total'],
                    'likes': item['likes'],
                    'comments': item['comments'],
                    'shares': item['shares']
                }
                for item in top_10
            ],
            'top_hook_patterns': dict(top_hook_patterns)
        }
    
    def generate_insights(self) -> Dict:
        """Generate comprehensive insights report"""
        hooks_analysis = self.analyze_hooks()
        structure_analysis = self.analyze_structure()
        engagement_analysis = self.analyze_engagement()
        
        insights = {
            'summary': {
                'total_posts': len(self.posts),
                'platforms': list(set(post.get('platform', 'Unknown') for post in self.posts))
            },
            'hooks': hooks_analysis,
            'structure': structure_analysis,
            'engagement': engagement_analysis,
            'recommendations': []
        }
        
        # Generate recommendations
        if hooks_analysis['hook_categories']:
            most_common_category = max(hooks_analysis['hook_categories'].items(), key=lambda x: x[1])
            insights['recommendations'].append(
                f"Most common hook type: {most_common_category[0]} ({most_common_category[1]} posts)"
            )
        
        if structure_analysis.get('question_percentage', 0) > 50:
            insights['recommendations'].append(
                "Questions are very common - consider question-based hooks"
            )
        
        if engagement_analysis.get('top_hook_patterns'):
            best_pattern = max(engagement_analysis['top_hook_patterns'].items(), key=lambda x: x[1])
            insights['recommendations'].append(
                f"Best performing hook pattern: {best_pattern[0]} ({best_pattern[1]} of top 10 posts)"
            )
        
        return insights
    
    def export_for_knowledge_base(self, output_file: str = 'hook_insights.json'):
        """Export insights in format suitable for knowledge base updates"""
        insights = self.generate_insights()
        
        # Extract new hook examples
        new_hooks = []
        for post in self.posts[:20]:  # Top 20 as examples
            hook = post.get('hook', '')
            if hook and len(hook) > 10:
                structure = post.get('structure', {})
                hook_type = None
                
                if structure.get('question_hook'):
                    hook_type = 'question-based'
                elif structure.get('number_hook'):
                    hook_type = 'list-framework'
                elif structure.get('story_hook'):
                    hook_type = 'authority-credibility'
                elif structure.get('unpopular_hook'):
                    hook_type = 'controversial-bold'
                elif structure.get('stop_hook'):
                    hook_type = 'problem-solution'
                elif structure.get('pattern_hook'):
                    hook_type = 'pattern-trend'
                
                if hook_type:
                    new_hooks.append({
                        'hook': hook,
                        'type': hook_type,
                        'platform': post.get('platform', 'Unknown'),
                        'engagement': post.get('engagement', {})
                    })
        
        export_data = {
            'analysis_date': str(datetime.now()),
            'total_posts_analyzed': len(self.posts),
            'insights': insights,
            'new_hook_examples': new_hooks
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Exported insights to {output_file}")
        return export_data


def main():
    """Main analysis function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Analyze collected social media posts')
    parser.add_argument('--data-dir', default='scraped-data', help='Directory containing post JSON files')
    parser.add_argument('--export', action='store_true', help='Export insights for knowledge base')
    parser.add_argument('--output', default='hook_insights.json', help='Output file for exported insights')
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("Social Media Post Analyzer")
    print("=" * 60)
    print()
    
    analyzer = PostAnalyzer(data_dir=args.data_dir)
    analyzer.load_posts()
    
    if not analyzer.posts:
        print("No posts found to analyze")
        return
    
    print("\n" + "=" * 60)
    print("Analysis Results")
    print("=" * 60)
    
    insights = analyzer.generate_insights()
    
    # Print summary
    print(f"\n📊 Summary:")
    print(f"  Total posts: {insights['summary']['total_posts']}")
    print(f"  Platforms: {', '.join(insights['summary']['platforms'])}")
    
    # Print hook analysis
    print(f"\n🎣 Hook Analysis:")
    print(f"  Total hooks found: {insights['hooks']['total_hooks']}")
    print(f"  Hook categories:")
    for category, count in insights['hooks']['hook_categories'].items():
        print(f"    - {category}: {count}")
    
    if insights['hooks']['common_hook_words']:
        print(f"  Most common hook words:")
        for word, count in insights['hooks']['common_hook_words'][:5]:
            print(f"    - '{word}': {count} times")
    
    # Print structure analysis
    print(f"\n📐 Structure Analysis:")
    structure = insights['structure']
    print(f"  Average word count: {structure['word_count_avg']:.1f}")
    print(f"  Median word count: {structure['word_count_median']:.0f}")
    print(f"  Posts with questions: {structure['has_questions']} ({structure.get('question_percentage', 0):.1f}%)")
    print(f"  Posts with numbers: {structure['has_numbers']} ({structure.get('number_percentage', 0):.1f}%)")
    print(f"  Posts with lists: {structure['has_lists']} ({structure.get('list_percentage', 0):.1f}%)")
    
    # Print engagement analysis
    if 'message' not in insights['engagement']:
        print(f"\n📈 Engagement Analysis:")
        engagement = insights['engagement']
        print(f"  Posts with engagement data: {engagement['total_with_engagement']}")
        print(f"  Average engagement: {engagement['average_engagement']:.1f}")
        if engagement.get('top_hook_patterns'):
            print(f"  Best performing hook patterns:")
            for pattern, count in engagement['top_hook_patterns'].items():
                print(f"    - {pattern}: {count} of top 10 posts")
    
    # Print recommendations
    if insights['recommendations']:
        print(f"\n💡 Recommendations:")
        for rec in insights['recommendations']:
            print(f"  - {rec}")
    
    # Export if requested
    if args.export:
        print(f"\n" + "=" * 60)
        analyzer.export_for_knowledge_base(args.output)
    
    print("\n" + "=" * 60)
    print("Analysis complete!")
    print("=" * 60)


if __name__ == '__main__':
    from datetime import datetime
    main()

