import { describe, it, expect } from "@jest/globals";
import { COLOR, UnoCard } from "../UnoCard";

describe("UnoCard", () => {
  const colors = Object.keys(COLOR);
  const red = colors[0] as COLOR;

  it("should throw an error when number is less than 0", () => {
    expect(() => new UnoCard(red, -1)).toThrowError("Invalid number");
  });

  it("should throw an error when number is greater than 9", () => {
    expect(() => new UnoCard(red, 10)).toThrowError("Invalid number");
  });
});
