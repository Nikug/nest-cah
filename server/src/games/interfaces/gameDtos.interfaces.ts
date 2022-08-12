import { GameState, PlayerState } from './games.interfaces';
import { BlackCard } from '../../database/schemas/blackCard.schema';
import { WhiteCard } from 'src/database/schemas/whiteCard.schema';
import { Avatar } from 'src/database/schemas/avatar.schema';

export interface GameNameAndPlayerId {
  gameName: string;
  playerId: string;
}

export interface OptionsDto {
  maximumPlayers: number;
  winnerBecomesCardCzar: boolean;
  allowKickedPlayerJoin: boolean;
  allowCardCzarPopularVote: boolean;
  allowPopularVote: boolean;
  password?: string;
  winConditions: WinConditionsDto;
  timers: TimersDto;
}

export interface WinConditionsDto {
  scoreLimit: number;
  useScoreLimit: boolean;
  roundLimit: number;
  useRoundLimit: boolean;
}

export interface TimersDto {
  blackCardSelect: number;
  useBlackCardSelect: boolean;
  whiteCardSelect: number;
  useWhiteCardSelect: boolean;
  blackCardRead: number;
  useBlackCardRead: boolean;
  winnerSelect: number;
  useWinnerSelect: boolean;
  roundEnd: number;
  useRoundEnd: boolean;
}

export interface GameDto {
  name: string;
  state: GameState;
  options: OptionsDto;
  streak?: StreakDto;
  rounds: RoundDto[];
}

export interface StreakDto {
  playerId: string;
  wins: number;
}

export interface RoundDto {
  round: number;
  cardIndex: number;
  blackCard: BlackCard;
  cardCzarId: string;
  winnerId: string | null;
  playedCards: PlayedCardsDto[];
}

export interface PlayedCardsDto {
  popularVotes: number;
  winner: boolean;
  whiteCards: WhiteCard[];
}

export interface PlayerDto {
  id: string;
  name: string;
  state: PlayerState;
  score: number;
  avatar: Avatar;
  isCardCzar: boolean;
  isHost: boolean;
  isPopularVoteKing: boolean;
}

export interface ConfidentialPlayerDto extends PlayerDto {
  privateId: string;
  socketId: string;
  whiteCards: WhiteCard[];
}
