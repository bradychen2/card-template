import { UnoCard } from "./UnoCard";
import { UnoDeck } from "./UnoDeck";
import { UnoPlayer } from "./UnoPlayer";

export class UnoGame {
  private _players: UnoPlayer[] = [];
  private _deck: UnoDeck;
  private _turns: number = 1;
  private _tableCards: UnoCard[] = [];

  public get players(): UnoPlayer[] {
    return this._players;
  }

  public get deck(): UnoDeck {
    return this._deck;
  }

  public set deck(value: UnoDeck) {
    this._deck = value;
  }

  public get turns(): number {
    return this._turns;
  }

  public get tableCards(): UnoCard[] {
    return this._tableCards;
  }

  public set tableCards(value: UnoCard[]) {
    this._tableCards = value;
  }

  private async initPlayers(): Promise<void> {
    for (let i = 0; i < 4; i++) {
      const newPlayer = new UnoPlayer();
      await newPlayer.nameSelf();
      this.players.push(newPlayer);
    }
  }

  private initDeck(): void {
    this.deck = new UnoDeck();
    this.deck.shuffle();
  }

  private initTableCards(): void {
    this.tableCards.push(this.deck.drawTopCard());
  }

  public async initGame(): Promise<void> {
    await this.initPlayers();
    this.initDeck();
    this.initTableCards();
  }

  public drawCards(): void {
    let initHandCardsCount = 5;
    while (initHandCardsCount > 0) {
      this.players.forEach((player: UnoPlayer) => {
        const topCard = this.deck.drawTopCard();
        player.addHandCard(topCard);
      });
      initHandCardsCount -= 1;
    }
  }

  private playerHasValidCards(player: UnoPlayer): boolean {
    const topCard: UnoCard = this.tableCards[this.tableCards.length - 1];
    const validCards: UnoCard[] = player.hands.filter((card: UnoCard) => {
      return card.color === topCard.color || card.number === topCard.number;
    });
    return validCards.length > 0;
  }

  private validateSelectedCard(selectedCard: UnoCard): boolean {
    const topCard: UnoCard = this.tableCards[this.tableCards.length - 1];
    return (
      selectedCard.color === topCard.color ||
      selectedCard.number === topCard.number
    );
  }

  public async takeTurns(): Promise<void> {
    let endGame = false;
    while (!endGame) {
      for (const player of this.players) {
        const topCard = this.tableCards[this.tableCards.length - 1];
        console.log(
          `the top card on the table is: ${topCard.color} ${topCard.number}`
        );
        // if the player has no valid cards, then draw a card from deck
        while (!this.playerHasValidCards(player)) {
          console.log(`${player.name} has no valid cards, drawing a card...`);
          // if no cards in deck, then shuffle the table cards (w/o the top card) and use it as a new deck
          if (this.deck.cards.length === 0) {
            console.log("No cards in deck, shuffling the table cards...");
            const topCard: UnoCard = this.tableCards.pop() as UnoCard;
            this.deck.cards = this.tableCards;
            this.tableCards = [topCard];
            this.deck.shuffle();
          }
          const topCard: UnoCard = this.deck.drawTopCard();
          console.log(
            `${player.name} drew a card: ${topCard.color} ${topCard.number}`
          );
          player.addHandCard(topCard);
        }

        // if the player has valid cards, then select a card to play
        let playerHasSelectedCard = false;
        while (this.playerHasValidCards(player)) {
          const selectedCard = await player.select();
          if (this.validateSelectedCard(selectedCard)) {
            this.tableCards.push(selectedCard);
            player.removeCardFromHands(selectedCard);
            playerHasSelectedCard = true;
            break;
          }
          console.log(`${player.name} selected an invalid card, try again...`);
        }
        if (player.hands.length === 0) {
          endGame = true;
          break;
        }
        if (playerHasSelectedCard) {
          continue;
        }
      }
    }
  }

  private displayWinner(): void {
    this.players.forEach((player: UnoPlayer) => {
      if (player.hands.length === 0) {
        console.log(`The winner is: ${player.name}`);
      }
    });
  }

  public async endGame(): Promise<void> {
    this.displayWinner();
  }
}
