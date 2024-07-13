function startNeonText(canvas, ctx, clearCanvasAndStop) {
    const text = "Neon Effect";
    const fontSize = 140; // Double the size

    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    function drawNeon() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowColor = "white";
        ctx.shadowBlur = 40;
        ctx.fillStyle = "cyan";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        ctx.shadowColor = "blue";
        ctx.shadowBlur = 80;
        ctx.fillStyle = "blue";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    function animate() {
        drawNeon();
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startNeonText = startNeonText;