export class InvalidUrlFormatError extends Error {
  constructor() {
    super('The provided URL has an invalid format.')
    this.name = 'InvalidUrlFormatError'
  }
}
