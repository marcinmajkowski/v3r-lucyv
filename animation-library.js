// Each AnimationObject is expected to have init(), update(ms) and destroy() functions.
// TODO Animation.destroy
function Animation(container, animationObjects) {
    this.container = container;
    this.animationObjects = animationObjects;
}

Animation.prototype.update = function(prevMs, currentMs) {
    this.animationObjects.forEach(animationObject => {
        const isPrevMsInRange = prevMs >= animationObject.startMs && prevMs <= animationObject.endMs;
        const isCurrentMsInRange = currentMs >= animationObject.startMs && currentMs <= animationObject.endMs;

        if (!isPrevMsInRange && isCurrentMsInRange && animationObject.create) {
            animationObject.element = animationObject.create();
            this.container.appendChild(animationObject.element);
        }

        if (isCurrentMsInRange && animationObject.update) {
            animationObject.update(currentMs);
        }

        if (isPrevMsInRange && !isCurrentMsInRange) {
            this.container.removeChild(animationObject.element);
            animationObject.element = null;
        }
    });
};

function SimpleTextAnimationObject(startMs, endMs, text, cssClass, fadeIn, fadeOut) {
    this.startMs = startMs;
    this.endMs = endMs;
    this.text = text;
    this.cssClass = cssClass;
    this.fadeIn = fadeIn;
    this.fadeOut = fadeOut;
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

SimpleTextAnimationObject.prototype.create = function() {
    const element = document.createElement('div');
    element.classList.add(this.cssClass);
    element.innerHTML = this.text;
    return element;
};

// TODO refactor
SimpleTextAnimationObject.prototype.update = function(ms) {
    this.resetState();
    const progress = (ms - this.startMs) / (this.endMs - this.startMs);

    if (this.fadeIn && ms - this.startMs < this.fadeIn.durationMs) {
        const fadeInProgress = (ms - this.startMs) / this.fadeIn.durationMs;
        this.state.opacity = this.state.opacity * this.fadeIn.easeFn(fadeInProgress);
    }

    if (this.fadeOut && this.endMs - ms < this.fadeOut.durationMs) {
        const fadeOutProgress = (ms - (this.endMs - this.fadeOut.durationMs)) / this.fadeOut.durationMs;
        // TODO ensure correctness (especially this '1 - something' thing)
        this.state.opacity = this.state.opacity * (1 - this.fadeOut.easeFn(fadeOutProgress));
    }

    this.element.style.opacity = this.state.opacity;
};

/**
 * New API
 */
function Renderer(containerElement, animationObjects) {
    this.containerElement = containerElement;
    this.animationObjects = animationObjects;
    this.prevMs = 0;
}

// TODO accept collection
Renderer.prototype.render = function(currentMs) {
    this.animationObjects.forEach(animationObject => this._renderAnimationObject(animationObject, null, currentMs));
    this.prevMs = currentMs;
};

Renderer.prototype._renderAnimationObject = function(animationObject, parent, currentMs) {
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
        const progress = (currentMs - startMs) / (endMs - startMs);
        for (const property in animationObject.style) {
            if (animationObject.style.hasOwnProperty(property)) {
                const hasFactory = typeof animationObject.style[property] === 'function';
                animationObject._element.style[property] = hasFactory ? animationObject.style[property](progress) : animationObject.style[property];
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
