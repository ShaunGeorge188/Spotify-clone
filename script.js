console.log("Let's write javascript");


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
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
            return `<li title="${name}">${name}</li>`;
        })
        .join("");

    var audio = new Audio(songs[0]);
    //audio.play();

}

main();