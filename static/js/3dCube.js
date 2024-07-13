function start3DCube(canvas, ctx, clearCanvasAndStop) {
    const cubeSize = 250; // Adjust size to be large but manageable
    let angle = 0;

    function drawCube() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const vertices = [
            { x: -1, y: -1, z: -1 },
            { x: 1, y: -1, z: -1 },
            { x: 1, y: 1, z: -1 },
            { x: -1, y: 1, z: -1 },
            { x: -1, y: -1, z: 1 },
            { x: 1, y: -1, z: 1 },
            { x: 1, y: 1, z: 1 },
            { x: -1, y: 1, z: 1 }
        ];

        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        const projection = (point) => {
            const scale = cubeSize / (point.z + 5);
            return {
                x: point.x * scale + canvas.width / 2,
                y: point.y * scale + canvas.height / 2
            };
        };

        const rotate = (point, angle) => {
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            return {
                x: point.x * cosA - point.z * sinA,
                y: point.y,
                z: point.x * sinA + point.z * cosA
            };
        };

        ctx.beginPath();
        edges.forEach(edge => {
            const p1 = projection(rotate(vertices[edge[0]], angle));
            const p2 = projection(rotate(vertices[edge[1]], angle));
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
        });
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        angle += 0.01;
    }

    function animate() {
        drawCube();
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.start3DCube = start3DCube;