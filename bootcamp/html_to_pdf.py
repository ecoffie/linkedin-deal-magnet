#!/usr/bin/env python3
"""
Convert HTML to PDF using weasyprint
"""
import sys
import os

try:
    from weasyprint import HTML
except ImportError:
    print("Error: weasyprint not found. Please install it with: pip install weasyprint")
    sys.exit(1)

def convert_html_to_pdf(html_file, pdf_file):
    """Convert HTML file to PDF"""
    try:
        HTML(filename=html_file).write_pdf(pdf_file)
        print(f"✅ PDF created successfully: {pdf_file}")
        return True
    except Exception as e:
        print(f"❌ Error converting to PDF: {e}")
        return False

if __name__ == '__main__':
    html_file = 'bootcamp/LINKEDIN_ARTICLE_FY2026_NDAA.html'
    pdf_file = 'bootcamp/LINKEDIN_ARTICLE_FY2026_NDAA.pdf'
    
    if not os.path.exists(html_file):
        print(f"Error: HTML file not found: {html_file}")
        sys.exit(1)
    
    convert_html_to_pdf(html_file, pdf_file)



