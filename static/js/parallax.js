function startParallax(canvas, ctx, clearCanvasAndStop) {
    const icons = ['⚽️', '🏀', '🏈', '⚾️', '🎾', '🎱', '🥎', '🏐', '🏉', '🥏', '🎳', '🏓', '🏸', '🥊', '🥋', '⛳️', '🥅', '⛸', '🥌', '🎿', '🏂', '🏋️‍♂️', '🏋️‍♀️', '🤼‍♂️', '🤼‍♀️', '🤸‍♂️', '🤸‍♀️', '⛹️‍♂️', '⛹️‍♀️', '🤺', '🤿', '🏊‍♂️', '🏊‍♀️', '🤽‍♂️', '🤽‍♀️', '🚴‍♂️', '🚴‍♀️', '🚵‍♂️', '🚵‍♀️', '🏇', '🧘‍♂️', '🧘‍♀️', '🏄‍♂️', '🏄‍♀️', '🏆', '🥇', '🥈', '🥉'];
    const layers = [
        { icons: icons.slice(0, 10), speed: 0.2 },
        { icons: icons.slice(10, 20), speed: 0.4 },
        { icons: icons.slice(20, 30), speed: 0.6 },
        { icons: icons.slice(30, 40), speed: 0.8 }
    ];

    let offset = 0;

    function drawLayer(layer) {
        layer.icons.forEach((icon, index) => {
            ctx.font = '50px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const x = (index * 100 + offset * layer.speed) % canvas.width;
            const y = canvas.height / 2 + (index % 2 === 0 ? -40 : 40); // Increase offset
            ctx.fillText(icon, x, y);
        });
    }

    function drawLayers() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        layers.forEach(layer => drawLayer(layer));
    }

    function animate() {
        drawLayers();
        offset += 1;
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startParallax = startParallax;