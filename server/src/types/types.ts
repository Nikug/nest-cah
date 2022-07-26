export type PlayerState =
  | 'ready'
  | 'playing'
  | 'finished'
  | 'joining'
  | 'pickingName'
  | 'disconnected'
  | 'spectating'
  | 'leaving';

export type GameState =
  | 'lobby'
  | 'selectingBlackCard'
  | 'selectingWhiteCards'
  | 'readingCards'
  | 'showingCards'
  | 'roundEnd'
  | 'gameEnd';
