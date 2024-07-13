function startSVGPathAnimation(canvas, ctx, clearCanvasAndStop) {
    const path1 = new Path2D('M 0 0 Q 100 -150, 200 0 T 400 0');
    const path2 = new Path2D('M 0 100 Q 100 -50, 200 100 T 400 100');
    let length1 = 0;
    let length2 = 0;
    const totalLength = 1000;

    function drawPath() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.setLineDash([length1, totalLength - length1]);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;
        ctx.save();
        ctx.translate(canvas.width / 2 - 200, canvas.height / 2); // Center the paths
        ctx.stroke(path1);
        ctx.restore();

        ctx.setLineDash([length2, totalLength - length2]);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.save();
        ctx.translate(canvas.width / 2 - 200, canvas.height / 2); // Center the paths
        ctx.stroke(path2);
        ctx.restore();

        length1 += 4; // Increase the speed of the first path
        length2 += 2; // Increase the speed of the second path
        if (length1 > totalLength) {
            length1 = 0;
        }
        if (length2 > totalLength) {
            length2 = 0;
        }
    }

    function animate() {
        drawPath();
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startSVGPathAnimation = startSVGPathAnimation;