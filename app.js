// ==========================================================================
// Nguyễn Duy Quang - Matcha Cute Profile 3D Application
// Enhanced with Google AI Achievements, Three.js 3D & Mobile Optimization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initSoundSystem();
    initThreeJSMascot();
    initCertificatesLightbox();
    initCertificatesFilter();
    initMatchaGame();
    initMobileBottomDock();
    initGSAPAnimations();
});

// --- Sound FX Generator (Pure Web Audio API - Zero External Dependencies) ---
let audioCtx = null;
let soundEnabled = true;

function initSoundSystem() {
    const toggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
            toggleBtn.setAttribute('title', soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh');
            if (soundEnabled) playPopSound(600, 0.08);
        });
    }
}

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playPopSound(freq = 520, duration = 0.08) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Audio error silent fallback
    }
}

function playCelebrationChime() {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.4);
            }, i * 90);
        });
    } catch (e) {
        // Audio error silent fallback
    }
}

// --- 1. Three.js Mascot (Matcha Bear) & 3D Interactive Floating Badges ---
let scene, camera, renderer, controls;
let mascotGroup, headGroup, eyeLeft, eyeRight, heldCupGroup;
let orbitRingGroup;
let targetHeadRotY = 0, targetHeadRotX = 0;
let isBlinking = false;
let autoRotateActive = true;
let floatingMeshes = [];

// Floating 3D Badges Data (Includes Top 500 Google AI & Kaggle!)
const floatingIconsData = [
    // Top Prestigious Achievements (Featured Orbit)
    {
        type: 'award',
        logoUrl: 'https://img.icons8.com/color/96/google-logo.png',
        name: 'Top 500 AI Riser Vietnam',
        info: 'Quang vinh dự đạt Top 500 AI Riser Vietnam 2026 (#BuildwithGoogleAI) do Google for Developers chứng nhận! 🏆🤖'
    },
    {
        type: 'award',
        logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kaggle/kaggle-original.svg',
        name: '5-Day Vibe Coding Kaggle',
        info: 'Quang đã xuất sắc hoàn thành khóa 5-Day AI Agents: Intensive Vibe Coding Course của Kaggle & Google! ⚡🔥'
    },

    // Tech Skills
    {
        type: 'skill',
        logoUrl: 'https://img.icons8.com/color/96/python.png',
        name: 'Python AI',
        info: 'Quang dùng Python chủ yếu để huấn luyện mô hình AI, phát triển AI Agents và xử lý dữ liệu lớn! 🐍'
    },
    {
        type: 'skill',
        logoUrl: 'https://img.icons8.com/color/96/react-native.png',
        name: 'React & UI',
        info: 'Quang thiết kế giao diện React hiện đại, tối ưu 3D Web với Three.js và trải nghiệm người dùng cao cấp! ⚛️'
    },
    {
        type: 'skill',
        logoUrl: 'https://img.icons8.com/color/96/nodejs.png',
        name: 'Node.js Backend',
        info: 'Quang xây dựng hệ thống máy chủ Node.js hiệu năng cao, RESTful API và real-time WebSocket! 🟢'
    },
    {
        type: 'skill',
        logoUrl: 'https://img.icons8.com/color/96/mysql-logo.png',
        name: 'MySQL & SQL',
        info: 'Quang thiết kế kiến trúc cơ sở dữ liệu quan hệ tối ưu, truy vấn phân tích dữ liệu tốc độ cao! 🐬'
    },

    // Social Contacts
    {
        type: 'contact',
        logoUrl: 'https://img.icons8.com/color/96/facebook-new.png',
        name: 'Facebook',
        url: 'https://www.facebook.com/NgDoQ'
    },
    {
        type: 'contact',
        logoUrl: 'https://img.icons8.com/color/96/instagram-new.png',
        name: 'Instagram',
        url: 'https://www.instagram.com/quangcogo0406/'
    },
    {
        type: 'contact',
        logoUrl: 'https://img.icons8.com/color/96/github.png',
        name: 'GitHub',
        url: 'https://github.com/Wothing0406'
    },
    {
        type: 'contact',
        logoUrl: 'https://img.icons8.com/color/96/gmail-new.png',
        name: 'Gmail',
        url: 'mailto:poiairo4628@gmail.com'
    },
    {
        type: 'contact',
        logoUrl: 'https://img.icons8.com/color/96/phone.png',
        name: 'Điện thoại',
        url: 'tel:0795277227'
    }
];

