function Animation(containerElement, animationObjects) {
    this.containerElement = containerElement;
    this.animationObjects = animationObjects;
    this.prevMs = 0;
}

Animation.prototype.update = function(currentMs) {
    this.animationObjects.forEach(animationObject => this._renderAnimationObject(animationObject, null, currentMs));
    this.prevMs = currentMs;
};

Animation.prototype._renderAnimationObject = function(animationObject, parent, currentMs) {
    animationObject._parent = parent;
    animationObject._timeSpan = animationObject.timeSpan ? animationObject.timeSpan : parent.timeSpan;
    animationObject._children = animationObject.children ? animationObject.children : [];

    const startMs = animationObject._timeSpan[0];
    const endMs = animationObject._timeSpan[1];
    const prevMs = this.prevMs;

    const isPrevMsInRange = prevMs >= startMs && prevMs <= endMs;
    const isCurrentMsInRange = currentMs >= startMs && currentMs <= endMs;

    const containerElement = parent ? parent._element : this.containerElement;

    if (!isPrevMsInRange && isCurrentMsInRange) {
        const hasFactory = typeof animationObject.element === 'function';
        animationObject._element = hasFactory ? animationObject.element() : animationObject.element;
        containerElement.appendChild(animationObject._element);
    }

    if (isCurrentMsInRange) {
        const inAnimationMs = currentMs - startMs;
        const animationDurationMs = endMs - startMs;
        const progress = inAnimationMs / animationDurationMs;
        for (const property in animationObject.style) {
            if (animationObject.style.hasOwnProperty(property)) {
                const hasFactory = typeof animationObject.style[property] === 'function';
                animationObject._element.style[property] = hasFactory ? animationObject.style[property](progress, inAnimationMs) : animationObject.style[property];
            }
        }
    }

    if (isPrevMsInRange && !isCurrentMsInRange) {
        containerElement.removeChild(animationObject._element);
    }

    animationObject._children.forEach(childAnimationObject => {
        this._renderAnimationObject(childAnimationObject, animationObject, currentMs)
    });
};
