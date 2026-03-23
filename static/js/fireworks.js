function startFireworks(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;
    const rockets = [], sparks = [];

    class Rocket {
        constructor() {
            this.x = W * 0.15 + Math.random() * W * 0.7;
            this.y = H;
            this.vx = (Math.random() - 0.5) * 2.5;
            this.vy = -(10 + Math.random() * 7);
            this.targetY = H * 0.1 + Math.random() * H * 0.45;
            this.hue = Math.random() * 360;
            this.trail = [];
            this.done = false;
        }
        update() {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 22) this.trail.shift();
            this.vy += 0.22;
            this.x += this.vx;
            this.y += this.vy;
            if (this.vy >= -0.5 || this.y <= this.targetY) this.done = true;
        }
        draw() {
            for (let i = 0; i < this.trail.length; i++) {
                const a = i / this.trail.length;
                ctx.beginPath();
                ctx.arc(this.trail[i].x, this.trail[i].y, 2.5 * a, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue},100%,75%,${a * 0.9})`;
                ctx.fill();
            }
        }
    }

    class Spark {
        constructor(x, y, hue) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 1 + Math.random() * 7;
            this.x = x; this.y = y;
            this.vx = Math.cos(angle) * spd;
            this.vy = Math.sin(angle) * spd - 1.5;
            this.alpha = 1;
            this.decay = 0.012 + Math.random() * 0.018;
            this.hue = hue + (Math.random() - 0.5) * 40;
            this.size = 1.5 + Math.random() * 2.5;
            this.sparkle = Math.random() < 0.25;
        }
        update() {
            this.vx *= 0.975; this.vy *= 0.975;
            this.vy += 0.12;
            this.x += this.vx; this.y += this.vy;
            this.alpha -= this.decay;
        }
        draw() {
            const a = Math.max(0, this.alpha);
            ctx.shadowColor = `hsl(${this.hue},100%,65%)`;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * a, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue},100%,70%,${a})`;
            ctx.fill();
            if (this.sparkle) {
                ctx.beginPath();
                ctx.moveTo(this.x - this.size * 3, this.y);
                ctx.lineTo(this.x + this.size * 3, this.y);
                ctx.moveTo(this.x, this.y - this.size * 3);
                ctx.lineTo(this.x, this.y + this.size * 3);
                ctx.strokeStyle = `hsla(${this.hue},100%,85%,${a * 0.6})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    function explode(x, y, hue) {
        const n = 90 + Math.floor(Math.random() * 50);
        for (let i = 0; i < n; i++) sparks.push(new Spark(x, y, hue));
        const hue2 = (hue + 150) % 360;
        for (let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const s = new Spark(x, y, hue2);
            const spd = 4 + Math.random() * 3;
            s.vx = Math.cos(angle) * spd;
            s.vy = Math.sin(angle) * spd;
            sparks.push(s);
        }
    }

    let frame = 0;
    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(2,2,10,0.22)';
        ctx.fillRect(0, 0, W, H);
        frame++;

        if (frame % 55 === 0 || rockets.length === 0) {
            rockets.push(new Rocket());
            if (Math.random() < 0.45) rockets.push(new Rocket());
        }

        for (let i = rockets.length - 1; i >= 0; i--) {
            rockets[i].update();
            rockets[i].draw();
            if (rockets[i].done) {
                explode(rockets[i].x, rockets[i].y, rockets[i].hue);
                rockets.splice(i, 1);
            }
        }

        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            sparks[i].draw();
            if (sparks[i].alpha <= 0) sparks.splice(i, 1);
        }
        ctx.shadowBlur = 0;
    }
    animate();
}
window.startFireworks = startFireworks;
