# Using Privacy Policy in Framer

Complete guide for adding your privacy policy to your Framer website.

## 🚀 Option 1: Create a New Page in Framer (Recommended)

### Step 1: Create New Page
1. Open your Framer project
2. Click **"+"** to add a new page
3. Name it **"Privacy Policy"** or **"Privacy"**
4. Set the URL to `/privacy-policy` or `/privacy`

### Step 2: Add Content Manually
1. Add a **Text** component
2. Copy content from `privacy-policy.html` (the text parts)
3. Paste into Framer text components
4. Style with Framer's typography tools

**Quick Copy**: Just copy the `<body>` content from `privacy-policy.html` and paste the text portions into Framer.

---

## 🎨 Option 2: Use Custom Code Component (Best for Formatting)

### Step 1: Add Code Component
1. In your Framer page, add a **Code Component**
2. Go to: Insert → Code Component (or drag from components)

### Step 2: Add HTML
1. Click on the Code Component
2. In the code editor, paste this:

```html
<div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
    
    <h1 style="color: #0077B5; border-bottom: 3px solid #0077B5; padding-bottom: 10px; font-size: 2.5em; margin-bottom: 10px;">Privacy Policy</h1>
    <p style="color: #666; font-style: italic; margin-bottom: 30px;">Last Updated: [DATE]</p>

    <p>LinkedIn Deal Magnet ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our LinkedIn profile optimization service (the "Service").</p>

    <h2 style="color: #004182; margin-top: 40px; font-size: 1.8em;">1. Information We Collect</h2>
    
    <h3 style="margin-top: 20px; font-size: 1.3em;">1.1 Information You Provide</h3>
    <p>We collect information you provide directly to us, including:</p>
    <ul style="margin-left: 20px;">
        <li><strong>LinkedIn Profile Data:</strong> When you use our Service, you may provide your LinkedIn profile URL or authorize us to access your LinkedIn profile data through LinkedIn's API.</li>
        <li><strong>Profile Information:</strong> This may include your name, headline, about section, experience, skills, and other publicly available profile information.</li>
        <li><strong>Contact Information:</strong> If you contact us or sign up for our service, we may collect your email address and other contact information.</li>
        <li><strong>Payment Information:</strong> If you purchase our services, our payment processor (Stripe) collects payment information. We do not store your full payment card details.</li>
    </ul>

    <h3 style="margin-top: 20px; font-size: 1.3em;">1.2 Automatically Collected Information</h3>
    <p>We may automatically collect certain information when you use our Service, including:</p>
    <ul style="margin-left: 20px;">
        <li>IP address and browser type</li>
        <li>Device information</li>
        <li>Usage data and analytics</li>
        <li>Cookies and similar tracking technologies</li>
    </ul>

    <h2 style="color: #004182; margin-top: 40px; font-size: 1.8em;">2. How We Use Your Information</h2>
    <p>We use the information we collect to:</p>
    <ul style="margin-left: 20px;">
        <li>Provide, maintain, and improve our Service</li>
        <li>Analyze your LinkedIn profile and provide optimization recommendations</li>
        <li>Process payments and deliver purchased services</li>
        <li>Send you service-related communications</li>
        <li>Respond to your inquiries and provide customer support</li>
        <li>Monitor and analyze usage patterns and trends</li>
        <li>Detect, prevent, and address technical issues</li>
    </ul>

    <h2 style="color: #004182; margin-top: 40px; font-size: 1.8em;">3. Data Sharing and Disclosure</h2>
    <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
    <ul style="margin-left: 20px;">
        <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf, such as payment processing (Stripe), AI analysis services (xAI/Grok), and hosting providers.</li>
        <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests.</li>
        <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred.</li>
    </ul>

    <h2 style="color: #004182; margin-top: 40px; font-size: 1.8em;">4. LinkedIn API Usage</h2>
    <p>When you authorize us to access your LinkedIn profile through LinkedIn's API, we will:</p>
    <ul style="margin-left: 20px;">
        <li>Only access information you explicitly authorize</li>
        <li>Use the information solely to provide our optimization services</li>
        <li>Comply with LinkedIn's API Terms of Use and Privacy Policy</li>
        <li>Not share your LinkedIn data with third parties except as described in this policy</li>
    </ul>

    <h2 style="color: #004182; margin-top: 40px; font-size: 1.8em;">5. Data Security</h2>
    <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.</p>

    <h2 style="color: #004182; margin-top: 40px; font-size: 1.8em;">6. Your Rights and Choices</h2>
    <p>You have the right to:</p>
    <ul style="margin-left: 20px;">
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your information</li>
        <li>Opt-out of certain data collection</li>
        <li>Withdraw consent for LinkedIn API access</li>
    </ul>
    <p>To exercise these rights, please contact us using the information provided below.</p>

    <h2 style="color: #004182; margin-top: 40px; font-size: 1.8em;">7. Contact Us</h2>
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <p>
            <strong>Email:</strong> [YOUR_EMAIL@example.com]<br>
            <strong>Website:</strong> [YOUR_WEBSITE_URL]
        </p>
    </div>

    <h2 style="color: #004182; margin-top: 40px; font-size: 1.8em;">8. Changes to This Privacy Policy</h2>
    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>

</div>
```

