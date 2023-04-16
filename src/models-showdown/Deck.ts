import { Card, suit, SUITS } from "./Card";

export class Deck {
  private _cards: Card[] = [];

  public get cards(): Card[] {
    return this._cards;
  }

  public set cards(cards: Card[]) {
    this._cards = cards;
  }

  constructor() {
    this.initDeck();
  }

  public initDeck(): void {
    const suits = Object.keys(SUITS);
    for (let rank = 1; rank < 14; rank++) {
      for (const suit of suits) {
        if (!isNaN(Number(suit))) continue;
        this.cards.push(new Card(suit as suit, rank));
      }
    }
  }

  public shuffle(): void {
    // Fisher and Yates Algo
    for (let i = this.cards.length - 1; i >= 0; i -= 1) {
      const randomIdx = Math.floor(Math.random() * (i + 1));
      const randomCard: Card = this.cards[randomIdx];
      this.cards[randomIdx] = this.cards[i];
      this.cards[i] = randomCard;
    }
  }

  public drawTopCard(): Card {
    if (this.cards.length !== 0) {
      const topCard = this.cards.pop() as Card;
      return topCard;
    } else {
      throw new Error(`there's no card in the deck`);
    }
  }
}
