import { GameOptionsConfig } from '../consts/games.consts';
import { GamesFactory } from '../factories/games.factory';
import { limitOptions } from './options.helper';
import { Options } from '../../database/schemas/options.schema';

describe('Options helper', () => {
  let gamesFactory: GamesFactory;

  beforeEach(() => {
    gamesFactory = new GamesFactory();
  });

  it('fixes incorrect value', () => {
    const game = gamesFactory.createGame();
    game.options.maximumPlayers = 200;

    const options = limitOptions<Options>(game.options, []);
    expect(options.maximumPlayers).toBe(GameOptionsConfig.maximumPlayers.max);
  });

  it('fixes nested incorrect value', () => {
    const game = gamesFactory.createGame();
    game.options.winConditions.roundLimit = 0;

    const options = limitOptions<Options>(game.options, []);
    expect(options.winConditions.roundLimit).toBe(
      GameOptionsConfig.winConditions.roundLimit.min,
    );
  });

  it('fixes a bunch of incorrect values', () => {
    const game = gamesFactory.createGame();
    game.options.winConditions.roundLimit = 0;
    game.options.winConditions.scoreLimit = 2000;
    game.options.timers.blackCardRead = -40;
    game.options.timers.winnerSelect = 4000;
    game.options.numberOfWhiteCards = 50;

    const options = limitOptions<Options>(game.options, []);

    expect(options.winConditions.roundLimit).toBe(
      GameOptionsConfig.winConditions.roundLimit.min,
    );
    expect(options.winConditions.scoreLimit).toBe(
      GameOptionsConfig.winConditions.scoreLimit.max,
    );
    expect(options.timers.blackCardRead).toBe(
      GameOptionsConfig.timers.blackCardRead.min,
    );
    expect(options.timers.winnerSelect).toBe(
      GameOptionsConfig.timers.winnerSelect.max,
    );
    expect(options.numberOfWhiteCards).toBe(
      GameOptionsConfig.numberOfWhiteCards.max,
    );
  });

  it('throws on nonexisting key', () => {
    const game: any = gamesFactory.createGame();
    game.options.doesntExist = 10;

    expect(() => limitOptions<Options>(game.options, [])).toThrow();
  });

  it('does not throw on wrong type of data', () => {
    const game: any = gamesFactory.createGame();
    game.options.timers.blackCardRead = 'not a number';

    const options = limitOptions<Options>(game.options, []);
    expect(options.timers.blackCardRead).toBe('not a number');
  });
});
