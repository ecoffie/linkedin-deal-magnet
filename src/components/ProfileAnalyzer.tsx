import { useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from 'lucide-react'
import { ProfileData } from '../types'

const ProfileAnalyzer = () => {
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({
    banner: {
      hasCustomBanner: false,
      includesBranding: false,
      includesTagline: false,
      includesSocialProof: false,
    },
    profilePicture: {
      isClearAndCrisp: false,
      isShoulderUp: false,
      hasSolidBackground: false,
      usesBrandingColors: false,
    },
    headline: {
      exists: false,
      isCatchy: false,
      includesValue: false,
      length: 0,
    },
    about: {
      exists: false,
      includesPersonal: false,
      includesProfessional: false,
      isWellFormatted: false,
      includesCallToAction: false,
    },
    connections: {
      visible: false,
      count: 0,
    },
    endorsements: {
      count: 0,
      hasEndorsedOthers: false,
    },
    recommendations: {
      count: 0,
    },
  })

  const calculateScore = () => {
    let total = 0
    let max = 0

    // Banner (20 points)
    max += 20
    if (profileData.banner?.hasCustomBanner) total += 5
    if (profileData.banner?.includesBranding) total += 5
    if (profileData.banner?.includesTagline) total += 5
    if (profileData.banner?.includesSocialProof) total += 5

    // Profile Picture (15 points)
    max += 15
    if (profileData.profilePicture?.isClearAndCrisp) total += 4
    if (profileData.profilePicture?.isShoulderUp) total += 4
    if (profileData.profilePicture?.hasSolidBackground) total += 4
    if (profileData.profilePicture?.usesBrandingColors) total += 3

    // Headline (15 points)
    max += 15
    if (profileData.headline?.exists) total += 5
    if (profileData.headline?.isCatchy) total += 5
    if (profileData.headline?.includesValue) total += 5

    // About Section (20 points)
    max += 20
    if (profileData.about?.exists) total += 5
    if (profileData.about?.includesPersonal) total += 5
    if (profileData.about?.includesProfessional) total += 5
    if (profileData.about?.isWellFormatted) total += 5

    // Connections (5 points)
    max += 5
    if (profileData.connections?.visible) total += 5

    // Endorsements (10 points)
    max += 10
    if ((profileData.endorsements?.count || 0) > 0) total += 5
    if (profileData.endorsements?.hasEndorsedOthers) total += 5

    // Recommendations (10 points)
    max += 10
    if ((profileData.recommendations?.count || 0) > 0) total += 10

    // Website (5 points)
    max += 5
    if (profileData.website?.exists) total += 5

    return Math.round((total / max) * 100)
  }

  const score = calculateScore()
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = () => {
    if (score >= 80) return "Excellent! You're LinkedIn-ready"
    if (score >= 60) return 'Good start, but room for improvement'
    return 'Your profile needs significant optimization'
  }

  const updateField = (section: keyof ProfileData, field: string, value: boolean | number) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Profile Analyzer</h2>
          <div className="text-right">
            <div className={`text-5xl font-bold ${getScoreColor()}`}>{score}%</div>
            <p className="text-gray-600 mt-2">{getScoreMessage()}</p>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Banner Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          🖼️ Banner/Billboard
        </h3>
        <div className="space-y-3">
          <CheckboxField
            label="Has custom banner (not generic)"
            checked={profileData.banner?.hasCustomBanner || false}
            onChange={(val) => updateField('banner', 'hasCustomBanner', val)}
            tip="Your banner is the first impression - use it to highlight what you do, your tagline, or social proof"
          />
          <CheckboxField
            label="Includes branding colors"
            checked={profileData.banner?.includesBranding || false}
            onChange={(val) => updateField('banner', 'includesBranding', val)}
          />
          <CheckboxField
            label="Includes tagline or value proposition"
            checked={profileData.banner?.includesTagline || false}
            onChange={(val) => updateField('banner', 'includesTagline', val)}
            tip="Example: 'I help government contractors win more deals'"
          />
          <CheckboxField
            label="Includes social proof (awards, features, achievements)"
            checked={profileData.banner?.includesSocialProof || false}
            onChange={(val) => updateField('banner', 'includesSocialProof', val)}
          />
        </div>
      </div>

      {/* Profile Picture */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📷 Profile Picture
        </h3>
        <div className="space-y-3">
          <CheckboxField
            label="Clear and crisp photo"
            checked={profileData.profilePicture?.isClearAndCrisp || false}
            onChange={(val) => updateField('profilePicture', 'isClearAndCrisp', val)}
            tip="People need to recognize you in person - use your real photo, not AI-generated ones that don't look like you"
          />
          <CheckboxField
            label="Shoulder-up framing"
            checked={profileData.profilePicture?.isShoulderUp || false}
            onChange={(val) => updateField('profilePicture', 'isShoulderUp', val)}
          />
          <CheckboxField
            label="Solid background (not busy)"
            checked={profileData.profilePicture?.hasSolidBackground || false}
            onChange={(val) => updateField('profilePicture', 'hasSolidBackground', val)}
            tip="Busy backgrounds take away from your face"
          />
          <CheckboxField
            label="Uses branding colors in background"
            checked={profileData.profilePicture?.usesBrandingColors || false}
            onChange={(val) => updateField('profilePicture', 'usesBrandingColors', val)}
          />
        </div>
      </div>

      {/* Headline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          ✍️ Headline
        </h3>
        <div className="space-y-3">
          <CheckboxField
            label="Headline exists and is not empty"
            checked={profileData.headline?.exists || false}
            onChange={(val) => updateField('headline', 'exists', val)}
          />
          <CheckboxField
            label="Headline is catchy and engaging"
            checked={profileData.headline?.isCatchy || false}
            onChange={(val) => updateField('headline', 'isCatchy', val)}
            tip="Use ChatGPT to create a catchy headline - describe what you do and ask it to optimize for LinkedIn"
          />
          <CheckboxField
            label="Includes value proposition"
            checked={profileData.headline?.includesValue || false}
            onChange={(val) => updateField('headline', 'includesValue', val)}
            tip="Tell people what you do and who you help"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📝 About Section
        </h3>
        <div className="space-y-3">
          <CheckboxField
            label="About section exists and is filled out"
            checked={profileData.about?.exists || false}
            onChange={(val) => updateField('about', 'exists', val)}
          />
          <CheckboxField
            label="Includes personal elements (hobbies, interests, personality)"
            checked={profileData.about?.includesPersonal || false}
            onChange={(val) => updateField('about', 'includesPersonal', val)}
            tip="People want to connect with YOU, not just your business. Share hobbies, interests, or personal touches"
          />
          <CheckboxField
            label="Includes professional information"
            checked={profileData.about?.includesProfessional || false}
            onChange={(val) => updateField('about', 'includesProfessional', val)}
          />
          <CheckboxField
            label="Well-formatted (spacing, paragraphs, easy to read)"
            checked={profileData.about?.isWellFormatted || false}
            onChange={(val) => updateField('about', 'isWellFormatted', val)}
            tip="Format for mobile reading - use spacing, paragraphs, and keep it scannable"
          />
          <CheckboxField
            label="Includes call-to-action (website, contact, services)"
            checked={profileData.about?.includesCallToAction || false}
            onChange={(val) => updateField('about', 'includesCallToAction', val)}
          />
        </div>
      </div>

      {/* Connections & Social Proof */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          🔗 Connections & Social Proof
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Are your connections visible? (Settings → Visibility → Connections)
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => updateField('connections', 'visible', true)}
                className={`px-4 py-2 rounded ${
                  profileData.connections?.visible
                    ? 'bg-linkedin-blue text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => updateField('connections', 'visible', false)}
                className={`px-4 py-2 rounded ${
                  !profileData.connections?.visible
                    ? 'bg-linkedin-blue text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                No
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              People connect with others who have more connections - show yours!
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Endorsements
            </label>
            <input
              type="number"
              value={profileData.endorsements?.count || 0}
              onChange={(e) => updateField('endorsements', 'count', parseInt(e.target.value) || 0)}
              className="border border-gray-300 rounded px-3 py-2 w-32"
            />
            <p className="text-sm text-gray-500 mt-2">
              Endorse others to get endorsed back - it's reciprocal!
            </p>
          </div>

          <CheckboxField
            label="I regularly endorse others"
            checked={profileData.endorsements?.hasEndorsedOthers || false}
            onChange={(val) => updateField('endorsements', 'hasEndorsedOthers', val)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Recommendations
            </label>
            <input
              type="number"
              value={profileData.recommendations?.count || 0}
              onChange={(e) =>
                updateField('recommendations', 'count', parseInt(e.target.value) || 0)
              }
              className="border border-gray-300 rounded px-3 py-2 w-32"
            />
            <p className="text-sm text-gray-500 mt-2">
              Ask your network for recommendations - especially from your community!
            </p>
          </div>
        </div>
      </div>

      {/* Website */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          🌐 Website
        </h3>
        <CheckboxField
          label="Website link is added to profile"
          checked={profileData.website?.exists || false}
          onChange={(val) => updateField('website', 'exists', val)}
          tip="Make it easy for people to find you and learn more"
        />
      </div>
    </div>
  )
}

interface CheckboxFieldProps {
  label: string
  checked: boolean
  onChange: (val: boolean) => void
  tip?: string
}

const CheckboxField = ({ label, checked, onChange, tip }: CheckboxFieldProps) => {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={() => onChange(!checked)}
        className={`mt-1 ${checked ? 'text-green-600' : 'text-gray-400'}`}
      >
        {checked ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
      </button>
      <div className="flex-1">
        <label className="text-gray-700 font-medium cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </label>
        {tip && (
          <p className="text-sm text-gray-500 mt-1 flex items-start gap-1">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{tip}</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default ProfileAnalyzer










