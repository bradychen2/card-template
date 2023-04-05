import { ShowdownGame } from "./models-showdown/ShowdownGame";

const main = async () => {
  const showdown = new ShowdownGame();
  await showdown.initGame();
  showdown.drawCards();
  await showdown.takeTurns();
};

main();
