// drive front end, click through happy path to completion
import "babel-polyfill";
import * as C from "./constants";

const waitTime = 80;
const timeout = ms => new Promise(res => setTimeout(res, ms));

export const happyPathTest = async () => {
  document.getElementById("battleships_list").children[0].click();
  await timeout(waitTime);
  document.getElementById("playergrid_1_1").click();
  await timeout(waitTime);
  document.getElementById("battleships_list").children[1].click();
  await timeout(waitTime);
  document.getElementById("playergrid_2_3").click();
  await timeout(waitTime);
  document.getElementById("battleships_list").children[2].click();
  await timeout(waitTime);
  document.getElementById("playergrid_4_5").click();
  await timeout(waitTime);
  document.getElementById("battleships_list").children[3].click();
  await timeout(waitTime);
  document.getElementById("playergrid_6_1").click();
  await timeout(waitTime);
  document.getElementById("battleships_list").children[4].click();
  await timeout(waitTime);
  document.getElementById("playergrid_2_7").click();
  await timeout(waitTime);

  for (let i = 0; i < C.GRID_SIZE; i++) {
    for (let ii = 0; ii < C.GRID_SIZE; ii++) {
      // click it
      document.getElementById(C.ENEMY_OCEAN_PREFIX + i + "_" + ii).click();
      await timeout(waitTime);
    }
  }
};
