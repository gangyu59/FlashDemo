function startDataViz(canvas, ctx, clearCanvasAndStop) {
    const data = [30, 86, 168, 281, 303, 365];
    const barWidth = canvas.width / data.length;
    const maxHeight = Math.max(...data);

    function drawBars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        data.forEach((value, index) => {
            ctx.beginPath();
            ctx.rect(index * barWidth, canvas.height - (value / maxHeight) * canvas.height, barWidth - 10, (value / maxHeight) * canvas.height);
            ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
            ctx.fill();
        });
    }

    function animate() {
        drawBars();
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startDataViz = startDataViz;