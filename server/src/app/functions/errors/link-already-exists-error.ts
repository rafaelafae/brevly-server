export class LinkAlreadyExistsError extends Error {
  constructor() {
    super('A link with this code already exists.')
    this.name = 'LinkAlreadyExistsError'
  }
}
