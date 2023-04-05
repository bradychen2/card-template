import { ShowdownGame } from "../ShowdownGame";
import { Player } from "../Player";
import { Card, SUITS } from "../Card";
import {
  expect,
  jest,
  describe,
  afterEach,
  it,
  beforeEach,
} from "@jest/globals";
import { Deck } from "../Deck";

describe("ShowdownGame", () => {
  const suits = Object.keys(SUITS);
  const hearts = suits[0] as "HEART";
  const clubs = suits[1] as "CLUB";
  const diamonds = suits[2] as "DIAMOND";
  const spades = suits[3] as "SPADE";

  describe("showdown()", () => {
    beforeEach(() => {});

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should correctly return the biggest card with the same ranks", () => {
      // Arrange
      const players = [new Player(), new Player(), new Player(), new Player()];

      players[0].name = "Player-1";
      players[0].addHandCard(new Card(clubs, 7));

      players[1].name = "Player-2";
      players[1].addHandCard(new Card(diamonds, 7));

      players[2].name = "Player-3";
      players[2].addHandCard(new Card(hearts, 7));

      players[3].name = "Player-4";
      players[3].addHandCard(new Card(spades, 7));

      const game = new ShowdownGame();
      game["addPlayer"](players[0]);
      game["addPlayer"](players[1]);
      game["addPlayer"](players[2]);
      game["addPlayer"](players[3]);

      const showCards = [
        new Card(clubs, 7),
        new Card(diamonds, 7),
        new Card(hearts, 7),
        new Card(spades, 7),
      ];

      // Act
      const result = game["showdown"](showCards);

      // Assert
      expect(result).toEqual(new Card(spades, 7));
    });

    it("should correctly return the biggest card with the same suits", () => {
      // Arrange
      const players = [new Player(), new Player(), new Player(), new Player()];

      players[0].name = "Player-1";
      players[0].addHandCard(new Card(clubs, 7));

      players[1].name = "Player-2";
      players[1].addHandCard(new Card(clubs, 8));

      players[2].name = "Player-3";
      players[2].addHandCard(new Card(clubs, 9));

      players[3].name = "Player-4";
      players[3].addHandCard(new Card(clubs, 10));

      const game = new ShowdownGame();
      game["addPlayer"](players[0]);
      game["addPlayer"](players[1]);
      game["addPlayer"](players[2]);
      game["addPlayer"](players[3]);

      const showCards = [
        new Card(clubs, 7),
        new Card(clubs, 8),
        new Card(clubs, 9),
        new Card(clubs, 10),
      ];

      // Act
      const result = game["showdown"](showCards);

      // Assert
      expect(result).toEqual(new Card(clubs, 10));
    });
  });

  describe("initGame()", () => {
    beforeEach(() => {});

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should correctly initialize the game: 4 players, 52 cards, 13 turns", async () => {
      // Arrange
      const game = new ShowdownGame();
      const shuffleSpy = jest.spyOn(Deck.prototype, "shuffle");
      const nameSelfSpy = jest
        .spyOn(Player.prototype, "nameSelf")
        .mockImplementation(() => {
          return Promise.resolve();
        });

      // Act
      await game.initGame();

      // Assert
      expect(nameSelfSpy).toHaveBeenCalledTimes(4);
      expect(shuffleSpy).toHaveBeenCalled();
      expect(game.players.length).toEqual(4);
      expect(game.deck.cards.length).toEqual(52);
      expect(game.turns).toEqual(13);
    });
  });

  describe("drawCards()", () => {
    beforeEach(() => {});

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should correctly draw cards from the deck: each player has 13 cards", () => {
      // Arrange
      const game = new ShowdownGame();

      const deck = new Deck();
      deck.shuffle();
      game.deck = deck;

      const players = [new Player(), new Player(), new Player(), new Player()];
      players[0].name = "Player-1";
      players[1].name = "Player-2";
      players[2].name = "Player-3";
      players[3].name = "Player-4";
      game["addPlayer"](players[0]);
      game["addPlayer"](players[1]);
      game["addPlayer"](players[2]);
      game["addPlayer"](players[3]);

      // Act
      const card = game["drawCards"]();

      // Assert
      expect(players[0].hands.length).toEqual(13);
      expect(players[1].hands.length).toEqual(13);
      expect(players[2].hands.length).toEqual(13);
      expect(players[3].hands.length).toEqual(13);
      expect(game.deck.cards.length).toEqual(0);
    });
  });
});
