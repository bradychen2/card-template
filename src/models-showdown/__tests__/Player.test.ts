import { describe } from "node:test";
import { Player } from "../Player";
import readline from "readline";
import { it, expect, jest, afterEach } from "@jest/globals";
import { Card, SUITS, suit } from "../Card";

describe("Player", () => {
  const suits = Object.values(SUITS);
  const clubs = suits[0] as suit;
  const diamonds = suits[1] as suit;
  const hearts = suits[2] as suit;
  const spades = suits[3] as suit;

  describe("nameSelf()", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should set the name when user enters a valid name", async () => {
      const player = new Player();

      jest.spyOn(readline, "createInterface").mockReturnValueOnce({
        question: jest.fn().mockImplementationOnce((_, callback: any) => {
          // Simulate user input
          callback("John");
        }),
        close: jest.fn(),
      } as any);

      await player["nameSelf"]();

      expect(player.name).toBe("John");
    });

    it("should keep prompting user if invalid name is entered", async () => {
      const player = new Player();

      // Mock readline.createInterface to simulate user input
      jest.spyOn(readline, "createInterface").mockReturnValue({
        question: jest
          .fn()
          .mockImplementationOnce((_, callback: any) => {
            // Simulate invalid user input
            callback("John Doe");
          })
          .mockImplementationOnce((_, callback: any) => {
            // Simulate valid user input
            callback("Jane");
          }),
        close: jest.fn(),
      } as any);

      await player["nameSelf"]();

      expect(player.name).toBe("Jane");
    });

    it("should throw error if readline.createInterface throws error", async () => {
      const player = new Player();

      // Mock readline.createInterface to simulate error
      jest.spyOn(readline, "createInterface").mockImplementation(() => {
        throw Error("readline error");
      });

      await expect(player["nameSelf"]()).rejects.toThrow("nameSelf error");
    });
  });

  describe("select()", () => {
    it("should return the selected card: SPADE 1", async () => {
      const player = new Player();
      const card1 = new Card(spades, 1);
      const card2 = new Card(spades, 2);
      const card3 = new Card(spades, 3);
      const card4 = new Card(spades, 4);
      const card5 = new Card(spades, 5);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);
      player.addHandCard(card4);
      player.addHandCard(card5);

      jest.spyOn(readline, "createInterface").mockReturnValueOnce({
        question: jest.fn().mockImplementationOnce((_, callback: any) => {
          // Simulate user input
          callback("1");
        }),
        close: jest.fn(),
      } as any);

      const selectedCard = await player.select();
      expect(selectedCard).toBe(card1);
    });

    it("should keep prompting user if invalid card is selected", async () => {
      const player = new Player();
      const card1 = new Card(spades, 1);
      const card2 = new Card(spades, 2);
      const card3 = new Card(spades, 3);
      const card4 = new Card(spades, 4);
      const card5 = new Card(spades, 5);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);
      player.addHandCard(card4);
      player.addHandCard(card5);

      jest.spyOn(readline, "createInterface").mockReturnValue({
        question: jest
          .fn()
          .mockImplementationOnce((_, callback: any) => {
            // Simulate invalid user input
            callback("6");
          })
          .mockImplementationOnce((_, callback: any) => {
            // Simulate valid user input
            callback("1");
          }),
        close: jest.fn(),
      } as any);

      const selectedCard = await player.select();
      expect(selectedCard).toBe(card1);
    });

    it("should throw error if readline.createInterface throws error", async () => {
      const player = new Player();
      const card1 = new Card(spades, 1);

      player.addHandCard(card1);

      // Mock readline.createInterface to simulate error
      jest.spyOn(readline, "createInterface").mockImplementation(() => {
        throw new Error("readline error");
      });

      await expect(player.select()).rejects.toThrow("select error");
    });
  });

  describe("validateInputName()", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return true when user enters a valid name", () => {
      const player = new Player();
      const isValid = player["validateInputName"]("John");
      expect(isValid).toBe(true);
    });

    it("should return false when user enters an invalid name", () => {
      const player = new Player();
      const isValid = player["validateInputName"]("John Doe");
      expect(isValid).toBe(false);
    });

    it("should throw error if Regex test throws error", async () => {
      const player = new Player();

      // Mock Regex test to simulate error
      jest.spyOn(RegExp.prototype, "test").mockImplementationOnce(() => {
        throw new Error("Regex test error");
      });

      expect(() => player["validateInputName"]("JohnDoe")).toThrow(
        "validateInputName error"
      );
    });
  });

  describe("selectCardFromHands()", () => {
    it("should return the selected card: SPADE 1", () => {
      const player = new Player();
      const card1 = new Card(spades, 1);
      const card2 = new Card(spades, 2);
      const card3 = new Card(spades, 3);
      const card4 = new Card(spades, 4);
      const card5 = new Card(spades, 5);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);
      player.addHandCard(card4);
      player.addHandCard(card5);

      const selectedCard = player["selectCardFromHands"]("1");
      expect(selectedCard).toBe(card1);
    });
  });

  describe("removeCardFromHands()", () => {
    it("should remove the selected card: SPADE 1", () => {
      // Arrange
      const player = new Player();
      const card1 = new Card(spades, 1);
      const card2 = new Card(spades, 2);
      const card3 = new Card(spades, 3);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);

      // Act
      player["removeCardFromHands"](card1);
      function removeNotExistHandsCard() {
        player["removeCardFromHands"](card1);
      }

      // Assert
      expect(player.hands.length).toBe(2);
      expect(removeNotExistHandsCard).toThrowError(
        new Error("removeCardFromHands error: card not found")
      );
    });
  });
});
