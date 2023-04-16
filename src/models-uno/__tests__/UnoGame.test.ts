import { jest, afterEach, describe, it, expect } from "@jest/globals";
import { UnoGame } from "../UnoGame";
import { UnoDeck } from "../UnoDeck";
import { UnoPlayer } from "../UnoPlayer";
import { COLOR, UnoCard } from "../UnoCard";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("UnoGame", () => {
  const colors = Object.keys(COLOR);
  const red = colors[0] as COLOR;
  const blue = colors[1] as COLOR;
  const yellow = colors[2] as COLOR;
  const green = colors[3] as COLOR;

  describe("initGame", () => {
    it("should correctly initialize the game: 4 players, 40 cards, 1 table card", async () => {
      // Arrange
      const unoGame = new UnoGame();
      const shuffleSpy = jest.spyOn(UnoDeck.prototype as any, "shuffle");
      const nameSelfSpy = jest
        .spyOn(UnoPlayer.prototype as any, "nameSelf")
        .mockImplementation(() => {
          return Promise.resolve();
        });

      // Act
      await unoGame.initGame();

      // Assert
      expect(nameSelfSpy).toHaveBeenCalledTimes(4);
      expect(shuffleSpy).toHaveBeenCalled();
      expect(unoGame.players.length).toEqual(4);
      expect(unoGame.deck.cards.length).toEqual(39);
      expect(unoGame.tableCards.length).toEqual(1);
    });
  });

  describe("drawCards", () => {
    it("should correctly draw cards from the deck: each player has 5 cards", () => {
      // Arrange
      const unoGame = new UnoGame();

      const deck = new UnoDeck();
      deck.shuffle();
      unoGame.deck = deck;

      const players = [
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
      ];
      players[0].name = "Player-1";
      players[1].name = "Player-2";
      players[2].name = "Player-3";
      players[3].name = "Player-4";
      unoGame.players.push(players[0]);
      unoGame.players.push(players[1]);
      unoGame.players.push(players[2]);
      unoGame.players.push(players[3]);

      // Act
      unoGame.drawCards();

      // Assert
      expect(players[0].hands.length).toEqual(5);
      expect(players[1].hands.length).toEqual(5);
      expect(players[2].hands.length).toEqual(5);
      expect(players[3].hands.length).toEqual(5);
    });
  });

  describe("takeTurn", () => {
    it("should correctly take a turn: player 1 plays 2 cards, player 2 plays a card, player 3 plays a card, player 4 plays a card", async () => {
      // Arrange
      const unoGame = new UnoGame();

      const deck = new UnoDeck();
      unoGame.deck = deck;

      const players = [
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
      ];
      players[0].name = "Player-1";
      players[1].name = "Player-2";
      players[2].name = "Player-3";
      players[3].name = "Player-4";
      unoGame.players.push(players[0]);
      unoGame.players.push(players[1]);
      unoGame.players.push(players[2]);
      unoGame.players.push(players[3]);

      unoGame["initTableCards"]();

      const card1 = new UnoCard(green, 9);
      const card2 = new UnoCard(yellow, 9);
      const card3 = new UnoCard(blue, 9);
      const card4 = new UnoCard(red, 9);

      const card5 = new UnoCard(red, 7);
      const card6 = new UnoCard(yellow, 8);
      const card7 = new UnoCard(blue, 8);
      const card8 = new UnoCard(red, 8);

      players[0].hands = new Array().concat([card1, card5]);
      players[1].hands = new Array().concat([card2, card6]);
      players[2].hands = new Array().concat([card3, card7]);
      players[3].hands = new Array().concat([card4, card8]);

      const selectSpy = jest
        .spyOn(UnoPlayer.prototype as any, "select")
        .mockImplementationOnce(() => {
          return Promise.resolve(card1);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card2);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card3);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card4);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card5);
        });

      // Act
      await unoGame.takeTurns();

      // Assert
      expect(selectSpy).toHaveBeenCalledTimes(5);
      expect(players[0].hands.length).toEqual(0);
      expect(players[1].hands.length).toEqual(1);
      expect(players[2].hands.length).toEqual(1);
      expect(players[3].hands.length).toEqual(1);
    });

    it("should correctly prompt the player has selected an invalid card", async () => {
      // Arrange
      const unoGame = new UnoGame();

      const deck = new UnoDeck();
      unoGame.deck = deck;

      const players = [
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
      ];
      players[0].name = "Player-1";
      players[1].name = "Player-2";
      players[2].name = "Player-3";
      players[3].name = "Player-4";
      unoGame.players.push(players[0]);
      unoGame.players.push(players[1]);
      unoGame.players.push(players[2]);
      unoGame.players.push(players[3]);

      unoGame["initTableCards"]();

      const card1 = new UnoCard(green, 9);
      const card2 = new UnoCard(yellow, 9);
      const card3 = new UnoCard(blue, 9);
      const card4 = new UnoCard(red, 9);

      const card5 = new UnoCard(red, 7);
      const card6 = new UnoCard(yellow, 8);
      const card7 = new UnoCard(blue, 8);
      const card8 = new UnoCard(red, 8);

      players[0].hands = new Array().concat([card1, card5]);
      players[1].hands = new Array().concat([card2, card6]);
      players[2].hands = new Array().concat([card3, card7]);
      players[3].hands = new Array().concat([card4, card8]);

      const selectSpy = jest
        .spyOn(UnoPlayer.prototype as any, "select")
        .mockImplementationOnce(() => {
          return Promise.resolve(card1);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card2);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card3);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card8);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card4);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card5);
        });

      const logSpy = jest.spyOn(console, "log");

      // Act
      await unoGame.takeTurns();

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        `Player-4 selected an invalid card, try again...`
      );
      expect(selectSpy).toHaveBeenCalledTimes(6);
    });

    it("should correctly draw a card from the top of the deck: player does not have valid card to play", async () => {
      // Arrange
      const unoGame = new UnoGame();

      const deck = new UnoDeck();
      unoGame.deck = deck;

      const players = [
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
      ];
      players[0].name = "Player-1";
      players[1].name = "Player-2";
      players[2].name = "Player-3";
      players[3].name = "Player-4";
      unoGame.players.push(players[0]);
      unoGame.players.push(players[1]);
      unoGame.players.push(players[2]);
      unoGame.players.push(players[3]);

      unoGame["initTableCards"]();

      const card1 = new UnoCard(green, 9);
      const card2 = new UnoCard(yellow, 9);
      const card3 = new UnoCard(blue, 9);
      const card4 = new UnoCard(red, 6);

      const card5 = new UnoCard(yellow, 7);
      const card6 = new UnoCard(yellow, 8);
      const card7 = new UnoCard(blue, 8);
      const card8 = new UnoCard(red, 8);

      players[0].hands = new Array().concat([card1, card5]);
      players[1].hands = new Array().concat([card2, card6]);
      players[2].hands = new Array().concat([card3, card7]);
      players[3].hands = new Array().concat([card4, card8]);

      let drawCard: UnoCard | undefined = undefined;
      const selectSpy = jest
        .spyOn(UnoPlayer.prototype as any, "select")
        .mockImplementationOnce(() => {
          return Promise.resolve(card1);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card2);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card3);
        })
        .mockImplementationOnce(() => {
          // the card drew from deck
          drawCard = players[3].hands[2];
          return Promise.resolve(drawCard);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card5);
        });

      // Act
      await unoGame.takeTurns();

      // Assert
      expect(selectSpy).toHaveBeenCalledTimes(5);
      expect(drawCard!.color).toEqual(yellow);
      expect(drawCard!.number).toEqual(9);
    });

    it("should correctly shuffle the deck and draw a card from the top of the deck: player does not have valid card to play and deck is empty", async () => {
      const unoGame = new UnoGame();

      const deck = new UnoDeck();
      unoGame.deck = deck;

      const players = [
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
      ];
      players[0].name = "Player-1";
      players[1].name = "Player-2";
      players[2].name = "Player-3";
      players[3].name = "Player-4";
      unoGame.players.push(players[0]);
      unoGame.players.push(players[1]);
      unoGame.players.push(players[2]);
      unoGame.players.push(players[3]);

      unoGame["initTableCards"]();
      unoGame.deck.cards = [];

      const card1 = new UnoCard(green, 9);
      const card2 = new UnoCard(yellow, 9);
      const card3 = new UnoCard(blue, 9);
      const card4 = new UnoCard(red, 6);

      const card5 = new UnoCard(yellow, 7);
      const card6 = new UnoCard(yellow, 8);
      const card7 = new UnoCard(blue, 8);
      const card8 = new UnoCard(red, 8);

      players[0].hands = new Array().concat([card1, card5]);
      players[1].hands = new Array().concat([card2, card6]);
      players[2].hands = new Array().concat([card3, card7]);
      players[3].hands = new Array().concat([card4, card8]);

      let drawCard: UnoCard | undefined = undefined;
      const selectSpy = jest
        .spyOn(UnoPlayer.prototype as any, "select")
        .mockImplementationOnce(() => {
          return Promise.resolve(card1);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card2);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card3);
        })
        .mockImplementationOnce(() => {
          // the card drew from deck
          drawCard = players[3].hands[2];
          return Promise.resolve(drawCard);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card5);
        });
      const shuffleSpy = jest
        .spyOn(UnoDeck.prototype as any, "shuffle")
        .mockImplementation(() => {});

      // Act
      await unoGame.takeTurns();

      // Assert
      expect(selectSpy).toHaveBeenCalledTimes(5);
      expect(drawCard!.color).toEqual(yellow);
      expect(drawCard!.number).toEqual(9);
      expect(shuffleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("endGame", () => {
    it("should correctly end the game", async () => {
      const unoGame = new UnoGame();

      const deck = new UnoDeck();
      unoGame.deck = deck;

      const players = [
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
        new UnoPlayer(),
      ];
      players[0].name = "Player-1";
      players[1].name = "Player-2";
      players[2].name = "Player-3";
      players[3].name = "Player-4";
      unoGame.players.push(players[0]);
      unoGame.players.push(players[1]);
      unoGame.players.push(players[2]);
      unoGame.players.push(players[3]);

      unoGame["initTableCards"]();

      const card1 = new UnoCard(green, 9);
      const card2 = new UnoCard(yellow, 9);
      const card3 = new UnoCard(blue, 9);
      const card4 = new UnoCard(red, 9);

      const card5 = new UnoCard(red, 7);
      const card6 = new UnoCard(yellow, 8);
      const card7 = new UnoCard(blue, 8);
      const card8 = new UnoCard(red, 8);

      players[0].hands = new Array().concat([card1, card5]);
      players[1].hands = new Array().concat([card2, card6]);
      players[2].hands = new Array().concat([card3, card7]);
      players[3].hands = new Array().concat([card4, card8]);

      const selectSpy = jest
        .spyOn(UnoPlayer.prototype as any, "select")
        .mockImplementationOnce(() => {
          return Promise.resolve(card1);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card2);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card3);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card4);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve(card5);
        });
      const logSpy = jest.spyOn(console, "log");

      // Act
      await unoGame.takeTurns();
      unoGame["endGame"]();

      // Assert
      expect(selectSpy).toHaveBeenCalledTimes(5);
      expect(unoGame.turns).toEqual(1);
      expect(logSpy).toHaveBeenCalledWith(`The winner is: Player-1`);
      expect(players[0].hands.length).toEqual(0);
    });
  });
});
