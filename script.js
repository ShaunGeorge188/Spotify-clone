console.log("Let's write javascript");


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3002/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let decoded = decodeURIComponent(element.href);
            let filename = decoded.split(/[\\/]/).pop();
            songs.push(filename);
        }

    }
    return songs;

}


async function main() {
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = songs
        .map(song => {
            let name = song.replaceAll("%20", " ").replace(".mp3", "");
            let parts = name.split("-");
            let artist = parts[0];
            let title = parts.slice(1).join(" ").trim();

            return `
            <li title="${name}">
                
                <div class="thumbWrapper">
                    <img class="songThumb" src="music.svg" alt="">
                    <svg class="playOverlay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
                        <path d="M8 5v14l11-7z"></path>
                    </svg>
                </div>
                <div class="songText">
                    <span class="songTitle">${title}</span>
                    <span class="songArtist">${artist}</span>
                </div>
            </li>
        `;
        })
        .join("");

    var audio = new Audio(songs[0]);
    //audio.play();

}

main();