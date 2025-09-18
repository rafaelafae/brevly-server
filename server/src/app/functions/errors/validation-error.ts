export class ValidationError extends Error {
  public issues: Record<string, string>

  constructor(issues: Record<string, string>) {
    super('Input validation failed')
    this.name = 'ValidationError'
    this.issues = issues
  }
}
