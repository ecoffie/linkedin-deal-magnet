import { useState } from 'react'
import { Image, CheckCircle2, Lightbulb, AlertCircle } from 'lucide-react'

const BannerGuide = () => {
  const [bannerElements, setBannerElements] = useState({
    hasTagline: false,
    hasBranding: false,
    hasSocialProof: false,
    hasCallToAction: false,
  })

  const bannerTemplates = [
    {
      title: 'Value Proposition Banner',
      description: 'Clear tagline about what you do and who you help',
      example: 'I help government contractors win more federal contracts',
      elements: ['Tagline', 'Branding Colors'],
    },
    {
      title: 'Social Proof Banner',
      description: 'Showcase awards, features, or achievements',
      example: 'Featured in Forbes | $20M in Contracts Won | Top 1% LinkedIn Creator',
      elements: ['Social Proof', 'Awards/Features', 'Branding'],
    },
    {
      title: 'Problem-Solution Banner',
      description: 'Address a pain point your audience faces',
      example: 'Struggling to win government contracts? I simplify the process for SMBs',
      elements: ['Problem Statement', 'Solution', 'Target Audience'],
    },
    {
      title: 'Results-Driven Banner',
      description: 'Highlight specific outcomes you deliver',
      example: 'Helped 50+ companies secure $5M+ in government contracts',
      elements: ['Metrics', 'Results', 'Client Type'],
    },
  ]

  const bannerTips = [
    {
      icon: '🎨',
      title: 'Use Your Branding Colors',
      description:
        'Consistent branding helps people recognize your content. Use your brand colors in the banner.',
    },
    {
      icon: '📏',
      title: 'Optimal Banner Size',
      description:
        'LinkedIn banner dimensions: 1584 x 396 pixels. Keep important elements in the center (visible on all devices).',
    },
    {
      icon: '👁️',
      title: 'Keep It Simple',
      description:
        "Don't clutter your banner. One clear message works better than trying to say everything.",
    },
    {
      icon: '📱',
      title: 'Mobile-Friendly',
      description:
        'Many users view LinkedIn on mobile. Test how your banner looks on smaller screens.',
    },
    {
      icon: '🔄',
      title: 'Update Regularly',
      description:
        'Refresh your banner when you have new achievements, awards, or want to highlight something new.',
    },
    {
      icon: '✨',
      title: 'Make It Eye-Catching',
      description:
        'Your banner is your billboard - make it stand out while staying professional.',
    },
  ]

  const bannerChecklist = [
    {
      item: 'Banner includes your tagline or value proposition',
      description: 'One sentence about what you do and who you help',
    },
    {
      item: 'Uses your branding colors',
      description: 'Consistent with your brand identity',
    },
    {
      item: 'Includes social proof (optional but powerful)',
      description: 'Awards, features, contract values, testimonials',
    },
    {
      item: 'Professional and eye-catching',
      description: 'Not generic, not cluttered, but memorable',
    },
    {
      item: 'Mobile-friendly',
      description: 'Looks good on all device sizes',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-8 h-8 text-linkedin-blue" />
          <h2 className="text-3xl font-bold text-gray-800">Banner/Billboard Optimization Guide</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Your LinkedIn banner is your billboard - it's the first impression people get of your
          profile. Make it count!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Why Your Banner Matters
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">First Impression</h4>
            <p className="text-blue-800 text-sm">
              It's the first thing people see when they visit your profile - before they even read
              your headline.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">Brand Recognition</h4>
            <p className="text-blue-800 text-sm">
              Consistent branding helps people recognize your posts and content across LinkedIn.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">Social Proof</h4>
            <p className="text-blue-800 text-sm">
              You can showcase awards, features, achievements, or logos of companies you work with.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">Value Communication</h4>
            <p className="text-blue-800 text-sm">
              Quickly communicate what you do, who you help, and why they should care.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Banner Templates & Examples</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {bannerTemplates.map((template, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-linkedin-blue transition-colors"
            >
              <h4 className="font-bold text-lg text-gray-800 mb-2">{template.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              <div className="bg-linkedin-blue text-white rounded-lg p-4 mb-4">
                <p className="font-semibold text-center">{template.example}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {template.elements.map((element, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-blue-500" />
          Banner Optimization Checklist
        </h3>
        <div className="space-y-3">
          {bannerChecklist.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-linkedin-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">{item.item}</p>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Best Practices & Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {bannerTips.map((tip, index) => (
            <div key={index} className="border-l-4 border-linkedin-blue pl-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{tip.icon}</span>
                <h4 className="font-bold text-gray-800">{tip.title}</h4>
              </div>
              <p className="text-gray-600 text-sm">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-linkedin-blue to-linkedin-dark text-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-4">Common Banner Mistakes to Avoid</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-xl">❌</span>
            <div>
              <strong>Generic stock photos:</strong> Everyone can tell - use custom banners that
              reflect your brand
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">❌</span>
            <div>
              <strong>Too cluttered:</strong> Trying to say too much - pick one main message
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">❌</span>
            <div>
              <strong>Low quality images:</strong> Blurry or pixelated banners look unprofessional
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">❌</span>
            <div>
              <strong>Outdated information:</strong> Update your banner when you have new
              achievements or focus areas
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">❌</span>
            <div>
              <strong>Not mobile-friendly:</strong> Important elements cut off on mobile devices
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-yellow-900 mb-3 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Quick Action Items
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-yellow-900">
          <li>Decide on your main message or value proposition</li>
          <li>Gather any logos, awards, or social proof you want to include</li>
          <li>Choose your branding colors and design style</li>
          <li>Create your banner (use Canva, Photoshop, or hire a designer)</li>
          <li>Upload to LinkedIn and check how it looks on desktop and mobile</li>
          <li>Update your banner regularly as you achieve new milestones</li>
        </ol>
      </div>
    </div>
  )
}

export default BannerGuide










