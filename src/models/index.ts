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