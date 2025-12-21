import { useState } from 'react'
import { Linkedin } from 'lucide-react'
import ProfileAnalyzer from './components/ProfileAnalyzer'
import OptimizationChecklist from './components/OptimizationChecklist'
import AIGenerators from './components/AIGenerators'
import EngagementTracker from './components/EngagementTracker'
import CaseStudyGenerator from './components/CaseStudyGenerator'
import BannerGuide from './components/BannerGuide'

type Tab = 'analyzer' | 'checklist' | 'generators' | 'engagement' | 'case-study' | 'banner'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('analyzer')

  const tabs = [
    { id: 'analyzer' as Tab, label: 'Profile Analyzer', icon: '📊' },
    { id: 'checklist' as Tab, label: 'Optimization Checklist', icon: '✅' },
    { id: 'banner' as Tab, label: 'Banner Guide', icon: '🖼️' },
    { id: 'generators' as Tab, label: 'AI Generators', icon: '🤖' },
    { id: 'engagement' as Tab, label: 'Engagement Tracker', icon: '💬' },
    { id: 'case-study' as Tab, label: 'Case Study Generator', icon: '📝' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-linkedin-blue text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Linkedin className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">LinkedIn Deal Magnet</h1>
              <p className="text-blue-100 text-sm">Turn Your LinkedIn Into a Deal Magnet</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-linkedin-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'analyzer' && <ProfileAnalyzer />}
        {activeTab === 'checklist' && <OptimizationChecklist />}
        {activeTab === 'banner' && <BannerGuide />}
        {activeTab === 'generators' && <AIGenerators />}
        {activeTab === 'engagement' && <EngagementTracker />}
        {activeTab === 'case-study' && <CaseStudyGenerator />}
      </main>

      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Built based on LinkedIn optimization best practices from top 1% LinkedIn creators
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App