function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function initThreeJSMascot() {
    const container = document.getElementById('mascot-canvas-container');
    const loaderEl = document.getElementById('mascot-3d-loader');
    const fallbackEl = document.getElementById('mascot-fallback');

    if (!container) return;

    // WebGL Fallback Check
    if (!isWebGLAvailable()) {
        if (loaderEl) loaderEl.classList.add('fade-out');
        if (fallbackEl) fallbackEl.classList.remove('hidden');
        return;
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 440;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    // 1. Create Scene
    scene = new THREE.Scene();

    // 2. Create Camera
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 8.8);

    // 3. Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    // Optimize DPR for mobile to guarantee 60fps & battery efficiency
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls (Configured to not block mobile vertical scroll)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false; // Prevents stealing page zoom
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2.7;
    controls.maxPolarAngle = Math.PI / 1.75;
    controls.minAzimuthAngle = -Math.PI / 2.2;
    controls.maxAzimuthAngle = Math.PI / 2.2;
    controls.autoRotate = false; // We use our own customized auto-rotate
    controls.autoRotateSpeed = 1.2;

    // 5. Studio PBR Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xf2f8ee, 0.9);
    scene.add(ambientLight);

    // Main Warm Key Light
    const dirLight = new THREE.DirectionalLight(0xfffaea, 0.85);
    dirLight.position.set(6, 9, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    scene.add(dirLight);

    // Cool Cyan/Blue Rim Light (Back-left rim for 3D depth)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Warm Underfill Point Light
    const pointLight = new THREE.PointLight(0xa7f3d0, 1.0, 12);
    pointLight.position.set(-2, -1.5, 3);
    scene.add(pointLight);

    // 6. Mascot Main Group
    mascotGroup = new THREE.Group();
    mascotGroup.position.y = -0.85;
    scene.add(mascotGroup);

    // Mascot PBR Materials
    const matchaMat = new THREE.MeshStandardMaterial({
        color: 0x6ca561, // Premium Matcha Green
        roughness: 0.55,
        metalness: 0.08
    });

    const innerEarMat = new THREE.MeshStandardMaterial({
        color: 0xffb8b4, // Cute Soft Pink
        roughness: 0.75
    });

    const creamMat = new THREE.MeshStandardMaterial({
        color: 0xf9fcf8, // Cream Soft Wool
        roughness: 0.65
    });

    const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x18181b, // Glossy Black
        roughness: 0.1,
        metalness: 0.2
    });

    const strawMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6, // Pastel Pink Straw
        roughness: 0.35
    });

    // Body (Torso with soft sweater)
    const bodyGeo = new THREE.CylinderGeometry(0.92, 1.22, 2.05, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, creamMat);
    bodyMesh.position.y = 0.5;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    mascotGroup.add(bodyMesh);

    // Sweater Green Stripe
    const stripeGeo = new THREE.CylinderGeometry(1.09, 1.16, 0.38, 32);
    const stripeMesh = new THREE.Mesh(stripeGeo, matchaMat);
    stripeMesh.position.y = 0.5;
    mascotGroup.add(stripeMesh);

    // Sweater Collar
    const collarGeo = new THREE.TorusGeometry(0.88, 0.13, 16, 32);
    const collarMesh = new THREE.Mesh(collarGeo, matchaMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = 1.48;
    mascotGroup.add(collarMesh);

    // Stubby legs
    const legGeo = new THREE.SphereGeometry(0.42, 16, 16);
    const legLeft = new THREE.Mesh(legGeo, matchaMat);
    legLeft.position.set(-0.62, -0.42, 0.2);
    legLeft.scale.y = 1.25;
    mascotGroup.add(legLeft);

    const legRight = legLeft.clone();
    legRight.position.x = 0.62;
    mascotGroup.add(legRight);

    // Stubby arms
    const armGeo = new THREE.SphereGeometry(0.36, 16, 16);
    const armLeft = new THREE.Mesh(armGeo, matchaMat);
    armLeft.position.set(-1.12, 0.9, 0.2);
    mascotGroup.add(armLeft);

    const armRight = armLeft.clone();
    armRight.position.set(1.12, 0.9, 0.2);
    mascotGroup.add(armRight);

    // 7. Mascot Head Group
    headGroup = new THREE.Group();
    headGroup.position.set(0, 1.72, 0);
    mascotGroup.add(headGroup);

    // Head Base
    const headGeo = new THREE.SphereGeometry(1.18, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, matchaMat);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headGroup.add(headMesh);

    // Ears Left & Right
    const earOuterGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const earOuterLeft = new THREE.Mesh(earOuterGeo, matchaMat);
    earOuterLeft.position.set(-0.88, 0.88, -0.1);
    headGroup.add(earOuterLeft);

    const earInnerGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const earInnerLeft = new THREE.Mesh(earInnerGeo, innerEarMat);
    earInnerLeft.position.set(-0.88, 0.88, 0.1);
    earInnerLeft.scale.z = 0.5;
    headGroup.add(earInnerLeft);

    const earOuterRight = earOuterLeft.clone();
    earOuterRight.position.x = 0.88;
    headGroup.add(earOuterRight);

    const earInnerRight = earInnerLeft.clone();
    earInnerRight.position.x = 0.88;
    headGroup.add(earInnerRight);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(-0.42, 0.16, 1.02);
    headGroup.add(eyeLeft);

    eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.42;
    headGroup.add(eyeRight);

    // Eye Highlights (Cute sparkle)
    const sparkGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sparkLeft = new THREE.Mesh(sparkGeo, sparkMat);
    sparkLeft.position.set(-0.45, 0.2, 1.11);
    headGroup.add(sparkLeft);

    const sparkRight = sparkLeft.clone();
    sparkRight.position.x = 0.39;
    headGroup.add(sparkRight);

    // Snout
    const snoutGeo = new THREE.SphereGeometry(0.34, 16, 16);
    const snoutMesh = new THREE.Mesh(snoutGeo, creamMat);
    snoutMesh.scale.set(1.22, 0.82, 0.62);
    snoutMesh.position.set(0, -0.16, 0.98);
    headGroup.add(snoutMesh);

    // Nose
    const noseGeo = new THREE.SphereGeometry(0.085, 8, 8);
    const noseMesh = new THREE.Mesh(noseGeo, eyeMat);
    noseMesh.position.set(0, -0.1, 1.16);
    headGroup.add(noseMesh);

    // Cheeks (Rosy blush)
    const cheekGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const cheekLeft = new THREE.Mesh(cheekGeo, innerEarMat);
    cheekLeft.scale.z = 0.15;
    cheekLeft.position.set(-0.72, -0.12, 0.98);
    headGroup.add(cheekLeft);

    const cheekRight = cheekLeft.clone();
    cheekRight.position.x = 0.72;
    headGroup.add(cheekRight);

    // 8. Mini Matcha Latte Cup in Hand
    heldCupGroup = new THREE.Group();
    heldCupGroup.position.set(0.68, 0.62, 0.85);
    mascotGroup.add(heldCupGroup);

    const miniCupGeo = new THREE.CylinderGeometry(0.3, 0.24, 0.62, 20);
    const miniCupMesh = new THREE.Mesh(miniCupGeo, creamMat);
    miniCupMesh.castShadow = true;
    heldCupGroup.add(miniCupMesh);

    const miniLiquidGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.12, 20);
    const miniLiquidMesh = new THREE.Mesh(miniLiquidGeo, matchaMat);
    miniLiquidMesh.position.y = 0.26;
    heldCupGroup.add(miniLiquidMesh);

    const strawGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.52, 8);
    const strawMesh = new THREE.Mesh(strawGeo, strawMat);
    strawMesh.position.set(0.09, 0.42, 0.05);
    strawMesh.rotation.z = -0.22;
    heldCupGroup.add(strawMesh);

    // 9. Holographic Gyro Orbit Rings (Around Mascot Base)
    orbitRingGroup = new THREE.Group();
    orbitRingGroup.position.y = 0.4;
    mascotGroup.add(orbitRingGroup);

    const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0x6ee7b7,
        transparent: true,
        opacity: 0.45,
        wireframe: true
    });
    const ringGeo1 = new THREE.TorusGeometry(1.65, 0.02, 8, 48);
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 2.3;
    ringMesh1.rotation.y = 0.2;
    orbitRingGroup.add(ringMesh1);

    const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });
    const ringGeo2 = new THREE.TorusGeometry(1.85, 0.02, 8, 48);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 1.8;
    ringMesh2.rotation.z = -0.3;
    orbitRingGroup.add(ringMesh2);

    // Floor Soft Shadow
    const shadowGeo = new THREE.RingGeometry(0.01, 1.45, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
        color: 0xc6e4c3,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    const shadowFloor = new THREE.Mesh(shadowGeo, shadowMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.44;
    mascotGroup.add(shadowFloor);

    // 10. 3D Floating Badges Setup (Coins with 3D Depth)
    const textureLoader = new THREE.TextureLoader();
    const badgeCoinGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.07, 32);
    const coinBackMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.3
    });
    const coinRimMatGold = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.75,
        roughness: 0.25
    });
    const coinRimMatGreen = new THREE.MeshStandardMaterial({
        color: 0x6da763,
        metalness: 0.5,
        roughness: 0.3
    });

    floatingIconsData.forEach((data, i) => {
        const isAward = data.type === 'award';
        const isContact = data.type === 'contact';

        // Coin group for 3D depth
        const coinGroup = new THREE.Group();

        // Rim cylinder
        const rimMesh = new THREE.Mesh(badgeCoinGeo, isAward ? coinRimMatGold : coinRimMatGreen);
        rimMesh.rotation.x = Math.PI / 2;
        coinGroup.add(rimMesh);

        // Front texture plane
        const texture = textureLoader.load(data.logoUrl);
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;

        const frontGeo = new THREE.CircleGeometry(0.34, 32);
        const frontMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.FrontSide
        });
        const frontMesh = new THREE.Mesh(frontGeo, frontMat);
        frontMesh.position.z = 0.04;
        coinGroup.add(frontMesh);

        // Orbit radius: Awards in middle high orbit, contacts inner, skills outer
        let orbitRadius = isAward ? 2.1 : (isContact ? 1.85 : 2.75);
        const totalInSet = floatingIconsData.length;
        const initialTheta = (i / totalInSet) * Math.PI * 2;
        const y = 0.7 + Math.sin(i * 1.3) * 0.55;

        coinGroup.position.set(
            Math.sin(initialTheta) * orbitRadius,
            y,
            Math.cos(initialTheta) * orbitRadius
        );

        coinGroup.userData = {
            type: 'floating_badge',
            info: data,
            initialY: y,
            radius: orbitRadius,
            theta: initialTheta,
            orbitSpeed: isAward ? 0.004 : (isContact ? 0.003 : -0.0025),
            phase: i * 0.8
        };

        scene.add(coinGroup);
        floatingMeshes.push(coinGroup);
    });

    // 11. Mini Floating Leaves / Particles
    createMiniFloatingLeaves();

    // Fade out 3D Loader
    setTimeout(() => {
        if (loaderEl) loaderEl.classList.add('fade-out');
    }, 450);

    // 12. 3D Toolbar Controls Setup
    const toggleRotateBtn = document.getElementById('btn-toggle-rotate');
    const resetViewBtn = document.getElementById('btn-reset-view');

    if (toggleRotateBtn) {
        toggleRotateBtn.addEventListener('click', () => {
            autoRotateActive = !autoRotateActive;
            toggleRotateBtn.classList.toggle('active', autoRotateActive);
            playPopSound(580, 0.06);
        });
    }

    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', () => {
            gsap.to(camera.position, {
                x: 0, y: 0.6, z: 8.8,
                duration: 0.8,
                ease: 'power2.inOut',
                onUpdate: () => controls.update()
            });
            gsap.to(mascotGroup.rotation, { y: 0, duration: 0.8, ease: 'power2.out' });
            playPopSound(720, 0.08);
        });
    }

    // 13. Raycasting Click / Tap Handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function handleInteractionClick(clientX, clientY) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Find intersections in floating badge children & mascot
        const checkObjects = [];
        floatingMeshes.forEach(fg => {
            fg.children.forEach(c => checkObjects.push(c));
        });
        checkObjects.push(headMesh, bodyMesh, stripeMesh);

        const intersects = raycaster.intersectObjects(checkObjects);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            const parentCoin = hit.parent && hit.parent.userData && hit.parent.userData.type === 'floating_badge' ? hit.parent : null;

            if (parentCoin) {
                const info = parentCoin.userData.info;
                playPopSound(800, 0.1);

                // Spin animation
                gsap.to(parentCoin.rotation, {
                    y: parentCoin.rotation.y + Math.PI * 2,
                    duration: 0.65,
                    ease: 'power2.inOut'
                });
                gsap.to(parentCoin.scale, {
                    x: 1.35, y: 1.35, z: 1.35,
                    duration: 0.2, yoyo: true, repeat: 1
                });

                if (info.type === 'contact') {
                    setSpeechBubble(`Đang mở ${info.name} của Quang... 🚀`);
                    setTimeout(() => window.open(info.url, '_blank'), 450);
                } else {
                    setSpeechBubble(info.info);
                    // Mascot celebrates
                    gsap.to(mascotGroup.position, {
                        y: -0.3, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out'
                    });
                    gsap.to(headGroup.rotation, {
                        z: 0.22, duration: 0.18, yoyo: true, repeat: 1
                    });
                }
            } else {
                // Clicked Mascot
                playPopSound(450, 0.1);
                setSpeechBubble('Hihi! Bạn vừa cù lét gấu Matcha đó hả? 🐻🍵 Nhấn vào các huy hiệu bay quanh để xem thành tích nhé!');
                gsap.to(mascotGroup.position, {
                    y: -0.35, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out'
                });
                gsap.to(mascotGroup.rotation, {
                    y: mascotGroup.rotation.y + Math.PI * 2,
                    duration: 0.8,
                    ease: 'back.out(1.4)'
                });
            }
        }
    }

    container.addEventListener('click', (e) => {
        handleInteractionClick(e.clientX, e.clientY);
    });

    // Touch tap for mobile
    let touchStartX = 0, touchStartY = 0;
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
            const dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
            // If it was a tap (not a drag)
            if (dx < 10 && dy < 10) {
                handleInteractionClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        }
    }, { passive: true });

    function setSpeechBubble(text) {
        const speechEl = document.getElementById('speech-text');
        const speechBox = document.getElementById('mascot-speech-box');
        if (speechEl) speechEl.textContent = text;
        if (speechBox) {
            gsap.fromTo(speechBox, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
        }
    }

    // 14. Mouse Head Tracking & Hover Detection
    let hoveredCoin = null;
    window.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

        targetHeadRotY = mouseX * 0.42;
        targetHeadRotX = mouseY * 0.24;

        // Hover raycast
        const rect = renderer.domElement.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) {
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const checkObjs = [];
            floatingMeshes.forEach(fg => fg.children.forEach(c => checkObjs.push(c)));

            const intersects = raycaster.intersectObjects(checkObjs);
            if (intersects.length > 0) {
                const parent = intersects[0].object.parent;
                container.style.cursor = 'pointer';
                if (hoveredCoin !== parent) {
                    if (hoveredCoin) gsap.to(hoveredCoin.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
                    hoveredCoin = parent;
                    gsap.to(parent.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.2 });
                }
            } else {
                container.style.cursor = 'grab';
                if (hoveredCoin) {
                    gsap.to(hoveredCoin.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
                    hoveredCoin = null;
                }
            }
        }
    });

    // 15. Smartphone Gyroscope Tilt Integration (DeviceOrientation)
    if (window.DeviceOrientationEvent && isMobile) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                // Tilt gamma [-90, 90], beta [-180, 180]
                const clampGamma = Math.max(-45, Math.min(45, e.gamma));
                const clampBeta = Math.max(0, Math.min(90, e.beta));
                targetHeadRotY = (clampGamma / 45) * 0.45;
                targetHeadRotX = ((clampBeta - 45) / 45) * 0.3;
            }
        }, { passive: true });
    }

    // 16. Auto Blink Cycle
    function triggerBlink() {
        if (isBlinking || !eyeLeft || !eyeRight) return;
        isBlinking = true;
        gsap.to([eyeLeft.scale, eyeRight.scale], {
            y: 0.08,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                isBlinking = false;
                setTimeout(triggerBlink, 2800 + Math.random() * 2500);
            }
        });
    }
    setTimeout(triggerBlink, 2200);

    // 17. Animation Render Loop
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.002;

        // Mascot Gentle Breathing
        mascotGroup.position.y = -0.78 + Math.sin(time) * 0.05;
        if (heldCupGroup) heldCupGroup.position.y = 0.58 + Math.cos(time * 1.4) * 0.035;

        // Head tracking Lerp
        if (headGroup) {
            headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.08;
            headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.08;
        }

        // Orbit Rings Rotation
        if (orbitRingGroup) {
            orbitRingGroup.rotation.y += 0.008;
        }

        // Auto rotate entire group slightly if enabled
        if (autoRotateActive) {
            mascotGroup.rotation.y = Math.sin(time * 0.4) * 0.22;
        }

        // Update floating badges (orbiting & camera billboarding)
        floatingMeshes.forEach(coin => {
            const ud = coin.userData;
            ud.theta += ud.orbitSpeed;

            coin.position.x = Math.sin(ud.theta) * ud.radius;
            coin.position.z = Math.cos(ud.theta) * ud.radius;
            coin.position.y = ud.initialY + Math.sin(time * 0.9 + ud.phase) * 0.1;

            // Make front face camera
            coin.lookAt(camera.position);
        });

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // 18. Responsive Window Resize
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight || 440;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

