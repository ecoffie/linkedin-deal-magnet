import { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'

const CaseStudyGenerator = () => {
  const [formData, setFormData] = useState({
    clientType: '',
    timeline: '',
    startingPoint: '',
    activities: '',
    outcome: '',
    contractValue: '',
    wantToNameClient: false,
    clientName: '',
  })

  const [generatedCaseStudy, setGeneratedCaseStudy] = useState('')
  const [copied, setCopied] = useState(false)

  const generateCaseStudy = () => {
    if (!formData.startingPoint || !formData.outcome) {
      alert('Please fill in at least the starting point and outcome')
      return
    }

    let caseStudy = ''

    if (formData.wantToNameClient && formData.clientName) {
      caseStudy = `Case Study: ${formData.clientName}

`
    } else {
      caseStudy = `Case Study: Client Success Story

`
    }

    caseStudy += `Starting Point:
${formData.startingPoint || '[Describe where they started]'}

`
    caseStudy += `Timeline:
${formData.timeline || '[When did you start working together?]'}

`
    if (formData.activities) {
      caseStudy += `Activities & Process:
${formData.activities}

`
    }

    caseStudy += `Results:
${formData.outcome || '[What did they achieve?]'}

`
    if (formData.contractValue) {
      caseStudy += `Contract Value: ${formData.contractValue}

`
    }

    caseStudy += `---
This is a great way to showcase your results without always naming clients. You can share metrics, timelines, and outcomes while maintaining confidentiality if needed.`

    setGeneratedCaseStudy(caseStudy)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCaseStudy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exampleCaseStudies = [
    {
      title: 'Timeline-Based Case Study',
      content: `Client Success Story: From Zero to First Contract in 4 Months

📅 Timeline:
• August 2023: Initial consultation - client had no federal contracts
• September 2023: Completed SAM.gov registration and market research
• October 2023: Identified 5 target opportunities, submitted first bids
• November 2023: Added to vendor lists, began building relationships
• December 2023: First contract awarded - $250,000

Starting Point:
When I met this HVAC contractor in August, they had been trying to break into federal contracting for over a year with no success. They were overwhelmed by the complexity of the process and didn't know where to start.

What We Did:
• Simplified the SAM.gov registration process
• Identified their NAICS codes and target agencies
• Created a capability statement
• Developed a bidding strategy
• Connected them with key decision-makers

Results:
Secured their first federal contract worth $250,000 within 4 months. They're now positioned to bid on larger opportunities and have multiple contracts in the pipeline.

This proves that with the right strategy and support, breaking into federal contracting is absolutely achievable. 💪

#GovernmentContracting #FederalContracts #SmallBusiness`,
    },
    {
      title: 'Results-Focused Case Study',
      content: `How We Helped a Construction Company Win $2M in Federal Contracts

I don't always share client names, but I love sharing results.

Starting Point:
Construction company with strong private sector experience, zero federal contracts.

Challenge:
Complex bidding process, unclear requirements, difficulty finding opportunities.

Solution:
• Simplified contract language into actionable steps
• Developed targeted capability statement
• Created strategic bidding calendar
• Built relationships with contracting officers

Results:
📊 $2M in contracts secured in first year
📊 8 successful bid submissions
📊 3 long-term partnerships established
📊 Revenue increased by 40%

The best part? They're now able to navigate the process independently and are scaling their federal contracting division.

If you're ready to break into federal contracting, let's talk. DM me or visit [website] to schedule a consultation.

#GovernmentContracting #Construction #FederalContracts`,
    },
    {
      title: 'Problem-Solution Case Study',
      content: `Struggling to Win Government Contracts? Here's How We Solved It

I recently worked with a client who was frustrated. They had:
❌ Submitted 20+ bids with zero wins
❌ Spent thousands on proposals that went nowhere
❌ No clear strategy or understanding of the process

The Problem:
They were bidding on everything, using generic proposals, and had no relationships with contracting officers.

The Solution:
We created a focused strategy:
✅ Identified 3 target agencies (instead of casting a wide net)
✅ Developed agency-specific proposals
✅ Built relationships with key decision-makers
✅ Simplified their capability statement
✅ Created a systematic approach to opportunity identification

The Results:
🎯 First contract won within 6 weeks
🎯 70% win rate on targeted bids
🎯 $500K in contracts in first 6 months
🎯 Clear path forward for scaling

The key? Focus beats volume every time.

Want to know how we can help your business? Let's connect.`,
    },
  ]

  const caseStudyTips = [
    'Share contract wins without naming clients if needed',
    'Use timelines to show progression and results',
    'Include metrics and numbers - they tell a powerful story',
    'Focus on transformation - where they started vs. where they ended',
    'Show the process, not just the outcome',
    'Make it relatable - other businesses facing the same challenges will connect',
    'End with a call-to-action',
    'Use LinkedIn formatting (emojis, bullet points, line breaks) for easy reading',
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-linkedin-blue" />
          <h2 className="text-3xl font-bold text-gray-800">Case Study Generator</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Create compelling case studies to showcase your results and contract wins. Share success
          stories without always naming clients to maintain confidentiality.
        </p>
      </div>

      {/* Generator Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Generate Your Case Study</h3>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Type (optional)
              </label>
              <input
                type="text"
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                placeholder="e.g., HVAC contractor, construction company"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Value (optional)
              </label>
              <input
                type="text"
                value={formData.contractValue}
                onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                placeholder="e.g., $250,000 or $2M"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline *
            </label>
            <textarea
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              placeholder="e.g., August 2023: Started | September: First bids | October: Contract won"
              className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Point *
            </label>
            <textarea
              value={formData.startingPoint}
              onChange={(e) => setFormData({ ...formData, startingPoint: e.target.value })}
              placeholder="e.g., Client had no federal contracts, was struggling to navigate the process"
              className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activities/Process (optional)
            </label>
            <textarea
              value={formData.activities}
              onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
              placeholder="e.g., Completed SAM.gov registration, identified target opportunities, created capability statement"
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outcome/Results *
            </label>
            <textarea
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              placeholder="e.g., Secured first contract worth $250K, now positioned for larger opportunities"
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="nameClient"
              checked={formData.wantToNameClient}
              onChange={(e) => setFormData({ ...formData, wantToNameClient: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="nameClient" className="text-sm text-gray-700">
              I want to name the client (if yes, fill in client name below)
            </label>
          </div>

          {formData.wantToNameClient && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Client company name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-linkedin-blue focus:border-transparent"
              />
            </div>
          )}

          <button
            onClick={generateCaseStudy}
            className="w-full bg-linkedin-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-linkedin-dark transition-colors"
          >
            Generate Case Study
          </button>
        </div>
      </div>

      {/* Generated Output */}
      {generatedCaseStudy && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Generated Case Study</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-linkedin-blue text-white rounded-lg hover:bg-linkedin-dark transition-colors"
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
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <pre className="whitespace-pre-wrap font-sans text-gray-800">{generatedCaseStudy}</pre>
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Case Study Examples</h3>
        <div className="space-y-6">
          {exampleCaseStudies.map((example, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-4">{example.title}</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                  {example.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4">💡 Case Study Best Practices</h3>
        <ul className="space-y-2">
          {caseStudyTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span>✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CaseStudyGenerator










