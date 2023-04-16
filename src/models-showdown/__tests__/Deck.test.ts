import { describe, expect, it } from "@jest/globals";
import { Deck } from "../Deck";
import { Card, SUITS, suit } from "../Card";

describe("Deck", () => {
  describe("drawTopCard()", () => {
    const suits = Object.values(SUITS);
    const spade = suits[3] as suit;

    it("should return the top card from the deck", () => {
      const deck = new Deck();
      const topCard = deck.drawTopCard();

      expect(topCard).toBeInstanceOf(Card);
      expect(topCard.rank).toBe(13);
      expect(topCard.suit).toBe(spade);
      expect(deck.cards.length).toBe(51);
    });

    it("should throw error if deck is empty", () => {
      const deck = new Deck();
      deck.cards = [];

      expect(() => deck.drawTopCard()).toThrowError(
        `there's no card in the deck`
      );
    });
  });
});
