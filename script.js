console.log("Let's write javascript");

let songs = [];
let currentIndex = 0;
let currentAudio = new Audio();

function parseSongName(song) {
    let name = song.replaceAll("%20", " ").replace(".mp3", "");
    let parts = name.split("-");
    return {
        artist: parts[0],
        title: parts.slice(1).join(" ").trim()
    };
}

function formatTime(seconds){
    if(isNaN(seconds)) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
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
            let {artist, title} = parseSongName(song);

            return `
                <li title="${artist} - ${title}" data-index="${index}">
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
    let { artist, title } = parseSongName(songs[index]);
    document.querySelector('.songinfo').innerHTML = `${title} <span style="color:#a0a0a0;">• ${artist}</span>`;
    document.querySelector('.songtime').innerHTML = "00:00 / 00:00"

    currentAudio.addEventListener("ended", playNext);

    currentAudio.addEventListener("timeupdate", () => {
        let current = formatTime(currentAudio.currentTime);
        let total = formatTime(currentAudio.duration);
        document.querySelector('.songtime').innerHTML = `${current} / ${total}`;

        document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
    })

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
        let isThisRowPlaying = (index === currentIndex && isPlaying);

        icon.src = (index === currentIndex && isPlaying) ? "pause.svg" : "play.svg";
        row.classList.toggle("playing", index === currentIndex);
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

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let seekbar = e.currentTarget;
        let rect = seekbar.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        let percentage = clickX / rect.width;

        currentAudio.currentTime = percentage * currentAudio.duration;
    });
}

async function main() {
    songs = await getSongs();
    console.log(songs);

    renderSongList();
    setupEventListeners();
}

main();