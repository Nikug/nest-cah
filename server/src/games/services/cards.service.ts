import { Injectable } from '@nestjs/common';
import { BlackCard } from 'src/database/schemas/blackCard.schema';
import { GameDocument } from 'src/database/schemas/game.schema';
import { WhiteCard } from 'src/database/schemas/whiteCard.schema';
import { playerIsInactive } from '../helpers/playerState.helper';

@Injectable()
export class CardsService {
  dealWhiteCards(game: GameDocument): GameDocument {
    const whiteCardCount = game.options.numberOfWhiteCards;

    game.players = game.players.map((player) => {
      if (playerIsInactive(player)) return player;

      const cardsToDraw = whiteCardCount - player.whiteCards.length;
      player.whiteCards.push(...this.drawWhiteCards(game, cardsToDraw));

      return player;
    });

    return game;
  }

  dealBlackCards(game: GameDocument): GameDocument {
    const blackCardCount = game.options.numberOfBlackCards;
    const blackCards = this.drawBlackCards(game, blackCardCount);
    game.cards.sentBlackCards = blackCards;
    return game;
  }

  drawWhiteCards(game: GameDocument, numberOfCards: number): WhiteCard[] {
    let drawnCards: WhiteCard[] = [];
    const cardsInDeck = game.cards.whiteCardDeck.length;
    const difference = cardsInDeck - numberOfCards;

    if (difference < 0) {
      drawnCards = game.cards.whiteCardDeck.splice(0, cardsInDeck);
      numberOfCards -= cardsInDeck;
      game = this.shuffleWhiteCardDeckFromDiscard(game);
    }

    drawnCards.push(...game.cards.whiteCardDeck.splice(0, numberOfCards));
    return drawnCards;
  }

  drawBlackCards(game: GameDocument, numberOfCards: number): BlackCard[] {
    let drawnCards: BlackCard[] = [];
    const cardsInDeck = game.cards.blackCardDeck.length;
    const difference = cardsInDeck - numberOfCards;

    if (difference < 0) {
      drawnCards = game.cards.blackCardDeck.splice(0, cardsInDeck);
      numberOfCards -= cardsInDeck;
      game = this.shuffleBlackCardDeckFromDiscard(game);
    }

    drawnCards.push(...game.cards.blackCardDeck.splice(0, numberOfCards));
    return drawnCards;
  }

  shuffleWhiteCardDeckFromDiscard(game: GameDocument): GameDocument {
    const discardCopy = [...game.cards.whiteCardDiscard];
    game.cards.whiteCardDeck = this.shuffleCards(discardCopy);
    game.cards.whiteCardDiscard = [];
    return game;
  }

  shuffleBlackCardDeckFromDiscard(game: GameDocument): GameDocument {
    const discardCopy = [...game.cards.blackCardDiscard];
    game.cards.blackCardDeck = this.shuffleCards(discardCopy);
    game.cards.blackCardDiscard = [];
    return game;
  }

  shuffleCards<T>(cards: T[]): T[] {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }
}
