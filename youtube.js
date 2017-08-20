(function() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

function onYouTubeIframeAPIReady() {
    const player = new YT.Player('player', {
        events: {
            'onReady': onPlayerReady
        }
    });

    // temporary dev stuff
    let currentMs = 2150;
    document.addEventListener('keydown', onkeydownListener, false);
    function onkeydownListener(e) {
        e = e || window.event;
        const key = e.which || e.keyCode;
        switch (key) {
            case 65:
                // a - back
                currentMs -= 50;
                console.log(currentMs);
                break;
            case 83:
                // s - start/stop
                player.seekTo(currentMs / 1000, true);
                break;
            case 68:
                // d - forward
                currentMs += 50;
                console.log(currentMs);
                break;
        }
    }
}