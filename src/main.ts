import { ShowdownGame } from "./models-showdown/ShowdownGame";
import { UnoGame } from "./models-uno/UnoGame";

// const main = async () => {
//   const showdown = new ShowdownGame();
//   await showdown.initGame();
//   showdown.drawCards();
//   await showdown.takeTurns();
//   showdown.endGame();
// };

const main = async () => {
  const uno = new UnoGame();
  await uno.initGame();
  uno.drawCards();
  await uno.takeTurns();
  uno.endGame();
};

main();
