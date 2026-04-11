'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

const adjectives = ['Silent', 'Brave', 'Calm', 'Bold', 'Wise', 'Swift', 'Noble', 'Pure', 'Strong', 'Gentle']
const nouns = ['Phoenix', 'Tiger', 'Wave', 'Storm', 'Monk', 'Warrior', 'Eagle', 'Lion', 'Lotus', 'Spirit']
const avatars = ['🪷', '🦁', '🌊', '🔥', '🌿', '🛡️', '⚡', '🧘']

function generateUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${adj}${noun}_${num}`
}

interface UserData {
  id?: string
  username: string
  avatar: string
  joinedRooms: string[]
  savedPosts: string[]
  likedPosts: string[]
  streak: number
  streakDays: string[] // ISO date strings
  resetDays: string[]
  badges: { name: string; earned: boolean }[]
  notifications: boolean
  joinedChallenges: {
    id: string
    currentDay: number
    completedDays: number[]
  }[]
}

interface UserContextType {
  user: UserData | null
  isLoaded: boolean
  updateUser: (data: Partial<UserData>) => void
  regenerateUsername: () => void
  setAvatar: (avatar: string) => void
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  toggleLikePost: (postId: string) => boolean
  toggleSavePost: (postId: string) => boolean
  markStreakDay: () => void
  joinChallenge: (challengeId: string, totalDays: number) => void
  completeChallengeDay: (challengeId: string, day: number) => void
  clearAllData: () => void
  initializeUser: (username: string, avatar: string, id?: string) => void
}

const UserContext = createContext<UserContextType | null>(null)

const STORAGE_KEY = 'ojas_user_data'

const defaultBadges = [
  { name: 'Ojas Warrior', earned: false },
  { name: '7-Day Champ', earned: false },
  { name: 'Helpful Soul', earned: false },
  { name: '30-Day Monk', earned: false },
]

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed)
      }
    } catch {
      // Keep user as null if parsing fails
    }
    setIsLoaded(true)
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user && isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    }
  }, [user, isLoaded])

  const initializeUser = useCallback((username: string, avatar: string, id?: string) => {
    const newUser: UserData = {
      id,
      username,
      avatar,
      joinedRooms: [],
      savedPosts: [],
      likedPosts: [],
      streak: 0,
      streakDays: [],
      resetDays: [],
      badges: defaultBadges,
      notifications: true,
      joinedChallenges: [],
    }
    setUser(newUser)
  }, [])

  const updateUser = useCallback((data: Partial<UserData>) => {
    setUser(prev => prev ? { ...prev, ...data } : null)
  }, [])

  const regenerateUsername = useCallback(() => {
    const newUsername = generateUsername()
    setUser(prev => prev ? { ...prev, username: newUsername } : null)
  }, [])

  const setAvatar = useCallback((avatar: string) => {
    setUser(prev => prev ? { ...prev, avatar } : null)
  }, [])

  const joinRoom = useCallback((roomId: string) => {
    setUser(prev => {
      if (!prev) return null
      if (prev.joinedRooms.includes(roomId)) return prev
      return { ...prev, joinedRooms: [...prev.joinedRooms, roomId] }
    })
  }, [])

  const leaveRoom = useCallback((roomId: string) => {
    setUser(prev => {
      if (!prev) return null
      return { ...prev, joinedRooms: prev.joinedRooms.filter(id => id !== roomId) }
    })
  }, [])

  const toggleLikePost = useCallback((postId: string): boolean => {
    let isLiked = false
    setUser(prev => {
      if (!prev) return null
      if (prev.likedPosts.includes(postId)) {
        return { ...prev, likedPosts: prev.likedPosts.filter(id => id !== postId) }
      } else {
        isLiked = true
        return { ...prev, likedPosts: [...prev.likedPosts, postId] }
      }
    })
    return isLiked
  }, [])

  const toggleSavePost = useCallback((postId: string): boolean => {
    let isSaved = false
    setUser(prev => {
      if (!prev) return null
      if (prev.savedPosts.includes(postId)) {
        return { ...prev, savedPosts: prev.savedPosts.filter(id => id !== postId) }
      } else {
        isSaved = true
        return { ...prev, savedPosts: [...prev.savedPosts, postId] }
      }
    })
    return isSaved
  }, [])

  const markStreakDay = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    setUser(prev => {
      if (!prev) return null
      if (prev.streakDays.includes(today)) return prev
      
      const newStreakDays = [...prev.streakDays, today]
      const newStreak = prev.streak + 1
      
      // Check for badge unlocks
      const newBadges = prev.badges.map(badge => {
        if (badge.name === '7-Day Champ' && newStreak >= 7) {
          return { ...badge, earned: true }
        }
        if (badge.name === '30-Day Monk' && newStreak >= 30) {
          return { ...badge, earned: true }
        }
        if (badge.name === 'Ojas Warrior' && newStreak >= 1) {
          return { ...badge, earned: true }
        }
        return badge
      })
      
      return { 
        ...prev, 
        streakDays: newStreakDays, 
        streak: newStreak,
        badges: newBadges,
      }
    })
  }, [])

  const joinChallenge = useCallback((challengeId: string, totalDays: number) => {
    setUser(prev => {
      if (!prev) return null
      if (prev.joinedChallenges.some(c => c.id === challengeId)) return prev
      return {
        ...prev,
        joinedChallenges: [
          ...prev.joinedChallenges,
          { id: challengeId, currentDay: 1, completedDays: [] }
        ]
      }
    })
  }, [])

  const completeChallengeDay = useCallback((challengeId: string, day: number) => {
    setUser(prev => {
      if (!prev) return null
      return {
        ...prev,
        joinedChallenges: prev.joinedChallenges.map(c => {
          if (c.id !== challengeId) return c
          if (c.completedDays.includes(day)) return c
          return {
            ...c,
            completedDays: [...c.completedDays, day],
            currentDay: day + 1
          }
        })
      }
    })
  }, [])

  const clearAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  return (
    <UserContext.Provider value={{
      user,
      isLoaded,
      updateUser,
      regenerateUsername,
      setAvatar,
      joinRoom,
      leaveRoom,
      toggleLikePost,
      toggleSavePost,
      markStreakDay,
      joinChallenge,
      completeChallengeDay,
      clearAllData,
      initializeUser,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export { avatars, generateUsername }
