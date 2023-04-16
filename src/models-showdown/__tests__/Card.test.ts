import { describe, it, expect } from "@jest/globals";
import { Card, SUITS, suit } from "../Card";

describe("Card", () => {
  const suits = Object.values(SUITS);
  const spade = suits[3] as suit;

  it("should throw error if invalid rank is passed", () => {
    expect(() => new Card(spade, 0)).toThrowError(
      "rank cannot be less than 1 or greater than 13"
    );
  });
});
