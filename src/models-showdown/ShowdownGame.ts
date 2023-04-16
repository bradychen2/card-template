import { Card, RankMap } from "./Card";
import { Deck } from "./Deck";
import { Player } from "./Player";

export class ShowdownGame {
  private _players: Player[] = [];
  private _deck: Deck;
  private _turns: number = 13;

  public get players(): Player[] {
    return this._players;
  }

  private addPlayer(player: Player) {
    if (this.players.length == 4) {
      throw new Error(`there're at most 4 players in a game`);
    }
    this.players.push(player);
  }

  public get deck(): Deck {
    return this._deck;
  }

  public set deck(deck: Deck) {
    this._deck = deck;
  }

  public get turns(): number {
    return this._turns;
  }
  private set turns(turns: number) {
    this._turns = turns;
  }

  private compareCards(card1: Card, card2: Card): Card {
    if (
      (RankMap.get(card1.rank) as number) > (RankMap.get(card2.rank) as number)
    ) {
      return card1;
    } else if (
      (RankMap.get(card1.rank) as number) < (RankMap.get(card2.rank) as number)
    ) {
      return card2;
    } else {
      if (card1.suit > card2.suit) {
        return card1;
      }
      return card2;
    }
  }

  private showdown(showCards: Card[]): Card {
    let biggest: Card = showCards[0];
    for (let i = 0; i < showCards.length; i++) {
      console.log(
        `${this.players[i].name} showed: ${showCards[i].rank} ${showCards[i].suit}`
      );
      const currCard = showCards[i];
      biggest = this.compareCards(biggest, currCard);
    }
    return biggest;
  }

  private displayScores(): void {
    this.players.forEach((player: Player) => {
      console.log(`${player.name} - ${player.points} points`);
    });
  }

  private displayWinner(): void {
    let winner: Player = this.players[0];
    this.players.forEach((player: Player) => {
      if (player.points > winner.points) {
        winner = player;
      }
    });
    console.log(`The winner is ${winner.name}!!!!`);
  }

  private initPlayers(): void {
    for (let i = 0; i < 4; i++) {
      const newPlayer = new Player();
      newPlayer.nameSelf();
      this.addPlayer(newPlayer);
    }
  }

  private initDeck(): void {
    this.deck = new Deck();
    this.deck.shuffle();
  }

  public initGame(): void {
    this.initPlayers();
    this.initDeck();
  }

  public drawCards(): void {
    while (this.deck.cards.length > 0) {
      this.players.forEach((player: Player) => {
        // every player has 13 cards in the start of the game
        if (player.hands.length < 13) {
          player.addHandCard(this.deck.drawTopCard());
        }
      });
    }
  }

  public async takeTurns(): Promise<void> {
    const maxTurn = this.turns;
    while (this.turns !== 0) {
      // each player showed their cards
      const showCards: Card[] = [];
      for (const player of this.players) {
        const selectedCard: Card = (await player.select()) as Card;
        showCards.push(selectedCard);
        player.removeCardFromHands(selectedCard);
      }
      // determine the winner in this round
      const biggest: Card = this.showdown(showCards);
      const biggestIdx: number = showCards.indexOf(biggest);
      const winnerThisRound: Player = this.players[biggestIdx];
      console.log(
        `The winner of round-${maxTurn - this.turns + 1} is ${
          winnerThisRound.name
        }!!!`
      );
      winnerThisRound.addPoint(1);

      this._turns -= 1;
    }
  }

  public endGame(): void {
    this.displayScores();
    this.displayWinner();
  }
}
