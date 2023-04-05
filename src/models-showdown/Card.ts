export enum SUITS {
  CLUB = 1,
  DIAMOND = 2,
  HEART = 3,
  SPADE = 4,
}

export const RankMap = new Map(
  Array.from({ length: 13 }, (value, index) => {
    if (index + 1 === 1) return [1, 14];
    else return [index + 1, index + 1];
  })
);

export type suit = keyof typeof SUITS;

export class Card {
  private _rank: number;
  private _suit: suit;

  constructor(suit: suit, rank: number) {
    this.suit = suit;
    this.rank = rank;
  }

  public get rank(): number {
    return this._rank;
  }
  public set rank(rank: number) {
    if (rank < 1 || rank > 13) {
      throw new Error(`rank cannot be less than 1 or greater than 13`);
    }
    this._rank = rank;
  }

  public get suit(): suit {
    return this._suit;
  }
  public set suit(suit: suit) {
    this._suit = suit;
  }
}
