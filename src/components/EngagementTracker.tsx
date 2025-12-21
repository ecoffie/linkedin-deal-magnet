import { useState } from 'react'
import { MessageSquare, Send, Users, ThumbsUp, Calendar, Target } from 'lucide-react'
import { EngagementGoal } from '../types'

const EngagementTracker = () => {
  const [dailyGoals, setDailyGoals] = useState<EngagementGoal[]>([
    {
      id: '1',
      type: 'comment',
      description: 'Comment on 10 posts from your target audience',
      target: 10,
      current: 0,
      timeframe: 'Daily',
    },
    {
      id: '2',
      type: 'post',
      description: 'Post 1 piece of content',
      target: 1,
      current: 0,
      timeframe: 'Daily',
    },
    {
      id: '3',
      type: 'connection',
      description: 'Send 5 personalized connection requests',
      target: 5,
      current: 0,
      timeframe: 'Daily',
    },
  ])

  const [weeklyGoals, setWeeklyGoals] = useState<EngagementGoal[]>([
    {
      id: '4',
      type: 'endorsement',
      description: 'Endorse 20 people in your network',
      target: 20,
      current: 0,
      timeframe: 'Weekly',
    },
    {
      id: '5',
      type: 'comment',
      description: 'Comment on 50 total posts',
      target: 50,
      current: 0,
      timeframe: 'Weekly',
    },
  ])

  const updateGoal = (goals: EngagementGoal[], setGoals: any, id: string, newValue: number) => {
    setGoals(goals.map(goal => (goal.id === id ? { ...goal, current: newValue } : goal)))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-5 h-5" />
      case 'post':
        return <Send className="w-5 h-5" />
      case 'connection':
        return <Users className="w-5 h-5" />
      case 'endorsement':
        return <ThumbsUp className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'comment':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'post':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'connection':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'endorsement':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const renderGoalCard = (goal: EngagementGoal, onUpdate: (id: string, value: number) => void) => {
    const percentage = Math.min((goal.current / goal.target) * 100, 100)
    const isComplete = goal.current >= goal.target

    return (
      <div
        key={goal.id}
        className={`border-2 rounded-lg p-4 ${getColor(goal.type)} ${
          isComplete ? 'ring-2 ring-green-500' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon(goal.type)}
            <h4 className="font-semibold">{goal.description}</h4>
          </div>
          <span className="text-sm font-bold">
            {goal.current}/{goal.target}
          </span>
        </div>

        <div className="mb-3">
          <div className="bg-white/50 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isComplete ? 'bg-green-600' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdate(goal.id, Math.max(0, goal.current - 1))}
            className="px-3 py-1 bg-white/80 rounded text-sm font-semibold hover:bg-white transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={goal.current}
            onChange={(e) => onUpdate(goal.id, Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 px-2 py-1 bg-white/80 rounded text-center font-semibold"
          />
          <button
            onClick={() => onUpdate(goal.id, goal.current + 1)}
            className="px-3 py-1 bg-white/80 rounded text-sm font-semibold hover:bg-white transition-colors"
          >
            +
          </button>
          {isComplete && (
            <span className="ml-auto text-green-700 font-bold text-sm">✓ Complete!</span>
          )}
        </div>
      </div>
    )
  }

  const engagementStrategy = [
    {
      title: 'Warm Up Your Account',
      description:
        'Before posting, spend 30 minutes to 1 hour commenting on other people\'s posts',
      tips: [
        'Comment on posts from your target audience',
        'Comment on posts from government officials if that\'s your client',
        'Your comments also get impressions and visibility',
        'Builds reciprocity - people will comment on your posts',
      ],
    },
    {
      title: 'Engage with Your Own Posts',
      description:
        'Always like and comment on your own posts to start engagement',
      tips: [
        'Be the first to like your post',
        'Add a comment to your own post to start the conversation',
        'Respond to every comment you receive',
        'This signals to the algorithm that your post is valuable',
      ],
    },
    {
      title: 'Comment Before You Post',
      description:
        'The engagement strategy that works: comment first, then post',
      tips: [
        'Spend 30 min - 1 hour commenting on others\' posts',
        'Then post your content',
        'Your account will be "warmed up" and more likely to get engagement',
        'Aim for 10+ comments per day on others\' posts',
      ],
    },
    {
      title: 'Reciprocal Engagement',
      description:
        'Engage with others and they\'ll engage with you',
      tips: [
        'When someone comments on your post, visit their profile and comment on theirs',
        'Support others in your community publicly',
        'Don\'t just send private messages - engage publicly',
        'The algorithm rewards active engagement',
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-8 h-8 text-linkedin-blue" />
          <h2 className="text-3xl font-bold text-gray-800">Engagement Tracker</h2>
        </div>
        <p className="text-gray-600 text-lg">
          Track your daily and weekly LinkedIn engagement goals. Consistent engagement is key to
          building your LinkedIn presence.
        </p>
      </div>

      {/* Daily Goals */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-linkedin-blue" />
          <h3 className="text-2xl font-bold text-gray-800">Daily Engagement Goals</h3>
        </div>
        <div className="space-y-4">
          {dailyGoals.map(goal =>
            renderGoalCard(goal, (id, value) =>
              updateGoal(dailyGoals, setDailyGoals, id, value)
            )
          )}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> Spend 30 minutes to 1 hour commenting on posts before you post
            your own content. This "warms up" your account and improves engagement.
          </p>
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-800">Weekly Engagement Goals</h3>
        </div>
        <div className="space-y-4">
          {weeklyGoals.map(goal =>
            renderGoalCard(goal, (id, value) =>
              updateGoal(weeklyGoals, setWeeklyGoals, id, value)
            )
          )}
        </div>
      </div>

      {/* Engagement Strategy */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Engagement Strategy Guide</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {engagementStrategy.map((strategy, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-2">{strategy.title}</h4>
              <p className="text-gray-600 mb-4">{strategy.description}</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                {strategy.tips.map((tip, tipIndex) => (
                  <li key={tipIndex}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-gradient-to-r from-linkedin-blue to-linkedin-dark text-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4">Engagement Best Practices</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">✅ DO:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Comment thoughtfully and add value</li>
              <li>Engage with posts from your target audience</li>
              <li>Comment on your own posts</li>
              <li>Respond to every comment you receive</li>
              <li>Support others in your community publicly</li>
              <li>Spend 30 min - 1 hour daily on engagement</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">❌ DON'T:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Send generic "Great post!" comments</li>
              <li>Only engage privately (engage publicly too)</li>
              <li>Ignore comments on your posts</li>
              <li>Post without engaging first</li>
              <li>Try to sell immediately after connecting</li>
              <li>Give up after just a few days</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Weekly Reset */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-yellow-900 mb-3">📅 Weekly Reset</h3>
        <p className="text-yellow-900 mb-4">
          Reset your goals weekly to track consistent engagement. Remember: LinkedIn rewards
          consistency!
        </p>
        <button
          onClick={() => {
            setDailyGoals(dailyGoals.map(g => ({ ...g, current: 0 })))
            setWeeklyGoals(weeklyGoals.map(g => ({ ...g, current: 0 })))
          }}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
        >
          Reset All Goals
        </button>
      </div>
    </div>
  )
}

export default EngagementTracker










