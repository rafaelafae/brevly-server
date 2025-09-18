export class LinkNotFoundError extends Error {
  constructor() {
    super('The link is not found')
    this.name = 'LinkNotFoundError'
  }
}
