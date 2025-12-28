#!/usr/bin/env python3
"""
Convert markdown article to PDF
"""
import re
import sys

def markdown_to_html(markdown_text):
    """Convert markdown to HTML with styling"""
    
    html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FY2026 NDAA - What Government Contractors Need to Know</title>
    <style>
        @page {
            size: letter;
            margin: 1in;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #1a1a1a;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 10px;
            margin-top: 30px;
        }
        h2 {
            color: #0066cc;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 1.5em;
        }
        h3 {
            color: #333;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 15px;
        }
        ul, ol {
            margin-bottom: 15px;
            padding-left: 30px;
        }
        li {
            margin-bottom: 8px;
        }
        strong {
            color: #0066cc;
            font-weight: 600;
        }
        hr {
            border: none;
            border-top: 2px solid #e0e0e0;
            margin: 30px 0;
        }
        .emoji {
            font-size: 1.2em;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .hashtags {
            background-color: #f9f9f9;
            padding: 15px;
            border-left: 4px solid #0066cc;
            margin-top: 30px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
"""
    
    # Convert markdown to HTML
    lines = markdown_text.split('\n')
    in_list = False
    in_code = False
    
    for line in lines:
        # Headers
        if line.startswith('# '):
            html += f'<h1>{line[2:].strip()}</h1>\n'
        elif line.startswith('## '):
            html += f'<h2>{line[3:].strip()}</h2>\n'
        elif line.startswith('### '):
            html += f'<h3>{line[4:].strip()}</h3>\n'
        # Horizontal rule
        elif line.strip() == '---':
            html += '<hr>\n'
        # Lists
        elif line.strip().startswith('- '):
            if not in_list:
                html += '<ul>\n'
                in_list = True
            # Convert checkmarks and bold
            content = line[2:].strip()
            content = content.replace('✅', '<span class="emoji">✅</span>')
            content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
            html += f'<li>{content}</li>\n'
        elif line.strip().startswith('*'):
            if not in_list:
                html += '<ul>\n'
                in_list = True
            content = line[1:].strip()
            content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
            html += f'<li>{content}</li>\n'
        # Numbered lists
        elif re.match(r'^\d+\.\s', line):
            if not in_list:
                html += '<ol>\n'
                in_list = True
            content = re.sub(r'^\d+\.\s', '', line)
            content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
            html += f'<li>{content}</li>\n'
        # End lists
        elif in_list and line.strip() == '':
            html += '</ul>\n' if not re.match(r'^\d+\.', lines[lines.index(line)-1] if lines.index(line) > 0 else '') else '</ol>\n'
            in_list = False
        # Paragraphs
        elif line.strip():
            # Convert bold
            content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
            # Convert emojis (keep them)
            html += f'<p>{content}</p>\n'
        else:
            html += '<br>\n'
    
    if in_list:
        html += '</ul>\n'
    
    html += """
</body>
</html>
"""
    return html

if __name__ == '__main__':
    input_file = 'bootcamp/LINKEDIN_ARTICLE_FY2026_NDAA.md'
    output_html = 'bootcamp/LINKEDIN_ARTICLE_FY2026_NDAA.html'
    
    with open(input_file, 'r', encoding='utf-8') as f:
        markdown_content = f.read()
    
    html_content = markdown_to_html(markdown_content)
    
    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"HTML file created: {output_html}")
    print("You can now open this HTML file in a browser and print to PDF, or use a tool to convert it.")



