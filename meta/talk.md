# Making a browser video game

## Why

Mostly, why not. Also, read a really good article about hermit crabs. Catalyst: [7DRL](http://www.roguebasin.com/index.php?title=Seven_Day_Roguelike_Challenge)

What is a roguelike? Based on Rogue, written in C to run on a VAX-11 in 1980. Generally, they:

- Have procedurally generated content instead of hand-designed levels
- Permadeath

Former common traits:

- Turn-based
- Overhead 2D view

Big exceptions: Diablo, Spelunky

Some challenge rules:

>     You CAN use external libraries, game engines, pre-existing generic code/algorithms, pre-existing generic art, etc. You can even start your game from an existing game, if you are willing to turn it out into something unique, you must however say what resources were reused.
>    It is allowed and recommended to have a rough design idea of your project before starting
>    After the initial date chosen for the challenge, sign up in the jam page for the year.
>    Whenever you are ready to start working, take note of your starting time. You can optionally post a notice of you starting development in the game jam forum. 168 or less hours after this initial post, submit your game entry on the portal and mark it as successful or unsuccessful
>    The challenge is always Saturday to Sunday; if you start after Sunday you will have less than 168 hours as in-challenge 7DRLs must be completed by the closing time. You can still use 168 hours and have a normal, out of challenge, 7DRL, however

## How I do it

- Have failed four times before this
- Never actually take seven days; usually 1-3
- People with kids do not have weekends for projects; I took three days off this year to do this.
- *Reused last year's code* even though I didn't like some of it.

## How game code is usually structured

- Much like Flux, state is updated separately from rendering. Also, much like Flux, this is not always to do cleanly.
- My game was turn-based, so I didn't want to do the thing where it updated and rendered on a tick. I wanted it to be lazy and only happen when the player actually did something.
- But animations!
  - If you are rendering the current state, and all of your rendering happens after all of the updates are made for the current turn, then something like this can happen:
    - An attack kills an NPC; that is reflected in the state.
    - You render that state; because the NPC has been removed from the state, than NPC is not rendered. In effect, it disappears.
    - You want an animation of the PC attacking the NPC. The player is still there, but the NPC is gone. You end up animating the PC attacking nothing.
  - So...delayed state updates?
    - First, update most of the state.
    - Then, start rendering, including animations.
    - When the animations complete, do "extra updates".
    - Render again, without animations.
    - Gah, now everything is async like everything else in JS

## Doing 2D math

Things like figuring out where to zoom are hard for me. Example: focusing on character.
