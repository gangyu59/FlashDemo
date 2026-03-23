function startFluidSim(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;

    // Value noise via integer hash → smooth 2D noise
    function hash(ix, iy) {
        let n = ix * 1619 + iy * 31337;
        n = (n ^ (n >> 8)) * 1664525 + 1013904223;
        return ((n & 0x7fffffff) / 0x7fffffff) * 2 - 1;
    }
    function smoothNoise(x, y) {
        const ix = Math.floor(x), iy = Math.floor(y);
        const fx = x - ix, fy = y - iy;
        const ux = fx * fx * (3 - 2 * fx);
        const uy = fy * fy * (3 - 2 * fy);
        const a = hash(ix,iy), b = hash(ix+1,iy);
        const c = hash(ix,iy+1), d = hash(ix+1,iy+1);
        return a + (b-a)*ux + (c-a)*uy + (a-b-c+d)*ux*uy;
    }
    function fbm(x, y) {
        return smoothNoise(x,y)*0.5 + smoothNoise(x*2,y*2)*0.3 + smoothNoise(x*4,y*4)*0.2;
    }

    function flowAngle(x, y, t) {
        const nx = fbm(x * 0.0028 + t * 0.4, y * 0.0028);
        const ny = fbm(x * 0.0028, y * 0.0028 + t * 0.4 + 5.3);
        return (nx + ny) * Math.PI * 2.5;
    }

    // Particles
    const N = 700;
    const particles = Array.from({ length: N }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        px: 0, py: 0,
        age: Math.random() * 120,
        maxAge: 100 + Math.random() * 120,
        hue: 180 + Math.random() * 200, // blue → purple → pink range
        speed: 1.8 + Math.random() * 2.2,
        init: false,
    }));

    let t = 0;

    ctx.fillStyle = '#030310';
    ctx.fillRect(0, 0, W, H);

    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);

        // Trail fade
        ctx.fillStyle = 'rgba(3,3,16,0.09)';
        ctx.fillRect(0, 0, W, H);

        t += 0.0045;

        particles.forEach(p => {
            p.age++;

            // Respawn
            if (p.age > p.maxAge || !p.init) {
                p.x = Math.random() * W;
                p.y = Math.random() * H;
                p.px = p.x; p.py = p.y;
                p.age = 0;
                p.maxAge = 100 + Math.random() * 120;
                p.hue = 180 + Math.random() * 200;
                p.speed = 1.8 + Math.random() * 2.2;
                p.init = true;
                return;
            }

            p.px = p.x; p.py = p.y;
            const angle = flowAngle(p.x, p.y, t);
            p.x += Math.cos(angle) * p.speed;
            p.y += Math.sin(angle) * p.speed;

            // Bounce or respawn at edges
            if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
                p.age = p.maxAge; return;
            }

            const life = p.age / p.maxAge;
            const alpha = Math.min(p.age / 15, 1) * (1 - life) * 0.72;
            if (alpha < 0.01) return;

            const hueShift = life * 80;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `hsla(${p.hue + hueShift},85%,62%,${alpha})`;
            ctx.lineWidth = 1.4;
            ctx.stroke();
        });
    }
    animate();
}
window.startFluidSim = startFluidSim;
