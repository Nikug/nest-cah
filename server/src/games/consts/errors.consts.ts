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

export class PlayerNotFoundError extends DomainError {
  data: unknown;
  constructor(id: string, errorData?: unknown) {
    super(`Player ${id} not found`);
    this.data = errorData;
  }
}

export class NotEnoughPlayersError extends DomainError {
  constructor(id?: string) {
    super(`Not enough players in game ${id}`);
  }
}

export class IncorrectGameStateError extends DomainError {
  constructor(id: string, gameState: string, action: string) {
    super(
      `Game ${id} is in incorrect state ${gameState} for action: ${action}`,
    );
  }
}

export class NotEnoughCardsError extends DomainError {
  constructor(id: string) {
    super(`Game ${id} does not have enough cards to start the game`);
  }
}
