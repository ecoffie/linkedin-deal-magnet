# LinkedIn Deal Magnet - AI Prompts

This directory contains all AI prompts used in the LinkedIn Deal Magnet platform.

## Prompt Catalog

### Core Product Prompts

| Prompt | File | Used In | Frequency |
|--------|------|---------|-----------|
| **LinkedIn Profile Audit** | `linkedin-profile-audit.md` | `/api/audit-manual` | Every free audit |
| **Headline Generator** | `headline-generator.md` | Audit flow, standalone tool | Every audit |
| **About Section Rewriter** | `about-section-rewriter.md` | $97 paid service | Every paid conversion |
| **Experience Optimizer** | `experience-optimizer.md` | $97 paid service | 3x per paid customer |
| **LinkedIn Post Generator** | `linkedin-post-generator.md` | Content generator tool | Pro users daily |

### Marketing & Support Prompts

| Prompt | File | Used In | Frequency |
|--------|------|---------|-----------|
| **Email Sequence Writer** | `email-sequence.md` | Email campaigns | Weekly/monthly |
| **Testimonial Formatter** | `testimonial-formatter.md` | Marketing pages | As testimonials come in |
| **Competitor Analysis** | `competitor-analysis.md` | Market research | Monthly |

### Future/Phase 2 Prompts

| Prompt | File | Status |
|--------|------|--------|
| **Resume Tailor** | `resume-tailor.md` | Phase 1.5 |
| **Cover Letter Generator** | `cover-letter-generator.md` | Phase 2 |
| **Interview Prep Coach** | `interview-prep.md` | Phase 2 |

## Prompt Development Guidelines

### 1. Structure Every Prompt With:
- **Purpose statement**: What this prompt does in one sentence
- **Instructions**: Clear role definition and task breakdown
- **Input requirements**: What data/context is needed
- **Output format**: Exact structure expected (JSON, markdown, etc.)
- **Examples**: 3-5 real examples showing good inputs → outputs
- **Quality checklist**: How to verify output is correct
- **Common mistakes**: What to avoid

### 2. Versioning
- Track prompt changes in git
- Use semantic versioning in comments (v1.0, v1.1, v2.0)
- Document WHY changes were made in commit messages

### 3. Testing
- Test every prompt with 5+ real examples before deploying
- Compare outputs across different AI models (Claude, GPT-4, Grok)
- Collect user feedback and iterate

### 4. Performance Optimization
- Keep prompts concise but complete
- Use JSON output for structured data (easier to parse)
- Include token count estimates in comments
- Front-load critical instructions (models pay more attention to start)

## Slash Commands (Skills)

All prompts in `.claude/commands/` are available as slash commands:

| Slash Command | Prompt File | Usage |
|---------------|-------------|-------|
| `/generate-linkedin-headline` | `generate-linkedin-headline.md` | Generate 3 headline options |
| `/audit-linkedin-profile` | `audit-linkedin-profile.md` | Full profile audit with score |
| `/rewrite-linkedin-about` | `rewrite-linkedin-about.md` | Rewrite About section |

To use: Type the slash command in Claude Code and provide the required inputs.

## Prompt Engineering Best Practices

### ✅ DO:
- Define the AI's role clearly ("You are a LinkedIn optimization expert")
- Provide specific scoring rubrics with point values
- Include multiple examples showing variety
- Request structured outputs (JSON for APIs)
- Set constraints (character limits, word counts)
- Test with edge cases (empty fields, very long inputs)

### ❌ DON'T:
- Assume the AI knows context (be explicit)
- Use vague instructions ("make it good")
- Forget to specify output format
- Skip quality checks
- Over-engineer (simple is better)

## Testing New Prompts

Before adding a new prompt to production:

1. **Create test file**: `tests/prompts/[prompt-name].test.md`
2. **Run 10+ test cases**: Variety of inputs (short, long, edge cases)
3. **Compare models**: Test on Claude, GPT-4, Grok (if fallback needed)
4. **Measure quality**: Score outputs 1-10 for accuracy, usefulness, tone
5. **Get feedback**: Show to 3-5 target users
6. **Iterate**: Refine based on feedback
7. **Deploy**: Add to `.claude/commands/` or API endpoint
8. **Monitor**: Track user satisfaction, error rates

## Prompt Changelog

### v1.0 - March 19, 2026
- Initial prompt library created
- Added: headline generator, profile audit, about section rewriter
- Tested with 20+ real LinkedIn profiles
- Average quality score: 8.5/10

---

**Last Updated:** March 19, 2026
