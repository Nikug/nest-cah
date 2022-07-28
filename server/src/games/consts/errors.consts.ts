class DomainError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class GameNotFoundError extends DomainError {
  data: unknown;
  constructor(id: string, errorData?: unknown) {
    super(`Game ${id} not found`);
    this.data = errorData;
  }
}
