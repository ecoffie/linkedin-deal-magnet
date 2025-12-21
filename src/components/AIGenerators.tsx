import { useState } from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'

const AIGenerators = () => {
  const [headlineInput, setHeadlineInput] = useState('')
  const [generatedHeadline, setGeneratedHeadline] = useState('')
  const [aboutInput, setAboutInput] = useState('')
  const [generatedAbout, setGeneratedAbout] = useState('')
  const [copied, setCopied] = useState(false)

  const generateHeadline = () => {
    if (!headlineInput.trim()) {
      alert('Please describe what you do first')
      return
    }

    // Simulated AI generation - in production, this would call an AI API
    const prompt = headlineInput.toLowerCase()
    let generated = ''

    if (prompt.includes('government') || prompt.includes('contract')) {
      generated = `Strategic Business Development Expert | Helping SMBs Win Federal Contracts | Simplified Government Contracting for Growth-Ready Companies`
    } else if (prompt.includes('consult') || prompt.includes('solve')) {
      generated = `Strategic Problem Solver | Transforming Complex Business Challenges into IT Solutions | 20+ Years Delivering Results for Federal & Fortune 500`
    } else if (prompt.includes('construction') || prompt.includes('build')) {
      generated = `Construction Industry Leader | Government Contractor | Building Infrastructure & Relationships | HVAC & Facilities Management Expert`
    } else {
      generated = `[Your Role] | [Who You Help] | [Key Benefit/Outcome] | [Differentiator]`
    }

    setGeneratedHeadline(generated)
  }

  const generateAbout = () => {
    if (!aboutInput.trim()) {
      alert('Please provide information about yourself first')
      return
    }

    // Simulated AI generation
    const generated = `About Section Template:

[Personal Opening - Who you are]
I'm [Name], a [background/location]. When I'm not [hobby/interest], I'm passionate about [personal interest].

[Professional Transition]
But professionally, I help [target audience] [solve problem/achieve outcome].

[What You Do]
With over [X] years of experience in [industry/field], I specialize in [key services/expertise]. I work with [target clients] to [specific outcomes].

[Accomplishments/Highlights]
• [Achievement 1 with metrics]
• [Achievement 2 with metrics]
• [Notable accomplishment]

[Call to Action]
[How to connect/reach out/learn more]

---

Tips for your about section:
• Make it personal first, then professional
• Use spacing and paragraphs for easy reading
• Include metrics and accomplishments
• Add a clear call-to-action
• Format for mobile reading`

    setGeneratedAbout(generated)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const headlineExamples = [
    {
      before: 'Operations Manager',
      after: 'Operations Excellence Leader | Streamlining Business Processes for SMBs | Driving Efficiency & Growth',
    },
    {
      before: 'Federal Business Development',
      after: 'Federal Business Development Strategist | Connecting Government Contractors with Opportunities | $50M+ in Contracts Secured',
    },
    {
      before: 'Senior Consultant',
      after: 'Strategic Business Consultant | Solving Complex Problems for Federal & Fortune 500 | 20+ Years Transforming Organizations',
    },
  ]

  const aboutExamples = [
    {
      title: 'Personal + Professional Blend',
      text: `I'm a mom of two, a salsa dancer, and a coffee enthusiast ☕

But professionally, I help government contractors navigate the complex world of federal contracting. With 15+ years in the industry, I've helped over 50 companies secure their first government contracts.

When I'm not analyzing RFPs, you'll find me at networking events (I attend a LOT of them!) or sharing insights on LinkedIn about the government contracting space.

Want to learn more about how I can help your business? Connect with me or visit [website].`,
    },
    {
      title: 'Problem-Solution Focus',
      text: `Struggling to win government contracts? I've been there.

After years of trying to figure out the federal contracting process on my own, I decided to simplify it for others. I help SMBs break down complex government contracts into simple language, write winning proposals, and navigate the paperwork maze.

Results? My clients have secured over $5M in contracts in the past year.

Ready to get your first (or next) government contract? Let's talk.`,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl font-bold text-gray-800">AI-Powered Content Generators</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Use AI to generate optimized headlines and about sections for your LinkedIn profile. These
          tools help you create catchy, engaging content that converts.
        </p>
      </div>

      {/* Headline Generator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Headline Generator</h3>
        <p className="text-gray-600 mb-6">
          Your headline appears right under your name - make it catchy and value-driven. Use
          ChatGPT to generate multiple options, then pick the best one.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe what you do, who you help, and your key value proposition:
            </label>
            <textarea
              value={headlineInput}
              onChange={(e) => setHeadlineInput(e.target.value)}
              placeholder="Example: I help government contractors win federal contracts. I've been in the industry for 15 years and helped 50+ companies get their first contracts."
              className="w-full border border-gray-300 rounded-lg p-4 h-32 focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
            />
          </div>

          <button
            onClick={generateHeadline}
            className="bg-linkedin-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-linkedin-dark transition-colors"
          >
            Generate Headline Ideas
          </button>

          {generatedHeadline && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h4 className="font-bold text-blue-900">Generated Headline:</h4>
                <button
                  onClick={() => copyToClipboard(generatedHeadline)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-blue-900 font-semibold text-lg">{generatedHeadline}</p>
              <p className="text-blue-700 text-sm mt-4">
                💡 Tip: Generate multiple variations using ChatGPT. Try different angles - problem-solution, 
                credentials-focused, results-driven, or personal-brand focused.
              </p>
            </div>
          )}

          <div className="border-t pt-6">
            <h4 className="font-bold text-gray-800 mb-4">Before & After Examples:</h4>
            <div className="space-y-4">
              {headlineExamples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-red-600">❌ Before:</span>
                    <p className="text-gray-700">{example.before}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-green-600">✅ After:</span>
                    <p className="text-gray-900 font-semibold">{example.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About Section Generator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">About Section Generator</h3>
        <p className="text-gray-600 mb-6">
          Your about section should blend personal and professional elements. Start with who you are
          as a person, then transition to what you do professionally.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell me about yourself (personal info, professional background, accomplishments,
              who you help):
            </label>
            <textarea
              value={aboutInput}
              onChange={(e) => setAboutInput(e.target.value)}
              placeholder="Example: I'm a construction business owner based in Milwaukee. I started my business 5 years ago and have won several government contracts. I help other small contractors understand the federal contracting process. I love attending networking events and I recently won two roundtrip airline tickets!"
              className="w-full border border-gray-300 rounded-lg p-4 h-40 focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
            />
          </div>

          <button
            onClick={generateAbout}
            className="bg-linkedin-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-linkedin-dark transition-colors"
          >
            Generate About Section Template
          </button>

          {generatedAbout && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h4 className="font-bold text-purple-900">Generated About Section Template:</h4>
                <button
                  onClick={() => copyToClipboard(generatedAbout)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="text-purple-900 whitespace-pre-wrap font-sans text-sm">
                {generatedAbout}
              </pre>
            </div>
          )}

          <div className="border-t pt-6">
            <h4 className="font-bold text-gray-800 mb-4">About Section Examples:</h4>
            <div className="space-y-6">
              {aboutExamples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h5 className="font-bold text-gray-800 mb-3">{example.title}</h5>
                  <p className="text-gray-700 whitespace-pre-line">{example.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <h4 className="font-bold text-yellow-900 mb-3">Key Elements to Include:</h4>
            <ul className="list-disc list-inside space-y-2 text-yellow-900">
              <li>
                <strong>Personal touch:</strong> Hobbies, interests, family, background - make it
                relatable
              </li>
              <li>
                <strong>Professional expertise:</strong> What you do, who you help, years of
                experience
              </li>
              <li>
                <strong>Accomplishments:</strong> Metrics, contract wins, client count, revenue
                generated
              </li>
              <li>
                <strong>Formatting:</strong> Use spacing, paragraphs, and line breaks for easy
                mobile reading
              </li>
              <li>
                <strong>Call-to-action:</strong> How to connect, website, calendar link, or service
                request
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ChatGPT Prompt Suggestions */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4">💡 ChatGPT Prompt Ideas</h3>
        <p className="mb-4">
          Copy these prompts and use them with ChatGPT to get better results:
        </p>
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="font-semibold mb-2">For Headlines:</p>
            <p className="text-sm bg-white/20 rounded p-3 font-mono">
              "Create 5 catchy LinkedIn headlines for someone who [describe your role]. The
              headlines should include [who you help] and [key benefit]. Make them engaging and
              value-driven, optimized for LinkedIn's algorithm."
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="font-semibold mb-2">For About Sections:</p>
            <p className="text-sm bg-white/20 rounded p-3 font-mono">
              "Write a LinkedIn about section that blends personal and professional elements. Start
              with [personal info], then transition to [professional info]. Include [accomplishments]
              and end with a call-to-action. Format it for mobile reading with proper spacing and
              paragraphs."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIGenerators










