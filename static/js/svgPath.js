// Spirograph (hypotrochoid) animation
function startSVGPathAnimation(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;
    const scale = Math.min(W, H) / 520;

    // Spirograph parameter sets
    const presets = [
        { R: 140, r: 61, d: 130 },
        { R: 150, r: 41, d: 90  },
        { R: 130, r: 83, d: 120 },
        { R: 160, r: 51, d: 145 },
        { R: 120, r: 37, d: 100 },
    ];
    let presetIdx = 0;
    let t = 0;
    let hue = 0;
    let drawn = 0;
    let prevPt = null;
    const STEPS_PER_FRAME = 10;
    const MAX_DRAW = 4800;

    function getPoint(t, p) {
        const x = CX + ((p.R - p.r) * Math.cos(t) + p.d * Math.cos((p.R - p.r) / p.r * t)) * scale;
        const y = CY + ((p.R - p.r) * Math.sin(t) - p.d * Math.sin((p.R - p.r) / p.r * t)) * scale;
        return { x, y };
    }

    function nextPreset() {
        presetIdx = (presetIdx + 1) % presets.length;
        t = 0;
        drawn = 0;
        prevPt = null;
        hue = Math.random() * 360;
        // Gentle fade of old drawing
        ctx.fillStyle = 'rgba(3,3,10,0.45)';
        ctx.fillRect(0, 0, W, H);
    }

    // Initial background
    ctx.fillStyle = '#030310';
    ctx.fillRect(0, 0, W, H);

    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);

        const p = presets[presetIdx];
        for (let s = 0; s < STEPS_PER_FRAME; s++) {
            const pt = getPoint(t, p);
            if (prevPt) {
                ctx.beginPath();
                ctx.moveTo(prevPt.x, prevPt.y);
                ctx.lineTo(pt.x, pt.y);
                ctx.strokeStyle = `hsla(${hue},100%,65%,0.85)`;
                ctx.lineWidth = 1.5;
                ctx.shadowColor = `hsl(${hue},100%,60%)`;
                ctx.shadowBlur = 5;
                ctx.stroke();
            }
            prevPt = pt;
            t += 0.028;
            hue = (hue + 0.35) % 360;
            drawn++;
            if (drawn >= MAX_DRAW) { nextPreset(); break; }
        }
        ctx.shadowBlur = 0;
    }
    animate();
}
window.startSVGPathAnimation = startSVGPathAnimation;
