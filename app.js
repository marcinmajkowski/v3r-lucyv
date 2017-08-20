function onPlayerReady(event) {
    const player = event.target;
    const animationElement = document.getElementById('animation');

    const animation = new Animation(animationElement, [authorAnimationObject, ...wordsAnimationObjects]);
    const renderer = new Renderer(animationElement, [sampleAnimation]);

    playerMsElapsed(player)
        .let(prevAndCurrent(0))
        .do(([prevMs, currentMs]) => animation.update(prevMs, currentMs))
        .subscribe();

    playerMsElapsed(player)
        .do(ms => renderer.render(ms))
        .subscribe();
}

(function() {
    const animationElement = document.getElementById('animation');
    const playerElement = document.getElementById('player');
    // TODO find way to read it dynamically
    const videoAspectRatio = 1760 / 990;
    updateAnimationDimensions();
    window.addEventListener('resize', updateAnimationDimensions, true);

    function updateAnimationDimensions() {
        const playerWidth = playerElement.offsetWidth;
        const playerHeight = playerElement.offsetHeight;
        const playerAspectRatio = playerWidth / playerHeight;

        let videoWidth, videoHeight;
        if (playerAspectRatio < videoAspectRatio) {
            videoWidth = playerWidth;
            videoHeight = playerWidth / videoAspectRatio;
        } else {
            videoWidth = playerHeight * videoAspectRatio;
            videoHeight = playerHeight;
        }

        animationElement.style.width = videoWidth + 'px';
        animationElement.style.height = videoHeight + 'px';
        animationElement.style.fontSize = videoHeight * 0.1 + 'px';
    }
})();

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

const prevAndCurrent = (initialValue) => (source$) =>
    source$.startWith(initialValue)
        .bufferCount(2, 1);