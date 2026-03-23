function startDataViz(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;

    const data = [
        { label:'Jan', v:62,  color:'#38bdf8' },
        { label:'Feb', v:78,  color:'#818cf8' },
        { label:'Mar', v:55,  color:'#34d399' },
        { label:'Apr', v:91,  color:'#fb923c' },
        { label:'May', v:83,  color:'#f472b6' },
        { label:'Jun', v:100, color:'#facc15' },
        { label:'Jul', v:97,  color:'#a78bfa' },
        { label:'Aug', v:88,  color:'#2dd4bf' },
        { label:'Sep', v:74,  color:'#f87171' },
        { label:'Oct', v:69,  color:'#60a5fa' },
        { label:'Nov', v:58,  color:'#86efac' },
        { label:'Dec', v:93,  color:'#e879f9' },
    ];

    const ML = 64, MR = 24, MT = 75, MB = 60;
    const cW = W - ML - MR;
    const cH = H - MT - MB;
    const barW = cW / data.length;

    let prog = 0; // 0→1 grow animation
    let hover = -1;

    // Mouse / touch hover
    function onMove(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width;
        const mx = ((e.touches ? e.touches[0].clientX : e.clientX) - rect.left) * scaleX;
        hover = -1;
        data.forEach((_, i) => {
            const bx = ML + i * barW + barW * 0.1;
            const bw = barW * 0.8;
            if (mx >= bx && mx <= bx + bw) hover = i;
        });
    }
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onMove, { passive: true });

    function draw(p) {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, W, H);

        // Title
        ctx.fillStyle = '#e8e8f0';
        ctx.font = `700 ${Math.min(26, W*0.028)}px 'Space Grotesk',Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('Monthly Performance Index', W/2, 44);

        // Grid lines + Y labels
        for (let i = 0; i <= 5; i++) {
            const y = MT + cH * (1 - i/5);
            ctx.strokeStyle = 'rgba(255,255,255,0.07)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(ML, y); ctx.lineTo(ML+cW, y); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.38)';
            ctx.font = `${Math.min(12,W*0.013)}px 'Space Grotesk',Arial`;
            ctx.textAlign = 'right';
            ctx.fillText((i*20).toString(), ML - 8, y + 4);
        }

        // Bars
        const ease = 1 - Math.pow(1 - Math.min(p, 1), 3);
        data.forEach((d, i) => {
            const bh = (d.v / 100) * cH * ease;
            const bx = ML + i * barW + barW * 0.1;
            const bw = barW * 0.8;
            const by = MT + cH - bh;
            const isHov = (i === hover);

            const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
            grad.addColorStop(0, d.color);
            grad.addColorStop(1, d.color + '44');

            ctx.shadowColor = d.color;
            ctx.shadowBlur = isHov ? 22 : 10;

            const r = Math.min(5, bw/2);
            ctx.beginPath();
            ctx.moveTo(bx+r, by);
            ctx.lineTo(bx+bw-r, by); ctx.quadraticCurveTo(bx+bw, by, bx+bw, by+r);
            ctx.lineTo(bx+bw, by+bh); ctx.lineTo(bx, by+bh);
            ctx.lineTo(bx, by+r); ctx.quadraticCurveTo(bx, by, bx+r, by);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.globalAlpha = isHov ? 1 : 0.85;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Value label
            if (p > 0.85) {
                const fa = (p - 0.85) / 0.15;
                ctx.globalAlpha = fa;
                ctx.fillStyle = '#ffffff';
                ctx.font = `700 ${Math.min(12,W*0.013)}px 'Space Grotesk',Arial`;
                ctx.textAlign = 'center';
                ctx.shadowBlur = 0;
                ctx.fillText(d.v, bx + bw/2, by - 6);
                ctx.globalAlpha = 1;
            }

            // Month label
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = `${Math.min(12,W*0.013)}px 'Space Grotesk',Arial`;
            ctx.textAlign = 'center';
            ctx.shadowBlur = 0;
            ctx.fillText(d.label, bx + bw/2, MT + cH + 22);
        });

        // Axes
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(ML, MT); ctx.lineTo(ML, MT+cH); ctx.lineTo(ML+cW, MT+cH);
        ctx.stroke();
    }

    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);
        if (prog < 1) prog += 0.016;
        draw(prog);
    }
    animate();
}
window.startDataViz = startDataViz;
