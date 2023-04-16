import readline from "readline";
import {
  it,
  expect,
  jest,
  describe,
  afterEach,
  beforeEach,
} from "@jest/globals";
import { UnoPlayer } from "../UnoPlayer";
import { COLOR, UnoCard } from "../UnoCard";

jest.unmock("mock-stdin");

let stdin: any;
beforeEach(() => {
  stdin = require("mock-stdin").stdin();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.resetAllMocks();
});

describe("Player", () => {
  const colors = Object.keys(COLOR);
  const red = colors[0] as COLOR;

  describe("nameSelf()", () => {
    it("should set the name when user enters a valid name", async () => {
      const player = new UnoPlayer();

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
      const player = new UnoPlayer();

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

    it("should throw error when unexpected error happened", async () => {
      const player = new UnoPlayer();

      const namePromptSpy = jest
        .spyOn(UnoPlayer.prototype as any, "namePrompt")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected error");
        }) as any;

      await expect(player["nameSelf"]()).rejects.toThrowError();
      expect(namePromptSpy).toBeCalledTimes(1);
    });
  });

  describe("validateInputName()", () => {
    it("should return true when input is valid", () => {
      const player = new UnoPlayer();
      const input = "John";
      const result = player["validateInputName"](input);
      expect(result).toBe(true);
    });

    it("should return false when input is invalid", () => {
      const player = new UnoPlayer();
      const input = "John Doe";
      const result = player["validateInputName"](input);
      expect(result).toBe(false);
    });

    it("should throw error when unexpected error happened", () => {
      const player = new UnoPlayer();
      const input = "John Doe";
      const regexTestSpy = jest
        .spyOn(RegExp.prototype as any, "test")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected error");
        }) as any;

      expect(() => player["validateInputName"](input)).toThrowError();
    });
  });

  describe("select()", () => {
    it(`should return the selected card: ${red} 1`, async () => {
      const player = new UnoPlayer();
      const card1 = new UnoCard(red, 1);
      const card2 = new UnoCard(red, 2);
      const card3 = new UnoCard(red, 3);
      const card4 = new UnoCard(red, 4);
      const card5 = new UnoCard(red, 5);
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

      const result = await player.select();
      expect(result).toEqual(card1);
    });

    it("should throw error when unexpected error happened", async () => {
      const player = new UnoPlayer();
      const card1 = new UnoCard(red, 1);
      const card2 = new UnoCard(red, 2);
      const card3 = new UnoCard(red, 3);
      const card4 = new UnoCard(red, 4);
      const card5 = new UnoCard(red, 5);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);
      player.addHandCard(card4);
      player.addHandCard(card5);

      const errorSpy = jest.spyOn(console, "error");
      const selectPromptSpy = jest
        .spyOn(UnoPlayer.prototype as any, "selectPrompt")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected error");
        }) as any;

      await expect(player.select()).rejects.toThrowError();
      expect(selectPromptSpy).toBeCalledTimes(1);
      expect(errorSpy).toBeCalledWith(`select error: Unexpected error`);
    });
  });

  describe("selectPrompt()", () => {
    it("should return the selected card: RED 1", async () => {
      const player = new UnoPlayer();
      const card1 = new UnoCard(red, 1);
      const card2 = new UnoCard(red, 2);
      const card3 = new UnoCard(red, 3);
      const card4 = new UnoCard(red, 4);
      const card5 = new UnoCard(red, 5);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);
      player.addHandCard(card4);
      player.addHandCard(card5);

      process.nextTick(() => {
        stdin.send(`1\r`);
      });

      const result = await player["selectPrompt"]();
      expect(result).toEqual(card1);
    });

    it("should keep prompting user if invalid selection is entered", async () => {
      const player = new UnoPlayer();
      const card1 = new UnoCard(red, 1);
      const card2 = new UnoCard(red, 2);
      const card3 = new UnoCard(red, 3);
      const card4 = new UnoCard(red, 4);
      const card5 = new UnoCard(red, 5);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);
      player.addHandCard(card4);
      player.addHandCard(card5);

      const errorSpy = jest.spyOn(console, "error");

      process.nextTick(() => {
        stdin.send(`6\r`);
      });

      const result = await player["selectPrompt"]();
      expect(errorSpy).toBeCalledWith(
        `invalid input. Plz select a card from 1 to ${player.hands.length}`
      );
      expect(result).toEqual(undefined);
    });
  });

  describe("validateInputSelection()", () => {
    it("should return true when input is valid", () => {
      const player = new UnoPlayer();
      const card1 = new UnoCard(red, 1);
      const card2 = new UnoCard(red, 2);
      const card3 = new UnoCard(red, 3);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);

      const input = "1";
      const result = player["validateInputSelection"](input);
      expect(result).toBe(true);
    });

    it("should return false when input is invalid", () => {
      const player = new UnoPlayer();
      const card1 = new UnoCard(red, 1);
      const card2 = new UnoCard(red, 2);
      const card3 = new UnoCard(red, 3);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);

      const input = "4";
      const result = player["validateInputSelection"](input);
      expect(result).toBe(false);
    });
  });

  describe("selectCardFromHands()", () => {
    it("should return the selected card: RED 1", async () => {
      const player = new UnoPlayer();
      const card1 = new UnoCard(red, 1);
      const card2 = new UnoCard(red, 2);
      const card3 = new UnoCard(red, 3);
      const card4 = new UnoCard(red, 4);
      const card5 = new UnoCard(red, 5);
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

      // Act
      const selectedCard = await player["selectCardFromHands"]("1");

      // Assert
      expect(selectedCard).toBe(card1);
    });
  });

  describe("removeCardFromHands()", () => {
    it("should remove the card from hand", () => {
      const player = new UnoPlayer();
      const card1 = new UnoCard(red, 1);
      const card2 = new UnoCard(red, 2);
      const card3 = new UnoCard(red, 3);
      const card4 = new UnoCard(red, 4);
      const card5 = new UnoCard(red, 5);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);
      player.addHandCard(card4);
      player.addHandCard(card5);

      player["removeCardFromHands"](card1);

      expect(player.hands.length).toBe(4);
      expect(player.hands).not.toContain(card1);
      expect(player.hands).toEqual([card2, card3, card4, card5]);
    });

    it("should throw error when the input card is not in hand", () => {
      const player = new UnoPlayer();
      const card1 = new UnoCard(red, 1);
      const card2 = new UnoCard(red, 2);
      const card3 = new UnoCard(red, 3);
      const card4 = new UnoCard(red, 4);
      const card5 = new UnoCard(red, 5);
      player.addHandCard(card1);
      player.addHandCard(card2);
      player.addHandCard(card3);
      player.addHandCard(card4);

      expect(() => player["removeCardFromHands"](card5)).toThrowError(
        `removeCardFromHands error: card not found`
      );
    });
  });
});
