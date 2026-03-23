// 3D Animated Background — Floating geometric particles with connections
(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Disable on mobile for battery/performance
    if (window.innerWidth < 768) {
        canvas.style.display = 'none';
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.z = 30;

    // --- Colors (Brand: orange accent, white, gray) ---
    const purple = new THREE.Color(0xFF6A00);
    const pink = new THREE.Color(0xFF8533);
    const cyan = new THREE.Color(0xB3B3B3);

    // --- Floating Particles ---
    const particleCount = 120;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];
    const colorPalette = [purple, pink, cyan];

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 60;
        positions[i3 + 1] = (Math.random() - 0.5) * 40;
        positions[i3 + 2] = (Math.random() - 0.5) * 30;

        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;

        velocities.push({
            x: (Math.random() - 0.5) * 0.015,
            y: (Math.random() - 0.5) * 0.015,
            z: (Math.random() - 0.5) * 0.01,
        });
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const particles = new THREE.Points(particlesGeo, particleMat);
    scene.add(particles);

    // --- Connection Lines ---
    const lineGeo = new THREE.BufferGeometry();
    const maxLines = 500;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // --- Floating Geometric Shapes ---
    const shapes = [];

    // Icosahedrons
    for (let i = 0; i < 5; i++) {
        const geo = new THREE.IcosahedronGeometry(Math.random() * 1.5 + 0.5, 0);
        const mat = new THREE.MeshBasicMaterial({
            color: colorPalette[i % 3],
            wireframe: true,
            transparent: true,
            opacity: 0.12,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 20 - 5
        );
        mesh.userData = {
            rotSpeed: { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005 },
            floatSpeed: Math.random() * 0.5 + 0.3,
            floatOffset: Math.random() * Math.PI * 2,
            baseY: mesh.position.y,
        };
        scene.add(mesh);
        shapes.push(mesh);
    }

    // Torus knots
    for (let i = 0; i < 3; i++) {
        const geo = new THREE.TorusKnotGeometry(1 + Math.random(), 0.3, 64, 8);
        const mat = new THREE.MeshBasicMaterial({
            color: colorPalette[(i + 1) % 3],
            wireframe: true,
            transparent: true,
            opacity: 0.08,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            -10 - Math.random() * 10
        );
        mesh.userData = {
            rotSpeed: { x: (Math.random() - 0.5) * 0.003, y: (Math.random() - 0.5) * 0.003 },
            floatSpeed: Math.random() * 0.3 + 0.2,
            floatOffset: Math.random() * Math.PI * 2,
            baseY: mesh.position.y,
        };
        scene.add(mesh);
        shapes.push(mesh);
    }

    // --- Octahedrons ---
    for (let i = 0; i < 4; i++) {
        const geo = new THREE.OctahedronGeometry(Math.random() * 1 + 0.5, 0);
        const mat = new THREE.MeshBasicMaterial({
            color: colorPalette[i % 3],
            wireframe: true,
            transparent: true,
            opacity: 0.1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 15 - 3
        );
        mesh.userData = {
            rotSpeed: { x: (Math.random() - 0.5) * 0.004, y: (Math.random() - 0.5) * 0.006 },
            floatSpeed: Math.random() * 0.4 + 0.2,
            floatOffset: Math.random() * Math.PI * 2,
            baseY: mesh.position.y,
        };
        scene.add(mesh);
        shapes.push(mesh);
    }

    // --- Mouse interaction ---
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    document.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // --- Animate ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Smooth mouse follow
        target.x += (mouse.x - target.x) * 0.02;
        target.y += (mouse.y - target.y) * 0.02;

        // Move particles
        const pos = particlesGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            pos[i3] += velocities[i].x;
            pos[i3 + 1] += velocities[i].y;
            pos[i3 + 2] += velocities[i].z;

            // Wrap around
            if (pos[i3] > 30) pos[i3] = -30;
            if (pos[i3] < -30) pos[i3] = 30;
            if (pos[i3 + 1] > 20) pos[i3 + 1] = -20;
            if (pos[i3 + 1] < -20) pos[i3 + 1] = 20;
            if (pos[i3 + 2] > 15) pos[i3 + 2] = -15;
            if (pos[i3 + 2] < -15) pos[i3 + 2] = 15;
        }
        particlesGeo.attributes.position.needsUpdate = true;

        // Update connection lines
        let lineIdx = 0;
        const lp = lineGeo.attributes.position.array;
        const lc = lineGeo.attributes.color.array;
        const connectionDist = 8;

        for (let i = 0; i < particleCount && lineIdx < maxLines; i++) {
            for (let j = i + 1; j < particleCount && lineIdx < maxLines; j++) {
                const dx = pos[i * 3] - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < connectionDist) {
                    const li = lineIdx * 6;
                    lp[li] = pos[i * 3];
                    lp[li + 1] = pos[i * 3 + 1];
                    lp[li + 2] = pos[i * 3 + 2];
                    lp[li + 3] = pos[j * 3];
                    lp[li + 4] = pos[j * 3 + 1];
                    lp[li + 5] = pos[j * 3 + 2];

                    const fade = 1 - dist / connectionDist;
                    lc[li] = purple.r * fade;
                    lc[li + 1] = purple.g * fade;
                    lc[li + 2] = purple.b * fade;
                    lc[li + 3] = purple.r * fade;
                    lc[li + 4] = purple.g * fade;
                    lc[li + 5] = purple.b * fade;

                    lineIdx++;
                }
            }
        }

        // Clear remaining lines
        for (let i = lineIdx * 6; i < maxLines * 6; i++) {
            lp[i] = 0;
            lc[i] = 0;
        }

        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;
        lineGeo.setDrawRange(0, lineIdx * 2);

        // Animate shapes
        shapes.forEach((shape) => {
            const d = shape.userData;
            shape.rotation.x += d.rotSpeed.x;
            shape.rotation.y += d.rotSpeed.y;
            shape.position.y = d.baseY + Math.sin(elapsed * d.floatSpeed + d.floatOffset) * 1.5;
        });

        // Camera follow mouse
        camera.position.x += (target.x * 3 - camera.position.x) * 0.02;
        camera.position.y += (target.y * 2 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    // --- Resize ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
