function startNeonText(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;
    let t = 0;

    // Per-character flicker state
    const chars1 = 'FLASH'.split('');
    const chars2 = 'DEMO'.split('');
    const flicker = (seed, t) => {
        const v = Math.sin(t * 13.7 + seed * 5.3) * Math.sin(t * 7.1 + seed * 2.9);
        if (Math.sin(t * 100 + seed) > 0.97) return 0.08; // glitch off
        return 0.72 + Math.abs(v) * 0.28;
    };

    function neonLayer(text, cx, cy, color, glowColor, size, fk) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 ${size}px 'Arial Black', Impact, Arial`;

        // Wide outer glow
        ctx.globalAlpha = fk * 0.6;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 60;
        ctx.fillStyle = glowColor;
        ctx.fillText(text, cx, cy);

        // Medium glow
        ctx.globalAlpha = fk * 0.85;
        ctx.shadowBlur = 25;
        ctx.fillStyle = color;
        ctx.fillText(text, cx, cy);

        // Bright core
        ctx.globalAlpha = fk;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, cx, cy);

        // Colored stroke outline
        ctx.globalAlpha = fk * 0.9;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 20;
        ctx.strokeText(text, cx, cy);

        ctx.restore();
    }

    function drawDivider(y, fk) {
        const grad = ctx.createLinearGradient(W * 0.1, 0, W * 0.9, 0);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.3, `rgba(200,100,255,${fk * 0.9})`);
        grad.addColorStop(0.7, `rgba(200,100,255,${fk * 0.9})`);
        grad.addColorStop(1, 'transparent');
        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.shadowColor = '#cc44ff';
        ctx.shadowBlur = 16;
        ctx.globalAlpha = fk;
        ctx.beginPath();
        ctx.moveTo(W * 0.1, y);
        ctx.lineTo(W * 0.9, y);
        ctx.stroke();
        // Center diamond
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#cc44ff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(W / 2, y - 7);
        ctx.lineTo(W / 2 + 7, y);
        ctx.lineTo(W / 2, y + 7);
        ctx.lineTo(W / 2 - 7, y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);
        t += 0.04;

        // Background
        ctx.fillStyle = '#04040e';
        ctx.fillRect(0, 0, W, H);

        // Radial ambient glow
        const radGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.55);
        radGrad.addColorStop(0, 'rgba(80,0,130,0.12)');
        radGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, W, H);

        const fSize = Math.min(W * 0.21, 165);
        const fk1 = flicker(1, t);
        const fk2 = flicker(7, t);

        neonLayer('FLASH', W / 2, H * 0.35, '#ff2df5', '#cc00cc', fSize, fk1);
        drawDivider(H * 0.52, (fk1 + fk2) * 0.5);
        neonLayer('DEMO', W / 2, H * 0.68, '#00f5ff', '#00aacc', fSize * 0.95, fk2);

        // Scan line
        const scanY = ((t * 38) % (H + 80)) - 40;
        const scanGrad = ctx.createLinearGradient(0, scanY, 0, scanY + 40);
        scanGrad.addColorStop(0, 'rgba(255,255,255,0)');
        scanGrad.addColorStop(0.5, 'rgba(255,255,255,0.025)');
        scanGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY, W, 40);

        ctx.shadowBlur = 0;
    }
    animate();
}
window.startNeonText = startNeonText;
