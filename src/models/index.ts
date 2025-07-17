import { CardStatus } from "@prisma/client"

export interface IUser {
  id?: string
  name: string
  email: string
  password?: string

  createdAt?: Date
  updatedAt?: Date
}

export interface IDeck {
  id?: string
  creatorId: string
  title: string
  description?: string | null
  status: 'public' | 'private'

  createdAt?: Date
  updatedAt?: Date
}

export interface ICard {
  id: string
  deckId: string

  question: string
  answer: string

  createdAt?: Date
  updatedAt?: Date
}

export interface IUserDeck {
  id?: string
  userId: string
  deckId: string

  currentStreak?: number
  maxStreak?: number
  lastStudyAt?: Date
  status?: 'active' | 'archived'

  createdAt?: Date
  updatedAt?: Date
}

export interface IUserCard {
  id?: string
  userId: string
  cardId: string

  status: CardStatus
  lastReviewed: Date | null
  nextReview: Date | null
} 

export interface IUserCardAnswer {
  id?: string
  userCardId: string

  userAnswer: string
  isCorrect: boolean

  createdAt?: Date
  updatedAt?: Date
}