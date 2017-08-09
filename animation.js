var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    playerMsElapsed(player)
        .subscribe(t => {
            console.log(msToTime(t));
            content.innerHTML = msToTime(t);
        });
}

function onPlayerStateChange(event) {
    console.log(event.data);
    console.log(event.target.getCurrentTime());
}

const msElapsed = (scheduler = Rx.Scheduler.animationFrame) =>
    Rx.Observable.defer(() => {
        const start = scheduler.now();
        
        return Rx.Observable.interval(0, scheduler)
            .map(() => scheduler.now() - start);
    });

const playerMsElapsed = (player, scheduler = Rx.Scheduler.animationFrame) =>
    msElapsed(scheduler)
        .map(() => player.getCurrentTime() * 1000);

const content = document.querySelector('#content');

function msToTime(s) {
    s = Math.floor(s);
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s;

    return mins + ':' + zeroPad(secs, 2) + '.' + zeroPad(ms, 3);
}

function zeroPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}