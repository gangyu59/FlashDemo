function startParticleAnimation(canvas, ctx, clearCanvasAndStop) {
    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 10 + 2,
            color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
        });
    }

    function drawParticles() {
        ctx.fillStyle = '#2b2b2b'; // Dark gray background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
            if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
        });
    }

    function animate() {
        drawParticles();
        updateParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startParticleAnimation = startParticleAnimation;