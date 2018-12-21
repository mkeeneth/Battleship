// drive front end, click through happy path to completion
import "babel-polyfill";
import * as C from "./constants";

const waitTime = 50;
const timeout = ms => new Promise(res => setTimeout(res, ms));

const clickAndWait = async element => {
  element.click();
  await timeout(waitTime);
};

export const happyPathTest = async () => {
  await clickAndWait(document.getElementById("battleships_list").children[0]);
  await clickAndWait(document.getElementById("playergrid_1_1"));
  await clickAndWait(document.getElementById("battleships_list").children[1]);
  await clickAndWait(document.getElementById("playergrid_2_3"));
  await clickAndWait(document.getElementById("battleships_list").children[2]);
  await clickAndWait(document.getElementById("playergrid_4_5"));
  await clickAndWait(document.getElementById("battleships_list").children[3]);
  await clickAndWait(document.getElementById("playergrid_6_1"));
  await clickAndWait(document.getElementById("battleships_list").children[4]);
  await clickAndWait(document.getElementById("playergrid_2_7"));

  for (let i = 0; i < C.GRID_SIZE; i++) {
    for (let ii = 0; ii < C.GRID_SIZE; ii++) {
      // click it
      await clickAndWait(document.getElementById(C.ENEMY_OCEAN_PREFIX + i + "_" + ii));
    }
  }
};
