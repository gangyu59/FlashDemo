function startParallax(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;

    // Pre-generate deterministic stars
    const stars = Array.from({ length: 220 }, (_, i) => ({
        x: (i * 137.508 * W) % W,
        y: ((i * 97.3) % (H * 0.58)),
        r: 0.4 + (i % 5) * 0.28,
        twinkle: i * 0.37,
    }));

    // Mountain height using sum of sines (deterministic)
    function mtnH(x, seed, amp) {
        return amp * (
            Math.sin(x * 0.007 + seed) * 0.45 +
            Math.sin(x * 0.019 + seed * 1.8) * 0.32 +
            Math.sin(x * 0.043 + seed * 3.2) * 0.23
        );
    }

    function drawSky() {
        const g = ctx.createLinearGradient(0, 0, 0, H * 0.72);
        g.addColorStop(0,   '#010112');
        g.addColorStop(0.5, '#07073a');
        g.addColorStop(1,   '#15154a');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H * 0.72);
    }

    function drawStars(t) {
        stars.forEach(s => {
            const twinkleA = 0.5 + Math.sin(t * 1.5 + s.twinkle) * 0.5;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${twinkleA * 0.9})`;
            ctx.fill();
        });
    }

    function drawMoon(t) {
        const mx = W * 0.78;
        const my = H * 0.14;
        // Glow
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 75);
        mg.addColorStop(0, 'rgba(255,250,210,0.13)');
        mg.addColorStop(1, 'transparent');
        ctx.fillStyle = mg;
        ctx.fillRect(mx - 75, my - 75, 150, 150);
        // Disc
        ctx.beginPath();
        ctx.arc(mx, my, 32, 0, Math.PI * 2);
        ctx.fillStyle = '#fefce8';
        ctx.shadowColor = '#fefce8';
        ctx.shadowBlur = 22;
        ctx.fill();
        ctx.shadowBlur = 0;
        // Craters (static details)
        [[8,-8,5],[-10,6,3],[4,12,4]].forEach(([dx,dy,cr]) => {
            ctx.beginPath();
            ctx.arc(mx+dx, my+dy, cr, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(200,190,140,0.35)';
            ctx.fill();
        });
    }

    function drawMountainLayer(off, speed, baseY, amplitude, color) {
        const scrollX = (off * speed) % W;
        ctx.beginPath();
        ctx.moveTo(0, H);
        // Draw two widths to allow seamless looping
        for (let x = -scrollX; x <= W + 10; x += 4) {
            const y = baseY + mtnH(x + scrollX, speed * 10, amplitude);
            if (x <= -scrollX) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    function drawGround(baseY) {
        const g = ctx.createLinearGradient(0, baseY, 0, H);
        g.addColorStop(0, '#0c1a0c');
        g.addColorStop(1, '#060e06');
        ctx.fillStyle = g;
        ctx.fillRect(0, baseY, W, H - baseY);
    }

    function drawTrees(off, speed, baseY, tH, tW, spacing, color) {
        const scrollX = (off * speed) % spacing;
        const count = Math.ceil(W / spacing) + 3;
        ctx.fillStyle = color;
        for (let i = 0; i < count; i++) {
            const x = i * spacing - scrollX;
            const wobble = Math.sin(i * 2.3) * 0.15; // slight variation
            const h = tH * (0.85 + wobble);
            // Pine: two triangles
            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.lineTo(x - tW/2, baseY);
            ctx.lineTo(x, baseY - h * 0.55);
            ctx.lineTo(x + tW/2, baseY);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x, baseY - h * 0.38);
            ctx.lineTo(x - tW/2 * 0.75, baseY - h * 0.38);
            ctx.lineTo(x, baseY - h);
            ctx.lineTo(x + tW/2 * 0.75, baseY - h * 0.38);
            ctx.closePath();
            ctx.fill();
        }
    }

    const groundY = H * 0.69;
    let off = 0, t = 0;

    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);
        off += 1.4;
        t += 0.016;

        drawSky();
        drawStars(t);
        drawMoon(t);

        // Mountains far → near (dark → darker)
        drawMountainLayer(off, 0.08, H * 0.52, H * 0.19, '#0c1630');
        drawMountainLayer(off, 0.16, H * 0.58, H * 0.14, '#091228');
        drawMountainLayer(off, 0.28, H * 0.63, H * 0.10, '#06101f');

        drawGround(groundY);
        drawTrees(off, 0.45, groundY, H * 0.12, 28, 55, '#071407');
        drawTrees(off, 0.85, groundY, H * 0.17, 40, 72, '#030c03');

        ctx.shadowBlur = 0;
    }
    animate();
}
window.startParallax = startParallax;
