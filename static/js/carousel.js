function startCarousel(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;

    const cards = [
        { emoji:'🌌', title:'Universe',    sub:'13.8 billion years of cosmic wonder',   from:'#0d1b3e', to:'#1a0a2e', accent:'#818cf8' },
        { emoji:'🌊', title:'Ocean Depths',sub:'71% of Earth lies beneath the waves',   from:'#001a3a', to:'#003366', accent:'#38bdf8' },
        { emoji:'🌋', title:'Geology',     sub:'The living, breathing planet beneath',  from:'#3b0a00', to:'#7f1d1d', accent:'#fb923c' },
        { emoji:'🦋', title:'Nature',      sub:'3.8 billion years of evolution',        from:'#052e16', to:'#14532d', accent:'#4ade80' },
        { emoji:'⚡', title:'Energy',      sub:'Powering civilisation since lightning', from:'#1a1040', to:'#312e81', accent:'#c084fc' },
        { emoji:'🎶', title:'Music',       sub:'The universal language of emotion',     from:'#3b0015', to:'#4a044e', accent:'#f472b6' },
    ];

    const CW = Math.min(680, W * 0.82);
    const CH = Math.min(420, H * 0.68);
    const CX = (W - CW) / 2;
    const CY = (H - CH) / 2;

    let cur = 0, nxt = 1;
    let prog = 0, going = false, frame = 0;

    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
    }

    function drawCard(card, ox, alpha) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.translate(ox, 0);

        // Shadow
        ctx.shadowColor = card.accent;
        ctx.shadowBlur = 30;
        roundRect(CX, CY, CW, CH, 22);
        ctx.shadowBlur = 0;

        // Background gradient
        ctx.clip();
        roundRect(CX, CY, CW, CH, 22);
        const bg = ctx.createLinearGradient(CX, CY, CX+CW, CY+CH);
        bg.addColorStop(0, card.from);
        bg.addColorStop(1, card.to);
        ctx.fillStyle = bg;
        ctx.fill();

        // Accent radial highlight
        const aGrad = ctx.createRadialGradient(CX+CW*0.75, CY+CH*0.2, 0, CX+CW*0.75, CY+CH*0.2, CW*0.55);
        aGrad.addColorStop(0, card.accent + '33');
        aGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = aGrad;
        ctx.fillRect(CX, CY, CW, CH);

        // Emoji
        const eSize = Math.min(110, CH * 0.27);
        ctx.font = `${eSize}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(card.emoji, CX + CW/2, CY + CH * 0.37);

        // Title
        const tSize = Math.min(44, CH * 0.11);
        ctx.font = `700 ${tSize}px 'Space Grotesk', Arial`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = card.accent;
        ctx.shadowBlur = 22;
        ctx.fillText(card.title, CX + CW/2, CY + CH * 0.63);

        // Subtitle
        ctx.font = `${Math.min(20, CH * 0.055)}px 'Space Grotesk', Arial`;
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.shadowBlur = 0;
        ctx.fillText(card.sub, CX + CW/2, CY + CH * 0.76);

        // Bottom accent line
        ctx.strokeStyle = card.accent;
        ctx.lineWidth = 3;
        ctx.shadowColor = card.accent;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(CX + CW*0.28, CY + CH * 0.88);
        ctx.lineTo(CX + CW*0.72, CY + CH * 0.88);
        ctx.stroke();

        ctx.restore();
    }

    function drawDots() {
        cards.forEach((c, i) => {
            const x = W/2 + (i - (cards.length-1)/2) * 18;
            const y = CY + CH + 28;
            ctx.beginPath();
            ctx.arc(x, y, i === cur ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fillStyle = i === cur ? '#ffffff' : 'rgba(255,255,255,0.25)';
            ctx.fill();
        });
    }

    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);
        frame++;

        ctx.fillStyle = '#07070f';
        ctx.fillRect(0, 0, W, H);

        if (frame % 210 === 0 && !going) {
            going = true;
            nxt = (cur + 1) % cards.length;
        }

        if (going) {
            prog += 0.028;
            if (prog >= 1) { prog = 0; cur = nxt; going = false; }
            const ease = prog < 0.5 ? 2*prog*prog : -1+(4-2*prog)*prog; // ease in-out
            drawCard(cards[cur], -ease * W, 1 - ease * 0.4);
            drawCard(cards[nxt], W - ease * W, ease);
        } else {
            drawCard(cards[cur], 0, 1);
        }

        drawDots();
        ctx.shadowBlur = 0;
    }
    animate();
}
window.startCarousel = startCarousel;