// Floating leaves background particles
function createMiniFloatingLeaves() {
    const count = 40;
    const leafGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = [];

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 6.5;
        positions[i + 1] = Math.random() * 5.5 - 2.5;
        positions[i + 2] = (Math.random() - 0.5) * 5.5;
        speeds.push(0.008 + Math.random() * 0.014);
    }

    leafGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Crisp round leaf texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#6da763';
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    ctx.fill();
    const leafTexture = new THREE.CanvasTexture(canvas);

    const leafMat = new THREE.PointsMaterial({
        size: 0.18,
        map: leafTexture,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
    });

    const leafPoints = new THREE.Points(leafGeo, leafMat);
    scene.add(leafPoints);

    const prevRender = scene.onBeforeRender;
    scene.onBeforeRender = function () {
        const pos = leafGeo.attributes.position.array;
        let speedIdx = 0;
        for (let i = 1; i < count * 3; i += 3) {
            pos[i] += speeds[speedIdx];
            pos[i - 1] += Math.sin(Date.now() * 0.001 + speedIdx) * 0.004;
            if (pos[i] > 3.2) pos[i] = -2.6;
            speedIdx++;
        }
        leafGeo.attributes.position.needsUpdate = true;
        if (prevRender) prevRender();
    };
}

// --- 2. Certificates & Achievements Gallery & Modal ---
const certificates = [
    {
        img: "img/ai_riser_vietnam_2026.jpg",
        title: "Top 500 Toàn Quốc - AI Riser Vietnam 2026 (Google for Developers)",
        desc: "Bảng vinh danh Top 500 tài năng xuất sắc nhất toàn quốc trong chiến dịch #BuildwithGoogleAI với sứ mệnh 'Vươn mình kiến tạo' do Google for Developers chứng nhận (Tháng 10/2026). Đánh dấu cột mốc quan trọng trong nghiên cứu và ứng dụng trí tuệ nhân tạo.",
        tag: "Google for Developers",
        year: "10/2026",
        category: "google-ai"
    },
    {
        img: "img/google_vibe_coding_2026.png",
        title: "5-Day AI Agents: Intensive Vibe Coding Course (Kaggle & Google)",
        desc: "Chứng nhận quốc tế hoàn thành xuất sắc khóa đào tạo chuyên sâu về xây dựng các hệ sinh thái AI Agents tự động và phương pháp lập trình Vibe Coding với sự đồng hành của Google và Kaggle (30/07/2026).",
        tag: "Google & Kaggle",
        year: "07/2026",
        category: "google-ai"
    },
    {
        img: "img/vinhdanh2026.jpg",
        title: "Vinh danh thành tích học tập xuất sắc 2026",
        desc: "Bảng vinh danh chính thức ghi nhận toàn diện các thành tích học tập xuất sắc và nỗ lực cống hiến vượt bậc của Nguyễn Duy Quang trong suốt năm học 2026.",
        tag: "Vinh danh",
        year: "2026",
        category: "honors"
    },
    {
        img: "img/nhatsteam2026.jpg",
        title: "Giải Nhất STEM KHKT cấp trường 2026",
        desc: "Đoạt giải Nhất cuộc thi Nghiên cứu Khoa học Kỹ thuật (KHKT) kết hợp ngày hội STEM cấp trường năm học 2025 - 2026, khẳng định năng lực ứng dụng công nghệ thực tế.",
        tag: "Giải Nhất STEM",
        year: "2026",
        category: "stem"
    },
    {
        img: "img/giaibakhktcaptp2026.jpg",
        title: "Giải Ba KHKT cấp thành phố Đà Nẵng 2026",
        desc: "Đạt giải Ba chung cuộc tại cuộc thi Khoa học Kỹ thuật học sinh trung học cấp Thành Phố Đà Nẵng năm học 2025-2026 nhờ đề tài khoa học sáng tạo.",
        tag: "Giải Ba Cấp TP",
        year: "2026",
        category: "stem"
    },
    {
        img: "img/giaibacuocthiAI.jpg",
        title: "Giải Ba Hội An Tây AI Challenge 2026",
        desc: "Đoạt giải Ba tại cuộc thi lập trình mô hình và giải pháp trí tuệ nhân tạo lớn 'Chiến binh Kỷ nguyên số Hội An Tây AI Challenge 2026'.",
        tag: "Giải Ba AI",
        year: "2026",
        category: "google-ai"
    },
    {
        img: "img/chungnhansamsung.JPG",
        title: "Chứng nhận Solve for Tomorrow 2026 (Samsung)",
        desc: "Chứng nhận hoàn thành đào tạo kỹ năng tư duy thiết kế và phát triển dự án thực tế do tập đoàn công nghệ Samsung cấp trong khuôn khổ cuộc thi Solve for Tomorrow 2026.",
        tag: "Samsung SFT",
        year: "2026",
        category: "stem"
    },
    {
        img: "img/khuyenkhichhsgtinhoc2026.jpg",
        title: "Giải Khuyến khích HSG Tin học cấp trường 2026",
        desc: "Đạt giải Khuyến khích trong kỳ thi tuyển chọn Học sinh giỏi bộ môn Tin học cấp trường năm học 2025-2026.",
        tag: "Giải KK Tin học",
        year: "2026",
        category: "honors"
    },
    {
        img: "img/khuyenkhichkhktcaptinh.jpg",
        title: "Giải Khuyến khích KHKT cấp trường năm 2025",
        desc: "Giải thưởng ghi nhận nỗ lực sáng tạo đạt Giải Khuyến khích trong cuộc thi Khoa học Kỹ thuật (KHKT) cấp trường tổ chức năm học 2024 - 2025.",
        tag: "Giải KK KHKT",
        year: "2025",
        category: "stem"
    }
];

