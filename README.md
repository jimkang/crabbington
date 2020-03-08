crabbington
==================

This is my 2020 7DRL attempt!

Plan
---

- Specify allowed grids in soul def - Done
- Specify motion pattern in soul def - Done
- Tablenest hierarchy - Done
- Help button - Done
- Define some development rules - Done
  - No cellular-automata-style cellular simultaneous updates. Everything should be sequential
  - Allow complex drawing code that does a lot on its own instead of trying to model everything
- Make all grids cover most of board - Done
- Characters facing specific directions - Done
- Impassable souls (walls) - Done
- Passable souls (floor tiles)
- Item pickup - Done
- Hide most of grid?
- Hitting
- Sleeping
- Easier clicking - Done
- Make action buttons easier to notice as button. -Done-ish
- Make figures slightly smaller when doing semantic zoom out
- "Find me" HUD button
- Victory condition item - Done
- Make player character more obvious
- Seeking movement
- Fix bug in which intersection at which soul died still has action options for when that soul lived. - Done
- Other guys hitting - Done!
- hp - Done
- Diagonal bonk, diagonal take - Done
- Death check - Done
- Guys should drop items when they die
- Explain goal - Done
- Don't trigger turns when an empty diagonal space is clicked.
- Speed up time between turns.

Vague concepts to fit in if somehow the basics come together
---

- Phase-based changes in abilities/properties. As in the Lottery in Babylon.
- Factions
- Idea-spreading
- Geometrical movement

Installation
------------

First, install Node. Then:

    npm install
    npm install wzrd -g

Usage
-----

    make run

Then, wzrd will say something like:

    wzrd index.js
    server started at http://localhost:9966

You can open your browser to that.

You can then add code starting in app.js. This won't compile down to ES 5 – expects clients to support ES 6. You can check out an earlier commit of this repo - d227984628e258a2cf82fa14926b0e452fe4f5f9 or earlier - if you want support for that.

Run `make prettier` (expects you to have run `npm install -g prettier`) and `eslint .` before committing.

License
-------

No license until I have time to rethink the consequences of licenses, but feel free to email me if you want to use something!

Copyright (c) 2020 Jim Kang
