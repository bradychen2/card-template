import { UnoCard } from "./UnoCard";
import readline from "readline";
import { stdin, stdout } from "process";

export class UnoPlayer {
  private _name: string;
  private _hands: UnoCard[] = [];

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get hands(): UnoCard[] {
    return this._hands;
  }

  public set hands(value: UnoCard[]) {
    this._hands = value;
  }

  public addHandCard(card: UnoCard) {
    this.hands.push(card);
  }

  private validateInputName(input: string): boolean {
    try {
      const pattern = /^[a-zA-Z0-9]+$/;
      return input.length <= 20 && pattern.test(input);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`validateInputName error: ${error.message}`);
      }
      throw Error(`validateInputName error`);
    }
  }

  private namePrompt(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: stdin,
        output: stdout,
      });
      rl.question(
        `Plz enter your name (a-z, 0-9, no longer than 20 chars):`,
        (answer: string) => {
          if (this.validateInputName(answer)) {
            this.name = answer;
            console.log(`Hi ${this.name}`);
            rl.close();
            resolve(true);
          } else {
            console.error(
              `invalid input. Plz enter a name only includes a-z, 0-9, and <= 20 chars.`
            );
            rl.close();
            resolve(false);
          }
        }
      );
    });
  }

  public async nameSelf(): Promise<void> {
    try {
      let endPrompt = false;
      while (!endPrompt) {
        endPrompt = await this.namePrompt();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`nameSelf error: ${error.message}`);
      }
      throw Error(`nameSelf error`);
    }
  }

  private displayHandsCards(): void {
    console.log(`${this.name}'s hand cards:`);
    for (let i = 0; i < this.hands.length; i++) {
      console.log(`${i + 1} - ${this.hands[i].color} ${this.hands[i].number}`);
    }
  }

  private validateInputSelection(input: string): boolean {
    const answer = parseInt(input);
    return !(isNaN(answer) || answer < 1 || answer > this.hands.length);
  }

  private selectCardFromHands(input: string): UnoCard {
    const index = parseInt(input) - 1;
    const selectedCard = this.hands[index];
    return selectedCard;
  }

  private async selectPrompt(): Promise<UnoCard | undefined> {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: stdin,
        output: stdout,
      });
      this.displayHandsCards();
      rl.question(
        `It's ${this.name}'s turn. Plz select a card (1-${this.hands.length}): `,
        (answer: string) => {
          if (this.validateInputSelection(answer)) {
            const selectedCard = this.selectCardFromHands(answer);
            console.log(
              `Selected card: ${selectedCard.color} ${selectedCard.number}`
            );
            rl.close();
            resolve(selectedCard);
          } else {
            console.error(
              `invalid input. Plz select a card from 1 to ${this.hands.length}`
            );
            rl.close();
            resolve(undefined);
          }
        }
      );
    });
  }

  public async select(): Promise<UnoCard> {
    try {
      let selectedCard: UnoCard | undefined = undefined;
      while (!selectedCard) {
        selectedCard = await this.selectPrompt();
      }
      return selectedCard as UnoCard;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`select error: ${error.message}`);
      }
      throw Error(`select error`);
    }
  }

  public removeCardFromHands(card: UnoCard): void {
    const index = this.hands.indexOf(card);
    if (index !== -1) {
      this.hands.splice(index, 1);
    } else {
      throw Error(`removeCardFromHands error: card not found`);
    }
  }
}
