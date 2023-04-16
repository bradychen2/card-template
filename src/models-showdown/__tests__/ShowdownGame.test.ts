import { ShowdownGame } from "../ShowdownGame";
import { Player } from "../Player";
import { Card, SUITS, suit } from "../Card";
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
  const suits = Object.values(SUITS);
  const clubs = suits[0] as suit;
  const diamonds = suits[1] as suit;
  const hearts = suits[2] as suit;
  const spades = suits[3] as suit;

  describe("addPlayer()", () => {
    it("should throw error if player is already in the game", () => {
      const game = new ShowdownGame();
      const player1 = new Player();
      const player2 = new Player();
      const player3 = new Player();
      const player4 = new Player();
      const player5 = new Player();

      game["addPlayer"](player1);
      game["addPlayer"](player2);
      game["addPlayer"](player3);
      game["addPlayer"](player4);

      expect(game.players.length).toBe(4);
      expect(() => game["addPlayer"](player5)).toThrowError(
        "there're at most 4 players in a game"
      );
    });
  });

  describe("compareCards()", () => {
    it("should correctly return the bigger card with the same rank: card2 > card1", () => {
      const game = new ShowdownGame();
      const card1 = new Card(clubs, 7);
      const card2 = new Card(diamonds, 7);

      const result = game["compareCards"](card1, card2);

      expect(result).toEqual(card2);
    });

    it("should correctly return the bigger card with the same rank: card1 > card2", () => {
      const game = new ShowdownGame();
      const card1 = new Card(diamonds, 7);
      const card2 = new Card(clubs, 7);

      const result = game["compareCards"](card1, card2);

      expect(result).toEqual(card1);
    });

    it("should correctly return the bigger card with the same suit: card2 > card1", () => {
      const game = new ShowdownGame();
      const card1 = new Card(clubs, 7);
      const card2 = new Card(clubs, 8);

      const result = game["compareCards"](card1, card2);

      expect(result).toEqual(card2);
    });

    it("should correctly return the bigger card with the same suit: card1 > card2", () => {
      const game = new ShowdownGame();
      const card1 = new Card(clubs, 8);
      const card2 = new Card(clubs, 7);

      const result = game["compareCards"](card1, card2);

      expect(result).toEqual(card1);
    });
  });

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

    it("should correctly draw cards from the deck: each player draws cards with correct orders", () => {
      // Arrange
      const game = new ShowdownGame();

      const deck = new Deck();
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
      expect(players[0].hands[0].rank).toEqual(13);
      expect(players[0].hands[0].suit).toEqual(spades);
      expect(players[1].hands[0].rank).toEqual(13);
      expect(players[1].hands[0].suit).toEqual(hearts);
      expect(players[2].hands[0].rank).toEqual(13);
      expect(players[2].hands[0].suit).toEqual(diamonds);
      expect(players[3].hands[0].rank).toEqual(13);
      expect(players[3].hands[0].suit).toEqual(clubs);
    });
  });

  describe("takeTurn()", () => {
    beforeEach(() => {});

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should correctly take a turn: each player has 1 card, the winner showed the biggest card", async () => {
      // Arrange
      const game = new ShowdownGame();
      game["turns"] = 1;
      const deck = new Deck();
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

      const selectSpy = jest
        .spyOn(Player.prototype, "select")
        .mockResolvedValueOnce(new Card(clubs, 7))
        .mockResolvedValueOnce(new Card(diamonds, 7))
        .mockResolvedValueOnce(new Card(hearts, 7))
        .mockResolvedValueOnce(new Card(spades, 7));
      const removeCardFromHandsSpy = jest
        .spyOn(Player.prototype, "removeCardFromHands")
        .mockImplementation(() => {});
      const showdownSpy = jest.spyOn(ShowdownGame.prototype as any, "showdown");

      // Act
      await game["takeTurns"]();

      // Assert
      expect(selectSpy).toHaveBeenCalledTimes(4);
      expect(removeCardFromHandsSpy).toHaveBeenCalledTimes(4);
      expect(showdownSpy).toHaveBeenCalledTimes(1);
      expect(players[3].points).toEqual(1);
      expect(game.turns).toEqual(0);
    });
  });

  describe("endGame()", () => {
    it("should correctly log the winner has the most points", async () => {
      // Arrange
      const game = new ShowdownGame();
      const players = [new Player(), new Player(), new Player(), new Player()];
      players[0].name = "Player-1";
      players[1].name = "Player-2";
      players[2].name = "Player-3";
      players[3].name = "Player-4";

      players[0].addPoint(1);
      players[1].addPoint(2);
      players[2].addPoint(3);
      players[3].addPoint(4);

      game["addPlayer"](players[0]);
      game["addPlayer"](players[1]);
      game["addPlayer"](players[2]);
      game["addPlayer"](players[3]);

      const logSpy = jest.spyOn(console, "log");

      // Act
      game["endGame"]();

      // Assert
      expect(logSpy).toHaveBeenCalledWith(`The winner is Player-4!!!!`);
    });

    it("should correctly log all players' points", async () => {
      // Arrange
      const game = new ShowdownGame();
      const players = [new Player(), new Player(), new Player(), new Player()];
      players[0].name = "Player-1";
      players[1].name = "Player-2";
      players[2].name = "Player-3";
      players[3].name = "Player-4";

      players[0].addPoint(1);
      players[1].addPoint(2);
      players[2].addPoint(3);
      players[3].addPoint(4);

      game["addPlayer"](players[0]);
      game["addPlayer"](players[1]);
      game["addPlayer"](players[2]);
      game["addPlayer"](players[3]);

      const logSpy = jest.spyOn(console, "log");

      // Act
      game["endGame"]();

      // Assert
      expect(logSpy).toHaveBeenCalledWith(`Player-1 - 1 points`);
      expect(logSpy).toHaveBeenCalledWith(`Player-2 - 2 points`);
      expect(logSpy).toHaveBeenCalledWith(`Player-3 - 3 points`);
      expect(logSpy).toHaveBeenCalledWith(`Player-4 - 4 points`);
    });
  });
});
