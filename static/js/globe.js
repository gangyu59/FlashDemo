function startGlobe(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;
    const R = Math.min(W, H) * 0.37;
    let lon0 = 0; // rotation offset in radians

    // Major cities [lat_deg, lon_deg, name]
    const cities = [
        [40.7,-74.0,'New York'],[51.5,-0.1,'London'],[48.8,2.3,'Paris'],
        [35.7,139.7,'Tokyo'],[-33.9,151.2,'Sydney'],[55.8,37.6,'Moscow'],
        [31.2,121.5,'Shanghai'],[-23.5,-46.6,'São Paulo'],[28.6,77.2,'Delhi'],
        [1.3,103.8,'Singapore'],[19.4,-99.1,'Mexico City'],[30.1,31.2,'Cairo'],
        [-1.3,36.8,'Nairobi'],[37.8,-122.4,'San Francisco'],[52.5,13.4,'Berlin'],
        [41.0,28.9,'Istanbul'],[-34.6,-58.4,'Buenos Aires'],[22.3,114.2,'Hong Kong'],
    ];

    // Convert lat/lon (degrees) + current rotation to 3D unit vector
    function to3D(lat, lon) {
        const phi = lat * Math.PI / 180;
        const theta = (lon * Math.PI / 180) - lon0;
        return {
            x:  Math.cos(phi) * Math.sin(theta),
            y: -Math.sin(phi),
            z:  Math.cos(phi) * Math.cos(theta),
        };
    }

    function proj(p) {
        return { sx: CX + p.x * R, sy: CY + p.y * R, vis: p.z > 0 };
    }

    function drawGridLine(latFixed, lonRange, latRange, lonFixed, isLat) {
        ctx.beginPath();
        let started = false;
        const pts = isLat ? lonRange : latRange;
        pts.forEach(deg => {
            const p = to3D(isLat ? latFixed : deg, isLat ? deg : lonFixed);
            if (p.z <= 0) { started = false; return; }
            const s = proj(p);
            if (!started) { ctx.moveTo(s.sx, s.sy); started = true; }
            else ctx.lineTo(s.sx, s.sy);
        });
        ctx.stroke();
    }

    const lonSteps = Array.from({ length: 73 }, (_, i) => -180 + i * 5);
    const latSteps = Array.from({ length: 37 }, (_, i) => -90 + i * 5);

    function animate() {
        window.animationFrameId = requestAnimationFrame(animate);
        ctx.fillStyle = '#020a18';
        ctx.fillRect(0, 0, W, H);

        // Atmosphere halo
        const atm = ctx.createRadialGradient(CX, CY, R * 0.92, CX, CY, R * 1.18);
        atm.addColorStop(0, 'rgba(56,130,255,0.22)');
        atm.addColorStop(1, 'transparent');
        ctx.fillStyle = atm;
        ctx.beginPath(); ctx.arc(CX, CY, R * 1.18, 0, Math.PI * 2); ctx.fill();

        // Ocean base gradient
        const ocean = ctx.createRadialGradient(CX - R*0.28, CY - R*0.28, 0, CX, CY, R);
        ocean.addColorStop(0, '#1a4f9a');
        ocean.addColorStop(0.6, '#0d2e5e');
        ocean.addColorStop(1, '#050e1e');
        ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2);
        ctx.fillStyle = ocean; ctx.fill();

        // Clip grid + cities to sphere
        ctx.save();
        ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.clip();

        // Latitude grid
        ctx.strokeStyle = 'rgba(100,180,255,0.13)';
        ctx.lineWidth = 0.8;
        for (let lat = -75; lat <= 75; lat += 15) {
            drawGridLine(lat, lonSteps, null, null, true);
        }
        // Longitude grid
        for (let lon = -165; lon <= 180; lon += 15) {
            drawGridLine(null, null, latSteps, lon, false);
        }
        // Equator highlight
        ctx.strokeStyle = 'rgba(100,210,255,0.28)';
        ctx.lineWidth = 1.5;
        drawGridLine(0, lonSteps, null, null, true);
        // Prime meridian
        ctx.strokeStyle = 'rgba(100,210,255,0.18)';
        ctx.lineWidth = 1.2;
        drawGridLine(null, null, latSteps, 0, false);

        // Cities
        ctx.shadowBlur = 0;
        cities.forEach(([lat, lon, name]) => {
            const p = to3D(lat, lon);
            if (p.z < 0.05) return;
            const s = proj(p);
            const fade = Math.min(1, (p.z - 0.05) / 0.3);

            // Glow ring
            ctx.beginPath();
            ctx.arc(s.sx, s.sy, 6 * fade, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,220,80,${fade * 0.18})`;
            ctx.fill();
            // Dot
            ctx.beginPath();
            ctx.arc(s.sx, s.sy, 3 * fade, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,220,80,${fade * 0.95})`;
            ctx.shadowColor = 'rgba(255,200,50,0.9)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Label (only for well-visible cities)
            if (p.z > 0.35 && fade > 0.7) {
                ctx.fillStyle = `rgba(255,240,180,${fade * 0.85})`;
                ctx.font = `${Math.min(11, W*0.012)}px 'Space Grotesk',Arial`;
                ctx.textAlign = 'left';
                ctx.fillText(name, s.sx + 5, s.sy - 3);
            }
        });

        ctx.restore();

        // Specular highlight
        const hl = ctx.createRadialGradient(CX-R*0.32, CY-R*0.32, 0, CX, CY, R);
        hl.addColorStop(0, 'rgba(255,255,255,0.13)');
        hl.addColorStop(0.45, 'rgba(255,255,255,0.02)');
        hl.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2);
        ctx.fillStyle = hl; ctx.fill();

        // Border
        ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(80,160,255,0.45)';
        ctx.lineWidth = 1.5; ctx.stroke();

        lon0 += 0.005;
    }
    animate();
}
window.startGlobe = startGlobe;
