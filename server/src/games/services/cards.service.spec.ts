import { BlackCard } from 'src/database/schemas/blackCard.schema';
import { GameDocument } from 'src/database/schemas/game.schema';
import { WhiteCard } from '../../database/schemas/whiteCard.schema';
import { GamesFactory } from '../factories/games.factory';
import { CardsService } from './cards.service';

const arraysHaveSameItems = (arr1: any[], arr2: any[]): void => {
  expect(arr1.length).toBe(arr2.length);
  arr1.map((item) => expect(arr2).toContain(item));
};

const aContainsB = (arr1: any[], arr2: any[]): void => {
  arr2.map((item) => expect(arr1).toContain(item));
};

const arraysHaveDifferentItems = (arr1: any[], arr2: any[]): void => {
  arr1.map((item) => expect(arr2).not.toContain(item));
  arr2.map((item) => expect(arr1).not.toContain(item));
};

const generateWhiteCards = (amount: number): WhiteCard[] => {
  const cards: WhiteCard[] = Array.from({ length: amount }, (_, i) => ({
    id: i.toString(),
    cardPackId: 'cardPackId',
    text: `text-${i}`,
  }));

  return cards;
};

const generateBlackCards = (amount: number): BlackCard[] => {
  const cards: BlackCard[] = Array.from({ length: amount }, (_, i) => ({
    id: i.toString(),
    cardPackId: 'cardPackId',
    text: `text-${i}`,
    whiteCardsToPlay: 1,
  }));

  return cards;
};

describe('Cards service', () => {
  let cardsService: CardsService;
  let gamesFactory: GamesFactory;

  beforeEach(() => {
    cardsService = new CardsService();
    gamesFactory = new GamesFactory();
  });

  it('shuffles white cards from discard', () => {
    const whiteCards = generateWhiteCards(10);
    const game = gamesFactory.createGame() as GameDocument;
    game.cards.whiteCardDiscard = whiteCards;

    const newGame = cardsService.shuffleWhiteCardDeckFromDiscard(game);

    expect(newGame.cards.whiteCardDeck.length).toBe(10);
    expect(newGame.cards.whiteCardDiscard.length).toBe(0);
    arraysHaveSameItems(newGame.cards.whiteCardDeck, whiteCards);
  });

  it('shuffles black cards from discard', () => {
    const blackCards = generateBlackCards(10);
    const game = gamesFactory.createGame() as GameDocument;
    game.cards.blackCardDiscard = blackCards;

    const newGame = cardsService.shuffleBlackCardDeckFromDiscard(game);

    expect(newGame.cards.blackCardDeck.length).toBe(10);
    expect(newGame.cards.blackCardDiscard.length).toBe(0);
    arraysHaveSameItems(newGame.cards.blackCardDeck, blackCards);
  });

  it('draws white cards', () => {
    const whiteCards = generateWhiteCards(10);
    const game = gamesFactory.createGame() as GameDocument;
    game.cards.whiteCardDeck = whiteCards;

    const drawnCards = cardsService.drawWhiteCards(game, 5);

    expect(drawnCards.length).toBe(5);
    expect(game.cards.whiteCardDeck.length).toBe(5);
    arraysHaveDifferentItems(game.cards.whiteCardDeck, drawnCards);
  });

  it('draws white cards and resuffles from discard', () => {
    const whiteCards = generateWhiteCards(10);
    const discardWhiteCards = whiteCards.splice(0, 8);
    const game = gamesFactory.createGame() as GameDocument;
    game.cards.whiteCardDeck = [...whiteCards];
    game.cards.whiteCardDiscard = [...discardWhiteCards];

    const drawnCards = cardsService.drawWhiteCards(game, 5);

    expect(drawnCards.length).toBe(5);
    expect(game.cards.whiteCardDeck.length).toBe(5);
    expect(game.cards.whiteCardDiscard.length).toBe(0);
    arraysHaveDifferentItems(game.cards.whiteCardDeck, drawnCards);
    aContainsB(drawnCards, whiteCards);
  });

  it('draws black cards', () => {
    const blackCards = generateBlackCards(10);
    const game = gamesFactory.createGame() as GameDocument;
    game.cards.blackCardDeck = blackCards;

    const drawnCards = cardsService.drawBlackCards(game, 5);

    expect(drawnCards.length).toBe(5);
    expect(game.cards.blackCardDeck.length).toBe(5);
    arraysHaveDifferentItems(game.cards.blackCardDeck, drawnCards);
  });

  it('draws black cards and resuffles from discard', () => {
    const blackCards = generateBlackCards(10);
    const discardBlackCards = blackCards.splice(0, 8);
    const game = gamesFactory.createGame() as GameDocument;
    game.cards.blackCardDeck = [...blackCards];
    game.cards.blackCardDiscard = [...discardBlackCards];

    const drawnCards = cardsService.drawBlackCards(game, 5);

    expect(drawnCards.length).toBe(5);
    expect(game.cards.blackCardDeck.length).toBe(5);
    expect(game.cards.blackCardDiscard.length).toBe(0);
    arraysHaveDifferentItems(game.cards.blackCardDeck, drawnCards);
    aContainsB(drawnCards, blackCards);
  });

  it('deals white cards', () => {
    const whiteCards = generateWhiteCards(10);
    const game = gamesFactory.createGame() as GameDocument;
    game.cards.whiteCardDeck = [...whiteCards];
    game.options.numberOfWhiteCards = 4;

    const playerWithNoCards = gamesFactory.createPlayer(true);
    playerWithNoCards.state = 'ready';
    game.players.push(playerWithNoCards);

    const playerWithSomeCards = gamesFactory.createPlayer(false);
    playerWithSomeCards.whiteCards = game.cards.whiteCardDeck.splice(0, 2);
    playerWithSomeCards.state = 'ready';
    game.players.push(playerWithSomeCards);
    game.players.push(gamesFactory.createPlayer(false));

    const newGame = cardsService.dealWhiteCards(game);

    expect(newGame.cards.whiteCardDeck.length).toBe(2);
    expect(newGame.players[0].whiteCards.length).toBe(4);
    expect(newGame.players[1].whiteCards.length).toBe(4);
    arraysHaveDifferentItems(
      newGame.cards.whiteCardDeck,
      newGame.players[0].whiteCards,
    );
    arraysHaveDifferentItems(
      newGame.cards.whiteCardDeck,
      newGame.players[1].whiteCards,
    );
    arraysHaveDifferentItems(
      newGame.players[0].whiteCards,
      newGame.players[1].whiteCards,
    );
  });

  it('deals black cards', () => {
    const blackCards = generateBlackCards(10);
    const game = gamesFactory.createGame() as GameDocument;
    game.cards.blackCardDeck = [...blackCards];
    game.options.numberOfBlackCards = 3;

    const newGame = cardsService.dealBlackCards(game);

    expect(newGame.cards.sentBlackCards.length).toBe(3);
    expect(newGame.cards.blackCardDeck.length).toBe(7);
    arraysHaveDifferentItems(
      newGame.cards.sentBlackCards,
      newGame.cards.blackCardDeck,
    );
  });
});