let currentCertIndex = 0;

function initCertificatesLightbox() {
    const certCards = document.querySelectorAll('.cert-card');
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTag = document.querySelector('.modal-tag');
    const modalYear = document.getElementById('modal-year');
    const modalCounter = document.getElementById('modal-counter');
    const closeBtn = document.getElementById('modal-close-btn');
    const backdrop = document.querySelector('.modal-backdrop');
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');

    if (!modal) return;

    function renderCert(index) {
        currentCertIndex = index;
        const cert = certificates[index];
        if (!cert) return;

        modalImg.src = cert.img;
        modalTitle.textContent = cert.title;
        modalDesc.textContent = cert.desc;
        modalTag.textContent = cert.tag;
        if (modalYear) modalYear.textContent = cert.year;
        if (modalCounter) modalCounter.textContent = `${index + 1} / ${certificates.length}`;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        playPopSound(700, 0.06);
    }

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.getAttribute('data-index'), 10);
            renderCert(idx);
        });
    });

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    if (backdrop) backdrop.onclick = closeModal;

    if (prevBtn) {
        prevBtn.onclick = () => {
            const nextIdx = (currentCertIndex - 1 + certificates.length) % certificates.length;
            renderCert(nextIdx);
        };
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            const nextIdx = (currentCertIndex + 1) % certificates.length;
            renderCert(nextIdx);
        };
    }

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
    });
}

