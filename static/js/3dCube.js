function start3DCube(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;
    const S = Math.min(W, H) * 0.22;
    let ax = 0.4, ay = 0;

    // Unit cube vertices (will be scaled by S)
    const V = [
        [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],  // 0-3 back
        [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1],  // 4-7 front
    ];

    // Faces: [i0,i1,i2,i3, fillColor, glowColor]
    // Vertices in CCW order viewed from outside the face
    const FACES = [
        [3,2,1,0, '#e74c3c','#ff4444'],
        [4,5,6,7, '#3498db','#44aaff'],
        [0,1,5,4, '#f39c12','#ffbb33'],
        [3,7,6,2, '#2ecc71','#44ff88'],
        [0,4,7,3, '#9b59b6','#bb66ff'],
        [1,2,6,5, '#1abc9c','#22eebb'],
    ];

    // Light direction (normalized)
    const L = [-0.4, -0.7, 0.6];
    const LN = Math.sqrt(L[0]**2+L[1]**2+L[2]**2);

    function rotX([x,y,z], a) {
        return [x, y*Math.cos(a)-z*Math.sin(a), y*Math.sin(a)+z*Math.cos(a)];
    }
    function rotY([x,y,z], a) {
        return [x*Math.cos(a)+z*Math.sin(a), y, -x*Math.sin(a)+z*Math.cos(a)];
    }
    function proj([x,y,z]) {
        const f = 700;
        const sc = f / (f - z * S);
        return [x * S * sc + CX, y * S * sc + CY];
    }

    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);

        ctx.fillStyle = '#030310';
        ctx.fillRect(0, 0, W, H);

        // Rotate all vertices
        const rv = V.map(v => rotY(rotX(v, ax), ay));
        const pv = rv.map(proj);

        // Build face data
        const faceData = FACES.map(([i0,i1,i2,i3, col, glow]) => {
            const pts = [pv[i0], pv[i1], pv[i2], pv[i3]];

            // Screen-space cross product (winding check)
            const cross = (pts[1][0]-pts[0][0])*(pts[2][1]-pts[0][1])
                        - (pts[1][1]-pts[0][1])*(pts[2][0]-pts[0][0]);

            // 3D normal for lighting
            const r = rv;
            const ax2 = r[i1][0]-r[i0][0], ay2 = r[i1][1]-r[i0][1], az2 = r[i1][2]-r[i0][2];
            const bx  = r[i2][0]-r[i0][0], by  = r[i2][1]-r[i0][1], bz  = r[i2][2]-r[i0][2];
            const nx = ay2*bz-az2*by, ny = az2*bx-ax2*bz, nz = ax2*by-ay2*bx;
            const nl = Math.sqrt(nx*nx+ny*ny+nz*nz);
            const dot = (nx*L[0]+ny*L[1]+nz*L[2]) / (nl * LN);
            const bright = 0.28 + Math.max(0, dot) * 0.72;

            const avgZ = (rv[i0][2]+rv[i1][2]+rv[i2][2]+rv[i3][2]) / 4;
            return { pts, cross, bright, avgZ, col, glow };
        });

        // Sort back-to-front
        faceData.sort((a, b) => a.avgZ - b.avgZ);

        faceData.forEach(({ pts, cross, bright, col, glow }) => {
            if (cross < 0) return; // backface cull

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
            ctx.closePath();

            ctx.globalAlpha = bright;
            ctx.fillStyle = col;
            ctx.shadowColor = glow;
            ctx.shadowBlur = 18;
            ctx.fill();

            ctx.globalAlpha = 1;
            ctx.strokeStyle = `rgba(255,255,255,0.2)`;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 0;
            ctx.stroke();
            ctx.restore();
        });

        ay += 0.013;
        ax += 0.007;
    }
    animate();
}
window.start3DCube = start3DCube;
