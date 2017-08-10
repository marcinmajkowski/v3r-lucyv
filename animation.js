var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    const player = event.target;
    lyrics(player, lyricsArray)
        .subscribe(text => {
            content.innerHTML = text;
        });

    drums(player, drumsMsArray, 100)
        .subscribe(isDrum => {
            if (isDrum) {
                content.classList.add('highlight');
            } else {
                content.classList.remove('highlight');
            }
        })
}

const msElapsed = (scheduler = Rx.Scheduler.animationFrame) =>
    Rx.Observable.defer(() => {
        const start = scheduler.now();
        
        return Rx.Observable.interval(0, scheduler)
            .map(() => scheduler.now() - start);
    });

const playerMsElapsed = (player, scheduler = Rx.Scheduler.animationFrame) =>
    msElapsed(scheduler)
        .map(() => player.getCurrentTime() * 1000)
        .distinctUntilChanged();

const content = document.querySelector('.content');

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

const lyricsArray = [
    {startMs: 20987, endMs: 22646, text: 'Nie jestem demonem a...'},
    {startMs: 22646, endMs: 24474, text: 'potrafię opętać słowem.'},
    {startMs: 24474, endMs: 27322, text: 'Otworzę głowy nim na zdrowie powie śmierć wam.'},
    {startMs: 27322, endMs: 30537, text: 'Nie pochodzę z piekła i choć mowę mam z piekła rodem,'},
    {startMs: 30537, endMs: 33808, text: 'ono nie jest wrogiem. To dla mnie konkurencja.'},
    {startMs: 33808, endMs: 36668, text: 'Zmienia się świat boy, ziemia to bagno i nie ma to tamto'},
    {startMs: 36668, endMs: 39852, text: 'Jak trzeba się nie bać to scena jest niema i nie ma co jebać się z prawdą'},
    {startMs: 39852, endMs: 41292, text: 'Schemat zjebał się dawno, marzenia zamienia na banknot'},
    {startMs: 41292, endMs: 99999, text: 'Mówi że trzeba doceniać co się ma i nie ma znaczenia kto zajebał światło dla nich'}
];

const lyrics = (player, lyricsArray, scheduler = Rx.Scheduler.animationFrame) =>
    playerMsElapsed(player, scheduler)
        .map(ms => {
            const entry = lyricsArray.find(entry => ms <= entry.endMs && ms >= entry.startMs);
            return entry ? entry.text : '';
        })
        .distinctUntilChanged();

const drumsMsArray = [
    21586,
    21707,
    22042,
    22641,
    22904,
    23216,
    24067,
    24636,
    24886,
    25227,
    25846,
    25938,
    26341,
    27115,
    27692,
    27938,
    28321,
    28898,
    29130,
    29487,
    30283,
    30819,
    31030,
    31446,
];

const drums = (player, drumsMsArray, drumDuration, scheduler = Rx.Scheduler.animationFrame) =>
    playerMsElapsed(player, scheduler)
        .map(ms => drumsMsArray.some(drumMs => ms < drumMs + drumDuration && ms > drumMs))
        .distinctUntilChanged();


// dev stuff
var currentMs = 21100;
document.onkeydown = function(e) {
    e = e || window.event;
    const key = e.which || e.keyCode;
    switch (key) {
        case 65:
            // a - back
            currentMs -= 100;
            console.log(currentMs);
            break;
        case 83:
            // s - start/stop
            player.seekTo(currentMs / 1000, true);
            break;
        case 68:
            // d - forward
            currentMs += 100;
            console.log(currentMs);
            break;
    }
};

function onPlayerStateChange(event) {
    //console.log(Math.floor(event.target.getCurrentTime() * 1000));
}