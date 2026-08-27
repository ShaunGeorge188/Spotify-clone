console.log("Let's write javascript");

let songs = [];
let albums = [];
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

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

async function getSongs() {
    let res = await fetch("songs.json");
    return await res.json();
}

async function getAlbums() {
    let res = await fetch("albums.json");
    return await res.json();
}

function playAlbum(albumIndex) {
    let album = albums[albumIndex];
    if (!album || album.songs.length === 0) return;

    songs = album.songs;
    renderSongList();
    playSongAtIndex(0);
}

function renderAlbums() {
    let cardContainer = document.querySelector(".cardContainer");

    cardContainer.innerHTML = albums
        .map((album, index) => {
            return `
                <div class="card" data-album-index="${index}">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                            color="#ffffff" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round">
                            <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"></path>
                        </svg>
                    </div>
                    <img src="${album.cover}" alt="${album.name}">
                    <p>${album.name}</p>
                </div>
            `;
        })
        .join("");
}

function renderSongList() {
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    songUL.innerHTML = songs
        .map((song, index) => {
            let { artist, title } = parseSongName(song);

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

    document.getElementById("hamburgerBtn").addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("open");
    });

    document.getElementById("closeSidebarBtn").addEventListener("click", () => {
        document.getElementById("sidebar").classList.remove("open");
    });

    document.querySelector(".cardContainer").addEventListener("click", (e) => {
        let card = e.target.closest(".card");
        if (!card) return;
        let albumIndex = parseInt(card.dataset.albumIndex);
        playAlbum(albumIndex);
    });
}

async function main() {
    songs = await getSongs();
    albums = await getAlbums();
    console.log(songs, albums);

    renderSongList();
    renderAlbums();
    setupEventListeners();
}

main();