// Category Filter Tabs
function initCertificatesFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.cert-card');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            playPopSound(540, 0.05);

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// --- 3. Matcha Latte Brewing Mini-Game (Mobile Touch & Haptics) ---
function initMatchaGame() {
    const ingredients = {
        matcha: false,
        water: false,
        milk: false,
        sugar: false
    };

    let brewProgress = 0;
    let isStirring = false;
    let totalIngredientsAdded = 0;

    const ingredientBtns = document.querySelectorAll('.ing-btn-cute');
    const cup = document.getElementById('matcha-cup');
    const liquidBase = document.getElementById('liquid-base');
    const liquidFoam = document.getElementById('liquid-foam');
    const brewProgressText = document.getElementById('brew-progress-text');
    const brewProgressBar = document.getElementById('brew-progress-bar');
    const winOverlay = document.getElementById('game-win-overlay');
    const resetBtn = document.getElementById('reset-game-btn');

    if (!cup || ingredientBtns.length === 0) return;

    ingredientBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const ingType = btn.getAttribute('data-ingredient');
            if (ingredients[ingType]) return;

            ingredients[ingType] = true;
            btn.classList.add('added');
            totalIngredientsAdded++;

            // Haptic vibration feedback on supported phones
            if (navigator.vibrate) navigator.vibrate(20);
            playPopSound(480 + totalIngredientsAdded * 100, 0.08);

            gsap.from(btn, { scale: 0.85, duration: 0.3, ease: 'back.out(2)' });

            updateLiquidHeight();
            updateLiquidColor();

            if (totalIngredientsAdded === 4) {
                brewProgressText.textContent = 'Đã đủ nguyên liệu! Hãy giữ và xoay tròn chuột / ngón tay trong cốc để đánh bọt nhé!';
                brewProgressText.style.color = 'var(--matcha-dark)';
                cup.style.cursor = 'pointer';
                setupStirring();
            } else {
                brewProgressText.textContent = `Đã chuẩn bị ${totalIngredientsAdded}/4 nguyên liệu...`;
            }
        });
    });

    function updateLiquidHeight() {
        const fillPercent = (totalIngredientsAdded / 4) * 75;
        if (liquidBase && liquidBase.parentElement) {
            liquidBase.parentElement.style.height = `${fillPercent}%`;
        }
    }

    function updateLiquidColor() {
        if (!liquidBase) return;
        if (ingredients.matcha && !ingredients.water && !ingredients.milk) {
            liquidBase.style.backgroundColor = '#4e7546';
        } else if (ingredients.matcha && ingredients.water && !ingredients.milk) {
            liquidBase.style.backgroundColor = '#5c8f53';
        } else if (ingredients.matcha && ingredients.water && ingredients.milk) {
            liquidBase.style.backgroundColor = '#8ebd85';
        } else if (totalIngredientsAdded === 4) {
            liquidBase.style.backgroundColor = '#99cc90';
        } else if (ingredients.milk && !ingredients.matcha) {
            liquidBase.style.backgroundColor = '#f3faf0';
        } else if (ingredients.water && !ingredients.matcha) {
            liquidBase.style.backgroundColor = '#aed2ff';
        }
    }

    function setupStirring() {
        let lastX = null, lastY = null;

        const handleStirStart = (e) => {
            isStirring = true;
            cup.classList.add('stirring');
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            lastX = clientX;
            lastY = clientY;
        };

        const handleStirMove = (e) => {
            if (!isStirring) return;
            // Prevent page scrolling while touching inside cup
            if (e.cancelable && e.type === 'touchmove') e.preventDefault();

            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            if (lastX !== null && lastY !== null) {
                const dx = clientX - lastX;
                const dy = clientY - lastY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 1.2) {
                    brewProgress += dist * 0.22;
                    brewProgress = Math.min(100, brewProgress);

                    if (brewProgressBar) brewProgressBar.style.width = `${brewProgress}%`;
                    if (brewProgressText) brewProgressText.textContent = `Đang đánh bông bọt kem sữa: ${Math.round(brewProgress)}%`;

                    if (liquidFoam && brewProgress > 25) {
                        liquidFoam.style.opacity = (brewProgress - 25) / 75;
                    }

                    if (brewProgress >= 100) {
                        finishBrewing();
                    }
                }
            }
            lastX = clientX;
            lastY = clientY;
        };

        const handleStirEnd = () => {
            isStirring = false;
            cup.classList.remove('stirring');
            lastX = null;
            lastY = null;
        };

        cup.addEventListener('mousedown', handleStirStart);
        window.addEventListener('mousemove', handleStirMove);
        window.addEventListener('mouseup', handleStirEnd);

        cup.addEventListener('touchstart', handleStirStart, { passive: false });
        window.addEventListener('touchmove', handleStirMove, { passive: false });
        window.addEventListener('touchend', handleStirEnd);
    }

    function finishBrewing() {
        if (brewProgressText) {
            brewProgressText.textContent = 'Hoàn thành! Ly Matcha Latte thơm ngậy đỉnh cao! 🍵';
            brewProgressText.style.color = 'var(--matcha-dark)';
        }

        playCelebrationChime();
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);

        setTimeout(() => {
            if (winOverlay) winOverlay.classList.remove('hidden');
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 140,
                    spread: 85,
                    origin: { y: 0.65 },
                    colors: ['#6da763', '#ffb7b2', '#4285f4', '#ffeaa7', '#fafef9']
                });
            }
        }, 500);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            brewProgress = 0;
            isStirring = false;
            totalIngredientsAdded = 0;
            for (let k in ingredients) ingredients[k] = false;

            ingredientBtns.forEach(btn => btn.classList.remove('added'));
            if (liquidBase && liquidBase.parentElement) liquidBase.parentElement.style.height = '0%';
            if (liquidFoam) liquidFoam.style.opacity = 0;
            if (brewProgressBar) brewProgressBar.style.width = '0%';
            if (brewProgressText) {
                brewProgressText.textContent = 'Thêm đầy đủ 4 nguyên liệu vào cốc...';
                brewProgressText.style.color = 'var(--text-muted)';
            }
            cup.style.cursor = 'default';
            if (winOverlay) winOverlay.classList.add('hidden');
            playPopSound(500, 0.08);
        });
    }
}

