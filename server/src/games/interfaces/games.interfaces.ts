export interface RouteParams {
  gameName: string;
  playerId: string;
}

export type PlayerState =
  | 'ready'
  | 'playing'
  | 'finished'
  | 'joining'
  | 'pickingName'
  | 'spectating'
  | 'leaving'
  | 'disconnected'
  | 'left';

export type GameState =
  | 'lobby'
  | 'selectingBlackCard'
  | 'selectingWhiteCards'
  | 'readingCards'
  | 'showingCards'
  | 'roundEnd'
  | 'gameEnd';

export type PlayerRole = 'cardCzar' | 'host';

export type PlayerIdMap = Record<string, string>;
