export enum COLOR {
  RED = "red",
  BLUE = "blue",
  YELLOW = "yellow",
  GREEN = "green",
}

export class UnoCard {
  private _color: COLOR;
  private _number: number;

  constructor(color: COLOR, number: number) {
    this.color = color;
    this.number = number;
  }

  public get number(): number {
    return this._number;
  }
  public set number(value: number) {
    if (value < 0 || value > 9) {
      throw new Error("Invalid number");
    }
    this._number = value;
  }

  public get color(): COLOR {
    return this._color;
  }
  public set color(value: COLOR) {
    this._color = value;
  }
}
