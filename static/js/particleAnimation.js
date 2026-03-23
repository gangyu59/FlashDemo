// Galaxy / Constellation: particles orbit a center, connections drawn between nearby stars
function startParticleAnimation(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;
    const LINK_DIST = Math.min(W, H) * 0.12;

    let mouseX = CX, mouseY = CY, mouseOn = false;

    function onMove(e) {
        const r = canvas.getBoundingClientRect();
        const src = e.touches ? e.touches[0] : e;
        mouseX = (src.clientX - r.left) * (W / r.width);
        mouseY = (src.clientY - r.top)  * (H / r.height);
        mouseOn = true;
    }
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onMove, { passive: true });

    // Stars in multiple orbits
    const N = 160;
    const stars = Array.from({ length: N }, (_, i) => {
        const orbit = Math.pow(Math.random(), 0.5) * Math.min(W, H) * 0.44;
        return {
            angle: Math.random() * Math.PI * 2,
            orbit,
            speed: (0.0008 + Math.random() * 0.0015) * (Math.random() < 0.5 ? 1 : -1),
            // Slight elliptical wobble
            wobble: Math.random() * 0.18,
            wobblePhase: Math.random() * Math.PI * 2,
            size: 0.6 + Math.random() * 2,
            hue: 200 + Math.random() * 160,
            bright: 55 + Math.random() * 45,
            x: 0, y: 0,
        };
    });

    let t = 0;

    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);
        t += 0.018;

        // Trail fade
        ctx.fillStyle = 'rgba(2,2,14,0.18)';
        ctx.fillRect(0, 0, W, H);

        // Update positions
        stars.forEach(s => {
            s.angle += s.speed;
            const wobbleR = s.orbit * (1 + s.wobble * Math.sin(t + s.wobblePhase));
            s.x = CX + Math.cos(s.angle) * wobbleR;
            s.y = CY + Math.sin(s.angle) * wobbleR;

            // Mouse repulsion / attraction
            if (mouseOn) {
                const dx = s.x - mouseX, dy = s.y - mouseY;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < 130 && d > 0) {
                    const force = (130 - d) / 130 * 0.4;
                    s.x += (dx / d) * force * 8;
                    s.y += (dy / d) * force * 8;
                }
            }
        });

        // Connection lines
        ctx.lineWidth = 0.6;
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < LINK_DIST) {
                    const alpha = (1 - d / LINK_DIST) * 0.45;
                    ctx.strokeStyle = `rgba(160,180,255,${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw stars
        stars.forEach(s => {
            const pulse = 0.8 + Math.sin(t * 2 + s.wobblePhase) * 0.2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${s.hue},75%,${s.bright}%)`;
            ctx.shadowColor = `hsl(${s.hue},100%,70%)`;
            ctx.shadowBlur = s.size * 4;
            ctx.fill();
        });

        // Central galactic core glow
        const core = ctx.createRadialGradient(CX, CY, 0, CX, CY, 70);
        core.addColorStop(0, 'rgba(180,140,255,0.18)');
        core.addColorStop(1, 'transparent');
        ctx.fillStyle = core;
        ctx.fillRect(CX-70, CY-70, 140, 140);

        ctx.shadowBlur = 0;
    }
    animate();
}
window.startParticleAnimation = startParticleAnimation;
