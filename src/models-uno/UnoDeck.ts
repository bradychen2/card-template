import { COLOR, UnoCard } from "./UnoCard";

export class UnoDeck {
  private _cards: UnoCard[] = [];

  public get cards(): UnoCard[] {
    return this._cards;
  }

  public set cards(value: UnoCard[]) {
    this._cards = value;
  }

  public constructor() {
    this.initDeck();
  }

  public initDeck(): void {
    const colors = Object.keys(COLOR);
    for (let number = 0; number < 10; number++) {
      for (const color of colors) {
        // if (!isNaN(Number(color))) continue;
        this.cards.push(new UnoCard(color as COLOR, number));
      }
    }
  }

  public drawTopCard(): UnoCard {
    return this.cards.pop() as UnoCard;
  }

  public shuffle(): void {
    // Fisher and Yates Algo
    for (let i = this.cards.length - 1; i >= 0; i -= 1) {
      const randomIdx = Math.floor(Math.random() * (i + 1));
      const randomCard: UnoCard = this.cards[randomIdx];
      this.cards[randomIdx] = this.cards[i];
      this.cards[i] = randomCard;
    }
  }
}