### Step 3: Customize
1. Replace `[DATE]` with today's date
2. Replace `[YOUR_EMAIL@example.com]` with your email
3. Replace `[YOUR_WEBSITE_URL]` with your website URL
4. Adjust styling if needed (colors match LinkedIn blue theme)

### Step 4: Make it Responsive
1. Set Code Component width to **Auto**
2. Add padding for mobile: Adjust padding in the inline styles

---

## 📄 Option 3: Import as HTML File (Advanced)

### Step 1: Convert to Framer-Compatible Format
1. Export `privacy-policy.html` content
2. Remove `<html>`, `<head>`, `<body>` tags
3. Keep only the content and inline styles

### Step 2: Use Embed or Code Component
1. Add Code Component
2. Paste the cleaned HTML
3. Adjust styles as needed

---

## 🎯 Recommended Approach for Framer

**Best Option**: **Option 1 (New Page) + Manual Content**

**Why?**
- ✅ Fully integrated with Framer design system
- ✅ Easy to edit later
- ✅ Responsive by default
- ✅ Matches your site's design

**Steps:**
1. Create new page: `/privacy-policy`
2. Add Text components for each section
3. Copy text from `privacy-policy.html`
4. Style with Framer's typography
5. Use your site's design system (colors, fonts)

---

## 📱 Making it Mobile Responsive in Framer

1. **Use Auto Layout**: Use Framer's Auto Layout for spacing
2. **Stack Vertically**: Stack all sections vertically
3. **Responsive Padding**: Use responsive padding values
4. **Text Sizing**: Use responsive text sizes

**Quick Tips:**
- Headings: 2em → 1.5em on mobile
- Padding: 40px → 20px on mobile
- Max width: 800px → 100% on mobile

---

## 🔗 Getting the URL for LinkedIn

Once published in Framer:

1. **Publish your Framer site**
2. **Navigate to the Privacy Policy page**
3. **Copy the URL** (e.g., `https://yourdomain.framer.website/privacy-policy`)
4. **Use this URL** in LinkedIn Developer app setup

**Common Framer URLs:**
- `https://yourdomain.com/privacy-policy`
- `https://yoursite.framer.website/privacy-policy`
- `https://yourdomain.framer.ai/privacy-policy`

---

## ✅ Quick Checklist

- [ ] Create new page in Framer
- [ ] Set page URL to `/privacy-policy`
- [ ] Add content (manual or code component)
- [ ] Replace placeholders (date, email, website)
- [ ] Style to match your site
- [ ] Test on mobile
- [ ] Publish
- [ ] Copy URL for LinkedIn Developer app

---

## 💡 Pro Tips

1. **Match Your Design**: Use your site's colors and typography
2. **Keep It Simple**: Don't over-design - it's a legal document
3. **Mobile First**: Ensure it's readable on mobile
4. **Link in Footer**: Add link to privacy policy in your site footer
5. **Update Date**: Remember to update the "Last Updated" date

---

## 🎨 Styling Tips for Framer

### Colors (Match LinkedIn Theme)
- Primary: `#0077B5` (LinkedIn Blue)
- Secondary: `#004182` (LinkedIn Dark)
- Text: `#333333` or your site's text color

### Typography
- Headings: Bold, 1.5em - 2.5em
- Body: Regular, 1em, line-height: 1.6
- Lists: Margin-left: 20px

### Spacing
- Section spacing: 40px
- Paragraph spacing: 20px
- Max width: 800px (centered)

---

## 🚀 Quick Start (5 Minutes)

1. **In Framer**: Create new page → Name it "Privacy Policy"
2. **Set URL**: `/privacy-policy`
3. **Add Text**: Copy sections from `privacy-policy.html`
4. **Replace**: Date, email, website URL
5. **Style**: Use your site's design system
6. **Publish**: Get URL
7. **Use**: Copy URL for LinkedIn Developer app

That's it! Your privacy policy will be live and ready for LinkedIn Developer app setup. 🎉









