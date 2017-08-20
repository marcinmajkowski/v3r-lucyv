// TODO sync
const lyricsArray = [
    {startMs: 20987, endMs: 22646, text: 'Nie jestem demonem ale'},
    {startMs: 22646, endMs: 24474, text: 'potrafię opętać słowem.'},
    {startMs: 24474, endMs: 27322, text: 'Otworzę głowy nim na zdrowie powie śmierć wam.'},
    {startMs: 27322, endMs: 30537, text: 'Nie pochodzę z piekła i choć mowę mam z piekła rodem,'},
    {startMs: 30537, endMs: 33808, text: 'ono nie jest wrogiem. To dla mnie konkurencja.'},
    {startMs: 33808, endMs: 36668, text: 'Zmienia się świat boy, ziemia to bagno i nie ma to tamto'},
    {startMs: 36668, endMs: 39852, text: 'Jak trzeba się nie bać to scena jest niema i nie ma co jebać się z prawdą'},
    {startMs: 39852, endMs: 41292, text: 'Schemat zjebał się dawno, marzenia zamienia na banknot'},
    {startMs: 41292, endMs: 99999, text: 'Mówi że trzeba doceniać co się ma i nie ma znaczenia kto zajebał światło dla nich'}
];

const wordsArray = [
    { startMs: 21000, endMs: 21100, text: 'nie'},
    { startMs: 21100, endMs: 21500, text: 'jestem'},
    { startMs: 21500, endMs: 22100, text: 'demonem'},
    { startMs: 22100, endMs: 22500, text: 'ale'},
    { startMs: 22500, endMs: 23100, text: 'potrafię'},
    { startMs: 23100, endMs: 23500, text: 'opętać'},
    { startMs: 23500, endMs: 24200, text: 'słowem'},
    { startMs: 24200, endMs: 24800, text: 'otworzę'},
    { startMs: 24800, endMs: 25100, text: 'głowy'},
    { startMs: 25100, endMs: 25300, text: 'nim'},
    { startMs: 25300, endMs: 25500, text: 'na'},
    { startMs: 25500, endMs: 26000, text: 'zdrowie'},
    { startMs: 26000, endMs: 26200, text: 'powie'},
    { startMs: 26200, endMs: 26700, text: 'śmierć'},
    { startMs: 26700, endMs: 27000, text: 'wam'},
];

// TODO sync
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

/**
 * This uses a new API I am working on
 */
const sampleAnimation = {
    timeSpan: [20000, 30000],
    element: () => document.createElement('div'),
    style: {
        opacity: progress => progress,
        backgroundColor: progress => `rgba(0, 0, ${Math.floor(progress * 255)}, 1)`,
        height: '3em',
    },
    children: [{
        element: () => document.createElement('p'),
        style: {
            backgroundColor: progress => `rgba(255, 255, 255, ${progress})`,
            height: '1em'
        }
    }]
};

const wordAnimations = wordsArray.map(word => ({
    timeSpan: [word.startMs, word.endMs],
    element: () => {
        const element = document.createElement('div');
        element.classList.add('big-word');
        element.innerHTML = word.text;
        return element;
    },
    style: {
        opacity: Ease.inQuad
    }
}));

const authorAnimation = {
    timeSpan: [8300, 8300 + 2200],
    element: () => {
        const element = document.createElement('div');
        element.classList.add('small-word');
        element.innerHTML = 'VISUALIZATION BY MVN13K';
        return element;
    },
    style: {
        // TODO 400ms linear in, 400ms linear out
        opacity: Ease.inQuad
    }
};