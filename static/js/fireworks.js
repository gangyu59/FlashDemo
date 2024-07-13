function startFireworks(canvas, ctx, clearCanvasAndStop) {
    const particles = [];
    const particleCount = 200;

    function createFirework() {
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height,
                vx: (Math.random() - 0.5) * 10,
                vy: Math.random() * -15 - 5,
                size: Math.random() * 6 + 4, // Increase size
                color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                alpha: 1
            });
        }
    }

    function drawParticles() {
        ctx.fillStyle = '#000'; // Black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.alpha -= 0.02;
            p.color = p.color.replace(/[\d\.]+\)$/, `${p.alpha})`);

            if (p.alpha <= 0) {
                particles.splice(index, 1);
            }
        });

        if (particles.length < particleCount / 2) {
            createFirework();
        }
    }

    function animate() {
        drawParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    createFirework();
    animate();
}

window.startFireworks = startFireworks;