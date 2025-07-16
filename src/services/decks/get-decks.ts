import { IDeckRepository } from '~/repositories/deck-repository'

interface IGetDecksParams {
  userId: string
  status?: 'public' | 'private'
  creatorId?: string
}

export class GetDecksService {
  constructor(private decksRepository: IDeckRepository) { }

  execute({ status, creatorId, userId }: IGetDecksParams) {
    if (creatorId) {
      return this.decksRepository.getPublicDecksByCreatorId(creatorId)
    }

    if (status === 'public') {
      return this.decksRepository.getPublicDecks()
    }

    if (status === 'private') {
      return this.decksRepository.getPrivateDecks(userId)
    }

    return this.decksRepository.getDecksForUser(userId)
  }
}
