// Each AnimationObject is expected to have init(), update(ms) and destroy() functions.
// TODO Animation.destroy
function Animation(animationObjects) {
    this.animationObjects = animationObjects;
}

Animation.prototype.update = function(prevMs, currentMs) {
    this.animationObjects.forEach(animationObject => {
        const isPrevMsInRange = prevMs >= animationObject.startMs && prevMs <= animationObject.endMs;
        const isCurrentMsInRange = currentMs >= animationObject.startMs && currentMs <= animationObject.endMs;

        if (!isPrevMsInRange && isCurrentMsInRange && animationObject.init) {
            animationObject.init();
        }

        if (isCurrentMsInRange) {
            animationObject.update(currentMs);
        }

        if (isPrevMsInRange && !isCurrentMsInRange && animationObject.destroy) {
            animationObject.destroy();
        }
    });
};

function SimpleTextAnimationObject(startMs, endMs, text, container) {
    this.startMs = startMs;
    this.endMs = endMs;
    this.text = text;
    this.container = container;
    this.element = null;
    this.state = null;
}

SimpleTextAnimationObject.prototype.resetState = function() {
   this.state = {
       position: {
           x: 0.5,
           y: 0.5
       },
       opacity: 1.0
   };
};

SimpleTextAnimationObject.prototype.init = function() {
    this.element = document.createElement('div');
    this.element.classList.add('content');
    this.element.classList.add('word');
    this.element.innerHTML = this.text;
    this.container.appendChild(this.element);
};

SimpleTextAnimationObject.prototype.destroy = function() {
    this.container.removeChild(this.element);
};

SimpleTextAnimationObject.prototype.update = function(ms) {
    this.resetState();
    const fadeInDurationMs = 200;
    this.state.opacity = (ms - this.startMs) / fadeInDurationMs;
    this.element.style.opacity = this.state.opacity;
};