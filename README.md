crabbington
==================

This is my 2020 DRL attempt!

Plan
---

- Look at Pico8 - done!
- Look at Bitsy - done
- Look at exogenite code - done
- Look at genie code - done
- Define some development rules
  - No single graphic should take more than 15 minutes to make
  - No cellular-automata-style cellular simultaneous updates. Everything should be sequential
  - Allow complex drawing code that does a lot on its own instead of trying to model everything

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
