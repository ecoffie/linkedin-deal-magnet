# Content Engine Testing Guide

Guide for testing and perfecting the Content Engine before launch.

## 🧪 Testing Interface

**File**: `content-engine-test.html`

A simple testing interface where you can:
- Input customer website URLs
- Paste customer content
- Generate content and review results
- Copy posts to clipboard

## 🚀 Quick Start

1. **Start your server**:
   ```bash
   npm run dev
   ```

2. **Open test page**:
   - Visit: `http://localhost:3000/content-engine-test.html`
   - Or open the file directly in browser

3. **Test with a real customer**:
   - Enter their website URL
   - Or paste their content
   - Click "Generate Content"

4. **Review and iterate**:
   - Check if insights are accurate
   - Review generated posts quality
   - Adjust prompts as needed

## 📊 What Gets Tested

### 1. Website Scraping
- Can we extract meaningful content from URLs?
- Does it work with different website structures?
- Are we getting the right information?

### 2. Content Analysis
- Does Grok correctly identify:
  - Business type
  - Target audience
  - Key services
  - Pain points

### 3. Content Generation
- Are posts:
  - Authentic and on-brand?
  - Engaging and valuable?
  - Not copying verbatim?
  - Right length for LinkedIn?

## 🎯 Testing Scenarios

### Scenario 1: Government Contractor Website
**Test URL**: A real govcon company website
**Expected**: Posts about federal contracting, winning contracts, etc.

### Scenario 2: Service Business
**Test URL**: HVAC, construction, IT services
**Expected**: Posts highlighting services and customer wins

### Scenario 3: Just Pasted Content
**Test**: Paste content without URL
**Expected**: Should still generate good posts

### Scenario 4: Multiple URLs
**Test**: Main site + case studies + about page
**Expected**: Richer, more accurate content

## 🔧 Improving Results

### If Content Quality is Poor:

1. **Increase Source Content**:
   - Add more URLs (case studies, about, services)
   - Paste more detailed content
   - Include customer descriptions

2. **Refine Grok Prompt**:
   - Edit the prompt in `generateContentWithGrok()` function
   - Add more specific instructions
   - Adjust temperature (0.7 = creative, 0.3 = more focused)

3. **Better Scraping**:
   - Improve selector logic in `scrapeWebsiteContent()`
   - Handle different website structures
   - Extract more meaningful content

### If Insights are Wrong:

1. **Add More Context**:
   - Include description field
   - Provide industry context
   - Add customer type hints

2. **Improve Prompt Analysis**:
   - Make analysis section more explicit
   - Ask Grok to be more specific
   - Provide examples of good insights

## 📝 Testing Checklist

- [ ] Can scrape basic website
- [ ] Can scrape multiple URLs
- [ ] Can use pasted content
- [ ] Insights are reasonably accurate
- [ ] Posts are original (not copied)
- [ ] Posts are engaging
- [ ] Posts are appropriate length
- [ ] Hashtags are relevant
- [ ] Error handling works
- [ ] Loading states work
- [ ] Copy function works

## 🐛 Common Issues

### Issue: "No content found"
**Solution**: 
- Check if URL is accessible
- Try pasting content directly
- Verify URL is correct

### Issue: "Failed to scrape"
**Solution**:
- Website may block scraping
- Try using pasted content instead
- Check console for errors

### Issue: Posts are generic
**Solution**:
- Provide more detailed source content
- Add description field
- Include case studies or specific examples

### Issue: Posts copy verbatim
**Solution**:
- This is in the prompt already
- If happening, strengthen the "do not copy" instruction
- Adjust temperature lower (0.5 instead of 0.7)

## 🔄 Iteration Process

1. **Test with 3-5 different customers**
2. **Note what works and what doesn't**
3. **Refine prompts based on results**
4. **Improve scraping if needed**
5. **Test again with same customers**
6. **Compare before/after quality**

## 📈 Success Metrics

Good content generation means:
- ✅ Posts sound authentic to the customer
- ✅ Posts provide value to target audience
- ✅ Posts are original (not copied)
- ✅ Posts are engaging and shareable
- ✅ Insights are reasonably accurate

## 🚀 Next Steps After Testing

Once you're happy with quality:

1. **Simplify intake form** (just URLs + paste)
2. **Add to main app** (link from subscription)
3. **Store in database** (save customer profiles)
4. **Schedule generation** (weekly/monthly batches)
5. **Email delivery** (send posts to users)

## 💡 Pro Tips

1. **Test with real customers** you know
2. **Compare AI posts to real posts** from same company
3. **Get feedback** from people who know the customer
4. **Save good examples** to improve prompts
5. **Document what works** for different industries

---

**Start testing now**: Open `content-engine-test.html` and try it with a real customer website!





