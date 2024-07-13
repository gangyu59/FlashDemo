document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    let currentAnimation = null;
    let animationFrameId = null;

    function clearCurrentAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        if (currentAnimation) {
            clearInterval(currentAnimation);
            currentAnimation = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    document.getElementById('showParticleAnimation').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startParticleAnimation === 'function') {
            startParticleAnimation(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('show3DCube').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof start3DCube === 'function') {
            start3DCube(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showSVGPath').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startSVGPathAnimation === 'function') {
            startSVGPathAnimation(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showFireworks').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startFireworks === 'function') {
            startFireworks(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showDataViz').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startDataViz === 'function') {
            startDataViz(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showFluidSim').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startFluidSim === 'function') {
            startFluidSim(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showNeonText').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startNeonText === 'function') {
            startNeonText(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showCarousel').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startCarousel === 'function') {
            startCarousel(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showParallax').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startParallax === 'function') {
            startParallax(canvas, ctx, clearCurrentAnimation);
        }
    });

    document.getElementById('showGlobe').addEventListener('click', function () {
        clearCurrentAnimation();
        if (typeof startGlobe === 'function') {
            startGlobe(canvas, ctx, clearCurrentAnimation);
        }
    });
});