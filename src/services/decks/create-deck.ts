import { ICreateDeckData, IDeckRepository } from '~/repositories/deck-repository'

export class CreateDeckService {
  constructor(private decksRepository: IDeckRepository) {}

  execute(body: ICreateDeckData) {
    return this.decksRepository.create(body)
  }
}