// --- 4. Mobile Bottom Dock Scroll Spy ---
function initMobileBottomDock() {
    const dockButtons = document.querySelectorAll('.dock-btn');
    if (!dockButtons.length) return;

    dockButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dockButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            playPopSound(600, 0.05);
        });
    });

    const sections = document.querySelectorAll('section, footer');
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            dockButtons.forEach(btn => {
                const target = btn.getAttribute('data-target');
                btn.classList.toggle('active', target === currentSection);
            });
        }
    }, { passive: true });
}

// --- 5. GSAP Entrance Animations ---
function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.from('.hero-pill-badge', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)'
    });

    gsap.from('.hero-title', {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
    });

    gsap.from('.hero-nickname', {
        x: -25,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: 'power3.out'
    });

    gsap.from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.trophy-bento-card', {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        delay: 0.3,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.from('.contact-circle-btn', {
        opacity: 0,
        scale: 0.7,
        stagger: 0.06,
        delay: 0.45,
        duration: 0.7,
        ease: 'back.out(2)'
    });

    gsap.from('.skills-dashboard-cute', {
        opacity: 0,
        y: 25,
        delay: 0.5,
        duration: 0.9,
        ease: 'power2.out'
    });

    gsap.from('.mascot-box', {
        scale: 0.9,
        opacity: 0,
        delay: 0.3,
        duration: 1.1,
        ease: 'elastic.out(1, 0.75)'
    });
}
