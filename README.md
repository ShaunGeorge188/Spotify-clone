# Spotify Clone

A frontend clone of Spotify's web player, built while following [Code With Harry's Sigma Web Development course](https://www.youtube.com/@CodeWithHarry). Started as a static UI recreation, now a working music player with real playback, dynamic song loading from a local server, and a functioning seek bar — built with vanilla HTML, CSS, and JavaScript (no frameworks).

## Status: In Progress

Core player functionality is working end-to-end. Currently building out dynamic album/playlist rendering.

## Features

- **Dynamic song library** — fetches and renders the song list live from a local Node/Express server (no hardcoded song data in the HTML)
- **Full playback controls** — play/pause, next/previous, with auto-advance to the next track when a song ends
- **Live seek bar** — draggable/clickable progress bar that updates in real time and lets you jump to any point in a track
- **Synced UI state** — playbar and sidebar song icons stay in sync no matter where playback is triggered from (row click vs. playbar buttons)
- **Live time display** — current time / total duration, formatted and updating as the song plays
- **Responsive layout** — collapsible sidebar with a hamburger menu and close button for smaller screens
- **Playlist cards** with hover-reveal play buttons

## Tech stack

- HTML5
- CSS3 (Flexbox, media queries, CSS transitions)
- JavaScript (vanilla — DOM manipulation, `fetch`, `async/await`, the `Audio` API, event delegation)
- Node.js / Express (local server for serving song files and directory listing)

## Getting started

1. Clone the repo:
```bash
   git clone https://github.com/ShaunGeorge188/spotify-clone.git
```
2. Install server dependencies and start the local server (serves the `songs/` directory):
```bash
   npm install
   node server.js
```
3. Open `http://127.0.0.1:3000` (or whichever port your server logs) in your browser.

## Project structure
```
   spotify-clone/
├── index.html
├── style.css
├── utility.css
├── script.js
├── songs/ # mp3 files served by the local server
├── album_img/ # album/playlist artwork
└── README.md
```

## Notes

- This is a non-commercial, educational clone built for practicing frontend development. Not affiliated with or endorsed by Spotify.
- UI assets (icons, layout) are recreated from scratch or adapted for learning purposes.
- Song audio is sourced from royalty-free sound libraries for local development/testing only.

## Roadmap

- [x] Player controls (play/pause, seek bar)
- [x] Dynamic playlist/track listing from server
- [x] Responsive layout for smaller screens
- [x] Audio playback integration
- [ ] Dynamic album/playlist rendering (in progress)
- [ ] Search functionality
- [ ] Volume control

## Acknowledgements

- [Code With Harry](https://www.youtube.com/@CodeWithHarry) — Sigma Web Development course
