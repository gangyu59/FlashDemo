function startCarousel(canvas, ctx, clearCanvasAndStop) {
    const icons = ['⚽️', '🏀', '🏈', '⚾️', '🎾', '🎱', '🥎', '🏐', '🏉', '🥏', '🎳', '🏓', '🏸', '🥊', '🥋', '⛳️', '🥅', '⛸', '🥌', '🎿', '🏂', '🏋️‍♂️', '🏋️‍♀️', '🤼‍♂️', '🤼‍♀️', '🤸‍♂️', '🤸‍♀️', '⛹️‍♂️', '⛹️‍♀️', '🤺', '🤿', '🏊‍♂️', '🏊‍♀️', '🤽‍♂️', '🤽‍♀️', '🚴‍♂️', '🚴‍♀️', '🚵‍♂️', '🚵‍♀️', '🏇', '🧘‍♂️', '🧘‍♀️', '🏄‍♂️', '🏄‍♀️', '🏆', '🥇', '🥈', '🥉'];
    let currentIconIndex = 0;

    function drawIcon() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '200px serif'; // Double the size
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icons[currentIconIndex], canvas.width / 2, canvas.height / 2);
    }

    function nextIcon() {
        currentIconIndex = (currentIconIndex + 1) % icons.length;
        drawIcon();
    }

    function animate() {
        drawIcon();
        setTimeout(nextIcon, 10200); // Slow down by three times
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startCarousel = startCarousel;