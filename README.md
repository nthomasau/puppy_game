# Puppy Adventure

Puppy Adventure is a small browser game built with vanilla HTML, CSS and JavaScript. The game lets you choose a character and puppy, pick some supplies, and then care for your new pet Tamagotchi‑style.

## Features
- Choose to play as a boy or girl and select a matching character and four puppy breeds
- Choose bowl and lead colours from a wider palette
- Name your puppy (its name must start with the same first letter as yours)
- Welcome the puppy home and play with it in the backyard
- Take care of hunger, fun, cleanliness and energy by performing actions such as feeding or walking

## Running the Game
The game manipulates images through JavaScript so most browsers require running it from a local server.

1. From the repository root start a simple server:
   ```bash
   python3 -m http.server
   ```
2. Open a browser at `http://localhost:8000` and click `index.html`.

Once loaded you can progress through the scenes, interact with your puppy and reset when you want to start again.

## Folder Structure
- `index.html` – main page for the game
- `style.css` – styles for the interface
- `game.js` – game logic
- `assets/` – all images used by the game

Enjoy your time with your virtual puppy!
