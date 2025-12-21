import { useState } from 'react'
import { CheckCircle2, Circle, AlertTriangle, Info } from 'lucide-react'
import { ChecklistItem } from '../types'

const OptimizationChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: '1',
      category: 'Profile Setup',
      title: 'Update Banner/Billboard',
      description: 'Create a custom banner that includes your branding, tagline, and social proof',
      completed: false,
      priority: 'high',
      tips: [
        'Use your branding colors',
        'Include a one-sentence tagline about what you do',
        'Add logos of companies you work with or awards you\'ve won',
        'Make it eye-catching but not cluttered',
      ],
    },
    {
      id: '2',
      category: 'Profile Setup',
      title: 'Optimize Profile Picture',
      description: 'Use a clear, professional photo with solid background and branding colors',
      completed: false,
      priority: 'high',
      tips: [
        'Shoulder-up framing',
        'Solid background (not busy)',
        'Use branding colors in background to make you pop',
        'Must look like you - use real photos, not AI-generated ones that look different',
        'People need to recognize you in person!',
      ],
    },
    {
      id: '3',
      category: 'Profile Setup',
      title: 'Craft Catchy Headline',
      description: 'Create an engaging headline that clearly states your value proposition',
      completed: false,
      priority: 'high',
      tips: [
        'Use ChatGPT to generate options - describe what you do and ask it to optimize for LinkedIn',
        'Include who you help and what problem you solve',
        'Make it catchy and memorable',
        'Avoid generic titles like "Operations Manager" - tell a story',
      ],
    },
    {
      id: '4',
      category: 'Profile Setup',
      title: 'Write Compelling About Section',
      description: 'Create an about section that combines personal and professional elements',
      completed: false,
      priority: 'high',
      tips: [
        'Start with who you are personally (hobbies, interests, background)',
        'Then transition to what you do professionally',
        'Include who you help and how many',
        'Add accomplishments and highlights',
        'Format for mobile reading - use spacing and paragraphs',
        'Include a call-to-action (website, contact, services)',
        'Use ChatGPT to help optimize and format it',
      ],
    },
    {
      id: '5',
      category: 'Profile Setup',
      title: 'Show Connections Count',
      description: 'Make your connections visible in settings',
      completed: false,
      priority: 'medium',
      tips: [
        'Go to Settings → Visibility → Connections',
        'Enable "Who can see your connections list"',
        'People connect with others who have more connections',
      ],
    },
    {
      id: '6',
      category: 'Profile Setup',
      title: 'Add Website Link',
      description: 'Include your website or landing page in your profile',
      completed: false,
      priority: 'high',
      tips: [
        'Add it in the contact information section',
        'Make it easy for people to learn more about you',
        'You can also add links in your featured section',
      ],
    },
    {
      id: '7',
      category: 'Experience & Credibility',
      title: 'Enhance Experience Section',
      description: 'Add detailed accomplishments and metrics to your experience entries',
      completed: false,
      priority: 'high',
      tips: [
        'Don\'t just list job titles - describe accomplishments',
        'Include metrics (contracts won, revenue generated, etc.)',
        'Highlight what makes each role unique',
        'Treat it like a resume but more conversational',
      ],
    },
    {
      id: '8',
      category: 'Experience & Credibility',
      title: 'Add Features Section',
      description: 'Showcase case studies, awards, newsletter, or digital products',
      completed: false,
      priority: 'medium',
      tips: [
        'Include case studies (without naming clients if needed)',
        'Add awards and certifications',
        'Feature your newsletter or digital products',
        'Show social proof and achievements',
      ],
    },
    {
      id: '9',
      category: 'Experience & Credibility',
      title: 'Add Certifications',
      description: 'Display all relevant certifications and licenses',
      completed: false,
      priority: 'medium',
      tips: [
        'Go to the certifications section',
        'Add all relevant credentials',
        'These add credibility and authority',
      ],
    },
    {
      id: '10',
      category: 'Social Proof',
      title: 'Get Endorsements',
      description: 'Build endorsements by endorsing others and asking for endorsements',
      completed: false,
      priority: 'high',
      tips: [
        'Endorse people you\'ve worked with',
        'Endorse others in your community - it\'s reciprocal!',
        'When someone endorses you, thank them',
        'Endorse them back for their skills',
        'Having endorsements gives you credibility',
      ],
    },
    {
      id: '11',
      category: 'Social Proof',
      title: 'Request Recommendations',
      description: 'Ask people you\'ve worked with for recommendations',
      completed: false,
      priority: 'high',
      tips: [
        'Request from past clients, colleagues, and partners',
        'Ask your community members for recommendations',
        'Give recommendations to others - they may return the favor',
        'Recommendations are more valuable than endorsements',
      ],
    },
    {
      id: '12',
      category: 'Content Strategy',
      title: 'Start Engaging Before Posting',
      description: 'Warm up your account by commenting on others\' posts',
      completed: false,
      priority: 'high',
      tips: [
        'Spend 30 minutes to 1 hour daily commenting on posts',
        'Comment on posts from your target audience',
        'Comment on posts from government officials if that\'s your client',
        'Your comments also get impressions and visibility',
        'This builds reciprocity - people will comment on your posts',
      ],
    },
    {
      id: '13',
      category: 'Content Strategy',
      title: 'Post Regularly',
      description: 'Share valuable content consistently',
      completed: false,
      priority: 'high',
      tips: [
        'Post at least 3-5 times per week',
        'Share industry news relevant to your clients',
        'Post about contract wins (as case studies if needed)',
        'Share educational content and tips',
        'Be authentic and show your personality',
        'Don\'t be afraid to ask for what you need in posts',
      ],
    },
    {
      id: '14',
      category: 'Content Strategy',
      title: 'Engage with Your Own Posts',
      description: 'Like and comment on your own posts to start engagement',
      completed: false,
      priority: 'medium',
      tips: [
        'Be the first to like your post',
        'Add a comment to your own post to start the conversation',
        'Respond to every comment',
        'This signals to the algorithm that your post is valuable',
      ],
    },
    {
      id: '15',
      category: 'Networking',
      title: 'Personalize Connection Requests',
      description: 'Never send generic connection requests',
      completed: false,
      priority: 'high',
      tips: [
        'Mention something specific about their profile or posts',
        'Explain why you want to connect',
        'Never sell immediately after connecting',
        'Build relationships first',
      ],
    },
    {
      id: '16',
      category: 'Networking',
      title: 'Build Your Network',
      description: 'Connect with your target audience strategically',
      completed: false,
      priority: 'high',
      tips: [
        'Connect with decision-makers in your industry',
        'Connect with government officials if relevant',
        'Connect with other entrepreneurs and business owners',
        'Quality over quantity, but quantity also matters',
      ],
    },
  ])

  const toggleItem = (id: string) => {
    setItems(items.map(item => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length
  const percentage = Math.round((completedCount / totalCount) * 100)

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Optimization Checklist</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-linkedin-blue h-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-2xl font-bold text-linkedin-blue">
            {completedCount}/{totalCount}
          </div>
        </div>
        <p className="text-gray-600">
          Complete these optimization steps to turn your LinkedIn into a deal magnet. Based on
          best practices from top 1% LinkedIn creators.
        </p>
      </div>

      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{category}</h3>
          <div className="space-y-4">
            {categoryItems.map(item => (
              <div
                key={item.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`mt-1 flex-shrink-0 ${
                      item.completed ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h4>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                    {item.tips && item.tips.length > 0 && (
                      <div className="mt-4 bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">Tips:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                          {item.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OptimizationChecklist










