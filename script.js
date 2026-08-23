console.log("Let's write javascript");

let songs = [];
let currentIndex = 0;
let currentAudio = new Audio();

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3002/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songList = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let decoded = decodeURIComponent(element.href);
            let filename = decoded.split(/[\\/]/).pop();
            songList.push(filename);
        }
    }
    return songList;
}

function renderSongList() {
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    songUL.innerHTML = songs
        .map((song, index) => {
            let name = song.replaceAll("%20", " ").replace(".mp3", "");
            let parts = name.split("-");
            let artist = parts[0];
            let title = parts.slice(1).join(" ").trim();

            return `
                <li title="${name}" data-index="${index}">
                    <div class="thumbWrapper">
                        <img class="songThumb" src="music.svg" alt="">
                        <img class="playOverlay" src="play.svg" alt="play">
                    </div>
                    <div class="songText">
                        <span class="songTitle">${title}</span>
                        <span class="songArtist">${artist}</span>
                    </div>
                </li>
            `;
        })
        .join("");
}

function playSongAtIndex(index) {
    if (index < 0 || index >= songs.length) return;

    currentIndex = index;
    currentAudio.pause();
    currentAudio = new Audio(`songs/${songs[index]}`);
    currentAudio.play();

    currentAudio.addEventListener("ended", playNext);

    refreshIcons();
}

function togglePlayPause() {
    if (!currentAudio.src) {
        if (songs.length > 0) playSongAtIndex(0);
        return;
    }
    if (currentAudio.paused) {
        currentAudio.play();
    } else {
        currentAudio.pause();
    }
    refreshIcons();
}

function playNext() {
    playSongAtIndex((currentIndex + 1) % songs.length);
}

function playPrevious() {
    playSongAtIndex((currentIndex - 1 + songs.length) % songs.length);
}

function refreshIcons() {
    let isPlaying = !currentAudio.paused;

    document.getElementById("playBtn").src = isPlaying ? "pause.svg" : "play.svg";

    document.querySelectorAll(".songList ul li").forEach(row => {
        let index = parseInt(row.dataset.index);
        let icon = row.querySelector(".playOverlay");
        icon.src = (index === currentIndex && isPlaying) ? "pause.svg" : "play.svg";
    });
}

function setupEventListeners() {
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    songUL.addEventListener("click", (e) => {
        let li = e.target.closest("li");
        if (!li) return;
        let index = parseInt(li.dataset.index);

        if (index === currentIndex) {
            togglePlayPause();
        } else {
            playSongAtIndex(index);
        }
    });

    document.getElementById("playBtn").addEventListener("click", togglePlayPause);
    document.getElementById("nextBtn").addEventListener("click", playNext);
    document.getElementById("prevBtn").addEventListener("click", playPrevious);
}

async function main() {
    songs = await getSongs();
    console.log(songs);

    renderSongList();
    setupEventListeners();
}

main();