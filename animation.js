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
        .distinctUntilChanged()
        .do(console.log)
        .map(textForPlayerMsElapsed)
        .distinctUntilChanged()
        .subscribe(text => {
            content.innerHTML = text;
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

const lyrics = [
    {startMs: 20987, endMs: 22646, text: 'Nie jestem demonem a...'},
    {startMs: 22646, endMs: 24474, text: 'potrafię opętać słowem.'},
    {startMs: 24474, endMs: 27322, text: 'Otworzę głowy nim na zdrowie powie śmierć wam.'},
    {startMs: 27322, endMs: 30537, text: 'Nie pochodzę z piekła i choć mowę mam z piekła rodem,'},
    {startMs: 30537, endMs: 33808, text: 'ono nie jest wrogiem. To dla mnie konkurencja.'},
    {startMs: 33808, endMs: 36668, text: 'Zmienia się świat boy, ziemia to bagno i nie ma to tamto'},
    {startMs: 36668, endMs: 39852, text: 'Jak trzeba się nie bać to scena jest niema i nie ma co jebać się z prawdą'},
    {startMs: 39852, endMs: 41292, text: 'Schemat zjebał się dawno, marzenia zamnienia na banknot'},
    {startMs: 41292, endMs: 99999, text: 'Mówi że trzeba doceniać co się ma i nie ma znaczenia kto zajebał światło dla nich'}
];

function textForPlayerMsElapsed(ms) {
    const entry = lyrics.find(entry => ms <= entry.endMs && ms >= entry.startMs);
    return entry ? entry.text : '';
}