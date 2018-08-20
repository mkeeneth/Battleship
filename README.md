Battleship
=======

## About

This is a player vs. computer JavaScript implementation of Battleship.  It has been written completely in native Javascript and uses no other libraries.

It was tested in the recent versions of Chrome, Firefox and Edge.  Internet Explorer is not supported.

## How to run

Download, unzip and open index.html.

## Test plan

- All listed ships can be selected and placed.
    - On click display an additional instruction in the status area indicating ship and length.
    - Clicking the ship again or another ship in the list does nothing until current ship is placed.
    - if a ship is already placed and clicked again, display a message indicating that.
- Once all ships are placed, the target area becomes clickable.
- On target grid click, the appropriate result is shown.
    - hit - grid turns red.
    - hit and sunk - grid turns red and the status message is updated indicates what ship was sunk.
    - miss - grid turns is yellow. 
    - an already marked grid does nothing.
- Once all of either players ships are sunk.
    - Target clicks do nothing.
    - A message displaying the win or loss for the player is displayed.
    - The hidden enemy positions are revealed. 

## Additional enhancements

- Add unit tests
- Refactor Main Battleship object into other objects(grids/tile/etc)
- Add horizontal placement support
- Add random enemy ship placement 
- Improve enemy targeting 
- Add Polyfills to support IE (Or use a modern library to accomplish)
