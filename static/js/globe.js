function startGlobe(canvas, ctx, clearCanvasAndStop) {
    const globeRadius = canvas.width / 3; // Increase size
    const globeCenterX = canvas.width / 2;
    const globeCenterY = canvas.height / 2;
    let angle = 0;

    function drawGlobe() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(globeCenterX, globeCenterY, globeRadius, 0, Math.PI * 2);
        ctx.lineWidth = 4; // Thicker line
        ctx.stroke();

        const x = globeCenterX + globeRadius * Math.cos(angle);
        const y = globeCenterY + globeRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2); // Increase point size
        ctx.fill();

        angle += 0.02;
    }

    function animate() {
        drawGlobe();
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startGlobe = startGlobe;