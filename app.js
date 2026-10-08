// ==========================================================================
// Nguyễn Duy Quang - Matcha Cute Profile 3D Application
// Enhanced with Google AI Achievements, Three.js 3D & Mobile Optimization
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initSoundSystem();
    initContactModalAndToast();
    initThreeJSMascot();
    initCertificatesLightbox();
    initCertificatesFilter();
    initAchievementReactions();
    initMatchaGame();
    initMobileBottomDock();
    initGSAPAnimations();
});

// --- Sound FX Generator (Pure Web Audio API - Zero External Dependencies) ---
let audioCtx = null;
let soundEnabled = true;

const soundOnSvg = '<svg class="icon-inline" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
const soundOffSvg = '<svg class="icon-inline" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';

function initSoundSystem() {
    const toggleBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');

    if (toggleBtn && soundIcon) {
        soundIcon.innerHTML = soundOnSvg;
        toggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundIcon.innerHTML = soundEnabled ? soundOnSvg : soundOffSvg;
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

// --- 1. Contact Options Modal & Toast Notification System ---
function initContactModalAndToast() {
    const contactModal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('contact-modal-close-btn');
    const backdrop = document.getElementById('contact-modal-backdrop');
    const btnEmail = document.getElementById('btn-contact-email');
    const btnPhone = document.getElementById('btn-contact-phone');
    const copyEmailBtn = document.getElementById('btn-copy-email');
    const copyPhoneBtn = document.getElementById('btn-copy-phone');
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');

    let toastTimer = null;
    function showToast(text) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = text;
        toast.classList.remove('hidden');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 2600);
    }

    function openModal() {
        if (!contactModal) return;
        contactModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        playPopSound(660, 0.06);
    }

    function closeModal() {
        if (!contactModal) return;
        contactModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (btnEmail) btnEmail.addEventListener('click', openModal);
    if (btnPhone) btnPhone.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Copy Email to Clipboard
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = 'poiairo4628@gmail.com';
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const ta = document.createElement('textarea');
                    ta.value = email;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                }
                showToast(`✓ Đã sao chép email: ${email}`);
                playPopSound(820, 0.08);
            } catch (err) {
                showToast(`Email: ${email}`);
            }
        });
    }

    // Copy Phone to Clipboard
    if (copyPhoneBtn) {
        copyPhoneBtn.addEventListener('click', async () => {
            const phone = '0795 277 227';
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText('0795277227');
                } else {
                    const ta = document.createElement('textarea');
                    ta.value = '0795277227';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                }
                showToast(`✓ Đã sao chép số: ${phone}`);
                playPopSound(820, 0.08);
            } catch (err) {
                showToast(`Hotline: ${phone}`);
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal && !contactModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// --- 2. Three.js 3D Matcha Tabby Cat & Coding Cosmos Badges ---
let scene, camera, renderer, controls;
let mascotGroup, headGroup, eyeLeft, eyeRight, heldCupGroup, tailGroup;
let orbitRingGroup;
let targetHeadRotY = 0, targetHeadRotX = 0;
let isBlinking = false;
let autoRotateActive = true;
let floatingMeshes = [];

// Coding Cosmos: Floating 3D Planetary Badges (IDEs, Languages & Google AI)
const codingCosmosBadges = [
    {
        type: 'award',
        name: 'Top 500 AI Riser Vietnam',
        orbitSpeed: 0.0035,
        radius: 2.2,
        inclination: 0.15,
        yOffset: 0.85,
        catSpeech: 'Meo! Thành tích Top 500 AI Riser Việt Nam của Google nè! Tự hào về Quang ghê luôn á! 🏆🐾'
    },
    {
        type: 'award',
        name: '5-Day Vibe Coding Kaggle',
        orbitSpeed: -0.0032,
        radius: 2.1,
        inclination: -0.25,
        yOffset: 0.45,
        catSpeech: 'Meo! Chứng nhận 5-Day Vibe Coding Kaggle & Google siêu cháy! Xây dựng AI Agents đỉnh chóp! ⚡🐾'
    },
    {
        type: 'social',
        name: 'LinkedIn',
        orbitSpeed: 0.0033,
        radius: 2.4,
        inclination: -0.18,
        yOffset: -0.15,
        url: 'https://www.linkedin.com/in/nguyenduyquangdev/',
        catSpeech: 'Meo! Ghé thăm LinkedIn của Quang để kết nối học thuật và cơ hội hợp tác nhé! 💼🐾'
    },
    {
        type: 'ide',
        name: 'VS Code',
        orbitSpeed: 0.0028,
        radius: 2.9,
        inclination: 0.35,
        yOffset: 0.95,
        catSpeech: 'Meo! VS Code là IDE ruột của Quang để build dự án AI, React & hệ thống 3D Web! 💻🐾'
    },
    {
        type: 'language',
        name: 'Python',
        orbitSpeed: -0.0025,
        radius: 2.7,
        inclination: -0.15,
        yOffset: 0.2,
        catSpeech: 'Meo! Python dùng để train Deep Learning, PyTorch & xây dựng Agentic AI! 🐍🐾'
    },
    {
        type: 'framework',
        name: 'React & Three.js',
        orbitSpeed: 0.003,
        radius: 3.1,
        inclination: 0.2,
        yOffset: -0.2,
        catSpeech: 'Meo! React và Three.js là bộ đôi giúp website này có giao diện 3D sống động đó! ⚛️🐾'
    },
    {
        type: 'language',
        name: 'TypeScript',
        orbitSpeed: -0.0028,
        radius: 2.5,
        inclination: 0.4,
        yOffset: -0.4,
        catSpeech: 'Meo! TypeScript gõ code chuẩn chỉnh, an toàn kiểu dữ liệu và không lo bug! 🛡️🐾'
    },
    {
        type: 'framework',
        name: 'PyTorch AI',
        orbitSpeed: 0.0026,
        radius: 2.85,
        inclination: -0.3,
        yOffset: 0.6,
        catSpeech: 'Meo! PyTorch là vũ khí huấn luyện Neural Network và mô hình học sâu của Quang! 🔥🐾'
    },
    {
        type: 'tool',
        name: 'Docker',
        orbitSpeed: -0.003,
        radius: 3.2,
        inclination: 0.1,
        yOffset: 0.1,
        catSpeech: 'Meo! Docker đóng gói môi trường chuẩn DevOps, chạy đồng nhất mọi nơi! 🐳🐾'
    },
    {
        type: 'database',
        name: 'SQL Database',
        orbitSpeed: 0.0024,
        radius: 2.6,
        inclination: -0.2,
        yOffset: -0.35,
        catSpeech: 'Meo! Thiết kế cơ sở dữ liệu quan hệ và tối ưu truy vấn SQL đỉnh cao! 🐬🐾'
    },
    {
        type: 'tool',
        name: 'GitHub',
        orbitSpeed: -0.0022,
        radius: 3.0,
        inclination: -0.35,
        yOffset: 0.75,
        url: 'https://github.com/Wothing0406',
        catSpeech: 'Meo! Toàn bộ mã nguồn dự án được lưu trữ và cập nhật trên GitHub! 🚀🐾'
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

    if (!isWebGLAvailable()) {
        if (loaderEl) loaderEl.classList.add('fade-out');
        if (fallbackEl) fallbackEl.classList.remove('hidden');
        return;
    }

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 480;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.45, isMobile ? 9.8 : 8.6);

    // 3. WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls (Configured to never intercept vertical scrolling on mobile)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2.8;
    controls.maxPolarAngle = Math.PI / 1.75;
    controls.minAzimuthAngle = -Math.PI / 2.2;
    controls.maxAzimuthAngle = Math.PI / 2.2;
    controls.autoRotate = false;

    // 5. Studio PBR Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xf4faf0, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaeb, 0.9);
    dirLight.position.set(6, 9, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.75);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xa7f3d0, 1.1, 12);
    pointLight.position.set(-2, -1.2, 3.5);
    scene.add(pointLight);

    // 6. 3D Matcha Tabby Cat Model (Mèo Mướp Matcha Cầm Ly Latte)
    mascotGroup = new THREE.Group();
    mascotGroup.position.y = -0.75;
    scene.add(mascotGroup);

    // Tabby Materials
    const tabbyBaseMat = new THREE.MeshStandardMaterial({
        color: 0x8da87c, // Matcha tea fur base
        roughness: 0.58,
        metalness: 0.06
    });

    const tabbyStripeMat = new THREE.MeshStandardMaterial({
        color: 0x3d5c2e, // Deep olive tea green tabby stripe
        roughness: 0.5,
        metalness: 0.08
    });

    const creamBellyMat = new THREE.MeshStandardMaterial({
        color: 0xf3faef, // Soft cream fur
        roughness: 0.65
    });

    const innerEarPinkMat = new THREE.MeshStandardMaterial({
        color: 0xffb8b4, // Pastel pink
        roughness: 0.72
    });

    const nosePinkMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6, // Rosy button nose
        roughness: 0.35
    });

    const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x0f2413, // Deep glossy dark pupil
        roughness: 0.1,
        metalness: 0.2
    });

    const eyeIrisMat = new THREE.MeshStandardMaterial({
        color: 0x22c55e, // Emerald anime cat iris
        roughness: 0.2
    });

    const ceramicCupMat = new THREE.MeshStandardMaterial({
        color: 0xfdfdfd,
        roughness: 0.25,
        metalness: 0.05
    });

    const matchaLiquidMat = new THREE.MeshStandardMaterial({
        color: 0x4d8c3f,
        roughness: 0.35,
        metalness: 0.1
    });

    const latteArtMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.8
    });

    // --- Cat Body (Chubby seated feline body) ---
    const bodyGeo = new THREE.CylinderGeometry(0.85, 1.25, 1.85, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, tabbyBaseMat);
    bodyMesh.position.y = 0.45;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    mascotGroup.add(bodyMesh);

    // Cream Belly Patch
    const bellyGeo = new THREE.SphereGeometry(0.88, 24, 24);
    const bellyMesh = new THREE.Mesh(bellyGeo, creamBellyMat);
    bellyMesh.position.set(0, 0.42, 0.45);
    bellyMesh.scale.set(0.9, 1.15, 0.45);
    mascotGroup.add(bellyMesh);

    // Tabby Stripes on Back & Sides (Curved segments)
    [-0.1, 0.35, 0.75].forEach((stripeY, sIdx) => {
        const stripeGeo = new THREE.TorusGeometry(1.08 - sIdx * 0.06, 0.065, 8, 24, Math.PI * 1.1);
        const stripe = new THREE.Mesh(stripeGeo, tabbyStripeMat);
        stripe.position.set(0, stripeY, 0.08);
        stripe.rotation.x = Math.PI / 2;
        stripe.rotation.z = Math.PI * 0.95;
        mascotGroup.add(stripe);
    });

    // Seated Haunches & Back Paws
    const haunchGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const haunchLeft = new THREE.Mesh(haunchGeo, tabbyBaseMat);
    haunchLeft.position.set(-0.85, -0.32, 0.15);
    haunchLeft.scale.set(0.9, 0.9, 1.2);
    mascotGroup.add(haunchLeft);

    const pawLeft = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), creamBellyMat);
    pawLeft.position.set(-0.82, -0.48, 0.65);
    pawLeft.scale.set(1, 0.7, 1.3);
    mascotGroup.add(pawLeft);

    const haunchRight = haunchLeft.clone();
    haunchRight.position.x = 0.85;
    mascotGroup.add(haunchRight);

    const pawRight = pawLeft.clone();
    pawRight.position.x = 0.82;
    mascotGroup.add(pawRight);

    // Front Paws (Holding the Matcha Latte Cup in front)
    const frontPawGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const frontPawLeft = new THREE.Mesh(frontPawGeo, creamBellyMat);
    frontPawLeft.position.set(-0.35, 0.58, 0.92);
    frontPawLeft.scale.set(1.1, 0.85, 1.3);
    mascotGroup.add(frontPawLeft);

    const frontPawRight = frontPawLeft.clone();
    frontPawRight.position.x = 0.35;
    mascotGroup.add(frontPawRight);

    // --- Cat Head Group ---
    headGroup = new THREE.Group();
    headGroup.position.set(0, 1.68, 0);
    mascotGroup.add(headGroup);

    // Head Base (Chubby anime cat head)
    const headGeo = new THREE.SphereGeometry(1.18, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, tabbyBaseMat);
    headMesh.scale.set(1.16, 0.96, 1.05);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Tabby "M" Marking on Forehead
    const mStripeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.42, 8);
    const centerM = new THREE.Mesh(mStripeGeo, tabbyStripeMat);
    centerM.position.set(0, 0.52, 1.05);
    centerM.rotation.x = -0.35;
    headGroup.add(centerM);

    const leftM1 = new THREE.Mesh(mStripeGeo, tabbyStripeMat);
    leftM1.position.set(-0.24, 0.5, 1.02);
    leftM1.rotation.set(-0.35, 0, -0.35);
    headGroup.add(leftM1);

    const leftM2 = new THREE.Mesh(mStripeGeo, tabbyStripeMat);
    leftM2.position.set(-0.44, 0.46, 0.96);
    leftM2.rotation.set(-0.35, 0, 0.35);
    headGroup.add(leftM2);

    const rightM1 = leftM1.clone();
    rightM1.position.x = 0.24;
    rightM1.rotation.z = 0.35;
    headGroup.add(rightM1);

    const rightM2 = leftM2.clone();
    rightM2.position.x = 0.44;
    rightM2.rotation.z = -0.35;
    headGroup.add(rightM2);

    // Cheek Stripes
    [-0.05, -0.22].forEach((stripeY) => {
        const cheekStripeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.32, 8);
        const csL = new THREE.Mesh(cheekStripeGeo, tabbyStripeMat);
        csL.position.set(-0.95, stripeY, 0.6);
        csL.rotation.set(0, 0.8, Math.PI / 2);
        headGroup.add(csL);

        const csR = new THREE.Mesh(cheekStripeGeo, tabbyStripeMat);
        csR.position.set(0.95, stripeY, 0.6);
        csR.rotation.set(0, -0.8, -Math.PI / 2);
        headGroup.add(csR);
    });

    // Cat Triangular Ears
    const earGeo = new THREE.ConeGeometry(0.44, 0.68, 16);
    const earLeft = new THREE.Mesh(earGeo, tabbyBaseMat);
    earLeft.position.set(-0.76, 0.98, 0.05);
    earLeft.rotation.set(-0.15, 0.15, -0.38);
    headGroup.add(earLeft);

    const earInnerLeft = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 16), innerEarPinkMat);
    earInnerLeft.position.set(-0.74, 0.95, 0.16);
    earInnerLeft.rotation.set(-0.15, 0.15, -0.38);
    earInnerLeft.scale.z = 0.5;
    headGroup.add(earInnerLeft);

    const earRight = earLeft.clone();
    earRight.position.x = 0.76;
    earRight.rotation.set(-0.15, -0.15, 0.38);
    headGroup.add(earRight);

    const earInnerRight = earInnerLeft.clone();
    earInnerRight.position.x = 0.74;
    earInnerRight.rotation.set(-0.15, -0.15, 0.38);
    headGroup.add(earInnerRight);

    // Feline Eyes (Emerald Iris + Dark Pupil + Anime Sparkles)
    const eyeIrisGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const eyeIrisLeft = new THREE.Mesh(eyeIrisGeo, eyeIrisMat);
    eyeIrisLeft.position.set(-0.44, 0.14, 0.98);
    eyeIrisLeft.scale.set(1, 1.15, 0.35);
    headGroup.add(eyeIrisLeft);

    eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), eyeMat);
    eyeLeft.position.set(-0.44, 0.14, 1.05);
    eyeLeft.scale.set(0.85, 1.25, 0.35);
    headGroup.add(eyeLeft);

    const eyeIrisRight = eyeIrisLeft.clone();
    eyeIrisRight.position.x = 0.44;
    headGroup.add(eyeIrisRight);

    eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.44;
    headGroup.add(eyeRight);

    // Bright White Sparkle Highlights
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sparkBig = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), sparkMat);
    sparkBig.position.set(-0.47, 0.19, 1.1);
    headGroup.add(sparkBig);

    const sparkSmall = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), sparkMat);
    sparkSmall.position.set(-0.41, 0.09, 1.1);
    headGroup.add(sparkSmall);

    const sparkBigR = sparkBig.clone();
    sparkBigR.position.x = 0.41;
    headGroup.add(sparkBigR);

    const sparkSmallR = sparkSmall.clone();
    sparkSmallR.position.x = 0.47;
    headGroup.add(sparkSmallR);

    // Feline Muzzle / Snout (:3 mouth)
    const muzzleGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const muzzleL = new THREE.Mesh(muzzleGeo, creamBellyMat);
    muzzleL.position.set(-0.16, -0.16, 1.02);
    muzzleL.scale.set(1, 0.75, 0.65);
    headGroup.add(muzzleL);

    const muzzleR = muzzleL.clone();
    muzzleR.position.x = 0.16;
    headGroup.add(muzzleR);

    // Cute Pink Button Nose
    const noseGeo = new THREE.ConeGeometry(0.08, 0.09, 3);
    const noseMesh = new THREE.Mesh(noseGeo, nosePinkMat);
    noseMesh.position.set(0, -0.06, 1.15);
    noseMesh.rotation.z = Math.PI;
    noseMesh.rotation.x = 0.2;
    headGroup.add(noseMesh);

    // 6 Feline Whiskers (3 on each side)
    const whiskerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.08, -0.14, -0.2].forEach((wY, wIdx) => {
        const whiskerGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.42, 6);
        const wL = new THREE.Mesh(whiskerGeo, whiskerMat);
        wL.position.set(-0.42, wY, 1.04);
        wL.rotation.z = Math.PI / 2 + (wIdx - 1) * 0.22;
        headGroup.add(wL);

        const wR = new THREE.Mesh(whiskerGeo, whiskerMat);
        wR.position.set(0.42, wY, 1.04);
        wR.rotation.z = -(Math.PI / 2 + (wIdx - 1) * 0.22);
        headGroup.add(wR);
    });

    // Rosy Blush Cheeks
    const blushGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const blushL = new THREE.Mesh(blushGeo, innerEarPinkMat);
    blushL.position.set(-0.68, -0.08, 0.95);
    blushL.scale.set(1, 0.6, 0.2);
    headGroup.add(blushL);

    const blushR = blushL.clone();
    blushR.position.x = 0.68;
    headGroup.add(blushR);

    // --- Swishing Tabby Tail (Animated in render loop) ---
    tailGroup = new THREE.Group();
    tailGroup.position.set(0, -0.32, -0.65);
    mascotGroup.add(tailGroup);

    const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.2, 0.3, -0.4),
        new THREE.Vector3(0.45, 0.75, -0.3),
        new THREE.Vector3(0.35, 1.1, -0.05)
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.13, 8, false);
    const tailMesh = new THREE.Mesh(tailGeo, tabbyBaseMat);
    tailGroup.add(tailMesh);

    // Tabby dark tip on tail
    const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), tabbyStripeMat);
    tailTip.position.set(0.35, 1.1, -0.05);
    tailGroup.add(tailTip);

    // --- 3D Matcha Latte Cup held between paws ---
    heldCupGroup = new THREE.Group();
    heldCupGroup.position.set(0, 0.58, 0.88);
    mascotGroup.add(heldCupGroup);

    // Ceramic Matcha Cup
    const cupGeo = new THREE.CylinderGeometry(0.36, 0.28, 0.68, 24);
    const cupMesh = new THREE.Mesh(cupGeo, ceramicCupMat);
    cupMesh.castShadow = true;
    heldCupGroup.add(cupMesh);

    // Cup Sleeve / Band (Tea green band)
    const bandGeo = new THREE.CylinderGeometry(0.37, 0.33, 0.26, 24);
    const bandMesh = new THREE.Mesh(bandGeo, tabbyStripeMat);
    heldCupGroup.add(bandMesh);

    // Steaming Matcha Liquid
    const liquidGeo = new THREE.CylinderGeometry(0.34, 0.3, 0.1, 24);
    const liquidMesh = new THREE.Mesh(liquidGeo, matchaLiquidMat);
    liquidMesh.position.y = 0.28;
    heldCupGroup.add(liquidMesh);

    // Latte Art Foam (Cute clover / heart on top)
    const foamGeo = new THREE.CircleGeometry(0.18, 16);
    const foamMesh = new THREE.Mesh(foamGeo, latteArtMat);
    foamMesh.rotation.x = -Math.PI / 2;
    foamMesh.position.y = 0.34;
    heldCupGroup.add(foamMesh);

    // Cute Straw / Stirrer
    const strawGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.62, 8);
    const strawMesh = new THREE.Mesh(strawGeo, innerEarPinkMat);
    strawMesh.position.set(0.12, 0.45, 0.05);
    strawMesh.rotation.z = -0.22;
    heldCupGroup.add(strawMesh);

    // 7. Holographic Gyro Orbit Rings (Around Cat Base)
    orbitRingGroup = new THREE.Group();
    orbitRingGroup.position.y = 0.4;
    mascotGroup.add(orbitRingGroup);

    const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0x6ee7b7,
        transparent: true,
        opacity: 0.45,
        wireframe: true
    });
    const ringMesh1 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.02, 8, 48), ringMat1);
    ringMesh1.rotation.x = Math.PI / 2.3;
    ringMesh1.rotation.y = 0.2;
    orbitRingGroup.add(ringMesh1);

    const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });
    const ringMesh2 = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.02, 8, 48), ringMat2);
    ringMesh2.rotation.x = Math.PI / 1.8;
    ringMesh2.rotation.z = -0.3;
    orbitRingGroup.add(ringMesh2);

    // Floor Soft Shadow
    const shadowFloor = new THREE.Mesh(
        new THREE.RingGeometry(0.01, 1.45, 32),
        new THREE.MeshBasicMaterial({ color: 0xc6e4c3, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.44;
    mascotGroup.add(shadowFloor);

    // 8. 3D Coding Cosmos Orbiting Badges (Canvas-Generated 256x256 Textures - Zero Black Texture Guarantee)
    function createCosmicBadgeTexture(badge) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) return new THREE.CanvasTexture(canvas);

        const cx = 128;
        const cy = 128;
        const r = 118;

        // Custom Radiant Color Scheme for Each Badge
        let gradStart = '#1e293b';
        let gradEnd = '#0f172a';
        let rimColor = '#38bdf8';
        let label = badge.name;

        if (badge.name.includes('Google') || badge.name.includes('AI Riser')) {
            gradStart = '#ffffff';
            gradEnd = '#e0f2fe';
            rimColor = '#4285f4';
            label = 'GOOGLE AI';
        } else if (badge.name.includes('Kaggle')) {
            gradStart = '#0284c7';
            gradEnd = '#082f49';
            rimColor = '#38bdf8';
            label = 'KAGGLE';
        } else if (badge.name.includes('LinkedIn')) {
            gradStart = '#0a66c2';
            gradEnd = '#073c72';
            rimColor = '#60a5fa';
            label = 'LINKEDIN';
        } else if (badge.name.includes('VS Code')) {
            gradStart = '#007acc';
            gradEnd = '#00284d';
            rimColor = '#38bdf8';
            label = 'VS CODE';
        } else if (badge.name.includes('Python')) {
            gradStart = '#1e3a5f';
            gradEnd = '#0b192c';
            rimColor = '#facc15';
            label = 'PYTHON';
        } else if (badge.name.includes('React')) {
            gradStart = '#1e293b';
            gradEnd = '#0f172a';
            rimColor = '#61dafb';
            label = 'REACT 3D';
        } else if (badge.name.includes('TypeScript')) {
            gradStart = '#1d4ed8';
            gradEnd = '#172554';
            rimColor = '#60a5fa';
            label = 'TYPESCRIPT';
        } else if (badge.name.includes('PyTorch')) {
            gradStart = '#991b1b';
            gradEnd = '#450a0a';
            rimColor = '#f97316';
            label = 'PYTORCH';
        } else if (badge.name.includes('Docker')) {
            gradStart = '#0284c7';
            gradEnd = '#082f49';
            rimColor = '#38bdf8';
            label = 'DOCKER';
        } else if (badge.name.includes('SQL')) {
            gradStart = '#047857';
            gradEnd = '#064e3b';
            rimColor = '#34d399';
            label = 'SQL DB';
        } else if (badge.name.includes('GitHub')) {
            gradStart = '#24292e';
            gradEnd = '#0f1419';
            rimColor = '#e2e8f0';
            label = 'GITHUB';
        }

        // 1. Draw Vibrant Base Disc with Soft Gradient
        const bgGrad = ctx.createRadialGradient(cx, cy - 25, 20, cx, cy, r);
        bgGrad.addColorStop(0, gradStart);
        bgGrad.addColorStop(1, gradEnd);

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = bgGrad;
        ctx.fill();

        // 2. Beveled Metallic Ring
        ctx.lineWidth = 10;
        ctx.strokeStyle = rimColor;
        ctx.stroke();

        // Inner glowing border
        ctx.beginPath();
        ctx.arc(cx, cy, r - 12, 0, Math.PI * 2);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.stroke();

        // 3. Draw High-Contrast Vector Emblem
        ctx.save();
        ctx.translate(cx, cy - 14);

        if (badge.name.includes('Google') || badge.name.includes('AI Riser')) {
            // Google 4-color Ring & Horizontal Bar
            ctx.lineWidth = 18;
            // Blue
            ctx.beginPath();
            ctx.arc(0, 0, 42, -Math.PI * 0.25, Math.PI * 0.25);
            ctx.strokeStyle = '#4285f4';
            ctx.stroke();
            // Green
            ctx.beginPath();
            ctx.arc(0, 0, 42, Math.PI * 0.25, Math.PI * 0.75);
            ctx.strokeStyle = '#34a853';
            ctx.stroke();
            // Yellow
            ctx.beginPath();
            ctx.arc(0, 0, 42, Math.PI * 0.75, Math.PI * 1.25);
            ctx.strokeStyle = '#fbbc05';
            ctx.stroke();
            // Red
            ctx.beginPath();
            ctx.arc(0, 0, 42, Math.PI * 1.25, Math.PI * 1.75);
            ctx.strokeStyle = '#ea4335';
            ctx.stroke();
            // Center Bar
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(44, 0);
            ctx.lineWidth = 18;
            ctx.strokeStyle = '#4285f4';
            ctx.stroke();
        } else if (badge.name.includes('Kaggle')) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 84px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('K', 0, 4);
        } else if (badge.name.includes('LinkedIn')) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 78px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('in', 0, 2);
        } else if (badge.name.includes('VS Code')) {
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(-36, -36);
            ctx.lineTo(38, -44);
            ctx.lineTo(16, -16);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#0ea5e9';
            ctx.beginPath();
            ctx.moveTo(-36, 36);
            ctx.lineTo(38, 44);
            ctx.lineTo(16, 16);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(38, -44);
            ctx.lineTo(38, 44);
            ctx.lineTo(10, 0);
            ctx.closePath();
            ctx.fill();
        } else if (badge.name.includes('Python')) {
            ctx.fillStyle = '#facc15';
            ctx.font = '900 68px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Py', 0, 2);
        } else if (badge.name.includes('React')) {
            ctx.strokeStyle = '#61dafb';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.ellipse(0, 0, 50, 18, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, 0, 50, 18, Math.PI / 3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, 0, 50, 18, -Math.PI / 3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#61dafb';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
        } else if (badge.name.includes('TypeScript')) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 64px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('TS', 0, 4);
        } else if (badge.name.includes('PyTorch')) {
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(0, 10, 32, 0, Math.PI);
            ctx.lineTo(-24, -22);
            ctx.lineTo(0, -44);
            ctx.lineTo(14, -20);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(18, -32, 7, 0, Math.PI * 2);
            ctx.fill();
        } else if (badge.name.includes('Docker')) {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(-34, -22, 18, 14);
            ctx.fillRect(-12, -22, 18, 14);
            ctx.fillRect(10, -22, 18, 14);
            ctx.fillRect(-23, -40, 18, 14);
            ctx.fillRect(-1, -40, 18, 14);
            ctx.beginPath();
            ctx.arc(0, 12, 42, 0, Math.PI);
            ctx.lineTo(46, 12);
            ctx.lineTo(50, -4);
            ctx.closePath();
            ctx.fill();
        } else if (badge.name.includes('SQL')) {
            ctx.fillStyle = '#34d399';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.5;
            for (let dy of [-22, 2, 26]) {
                ctx.beginPath();
                ctx.ellipse(0, dy, 38, 13, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
        } else if (badge.name.includes('GitHub')) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 68px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Git', 0, 2);
        } else {
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(0, 0, 28, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 4. Crisp White Label on bottom
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 23px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 8;
        ctx.fillText(label, cx, cy + 82);

        const canvasTexture = new THREE.CanvasTexture(canvas);
        canvasTexture.needsUpdate = true;
        return canvasTexture;
    }

    const coinR = isMobile ? 0.30 : 0.34;
    const badgeCoinGeo = new THREE.CylinderGeometry(coinR, coinR, 0.06, 32);
    const coinRimMatGold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.75, roughness: 0.25, emissive: 0x452200 });
    const coinRimMatTech = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.75, roughness: 0.25, emissive: 0x032742 });
    const coinRimMatGreen = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.75, roughness: 0.25, emissive: 0x023620 });

    const orbitRadiusX = isMobile ? 3.3 : 3.8;
    const orbitRadiusZ = isMobile ? 2.1 : 2.5;

    codingCosmosBadges.forEach((badge, i) => {
        const isAward = badge.type === 'award';
        const isIDE = badge.type === 'ide' || badge.type === 'social';

        const coinGroup = new THREE.Group();

        // Metallic Rim
        const rimMesh = new THREE.Mesh(
            badgeCoinGeo,
            isAward ? coinRimMatGold : (isIDE ? coinRimMatTech : coinRimMatGreen)
        );
        rimMesh.rotation.x = Math.PI / 2;
        coinGroup.add(rimMesh);

        // Canvas-Generated Texture (Zero black textures, 100% reliable)
        const badgeTexture = createCosmicBadgeTexture(badge);

        // Front Face
        const frontMesh = new THREE.Mesh(
            new THREE.CircleGeometry(coinR * 0.92, 32),
            new THREE.MeshBasicMaterial({ map: badgeTexture, side: THREE.FrontSide })
        );
        frontMesh.position.z = 0.035;
        coinGroup.add(frontMesh);

        // Back Face (Textured on both sides so coin is never dark when rotating!)
        const backMesh = new THREE.Mesh(
            new THREE.CircleGeometry(coinR * 0.92, 32),
            new THREE.MeshBasicMaterial({ map: badgeTexture, side: THREE.FrontSide })
        );
        backMesh.position.z = -0.035;
        backMesh.rotation.y = Math.PI;
        coinGroup.add(backMesh);

        const total = codingCosmosBadges.length;
        const initialTheta = (i / total) * Math.PI * 2;

        coinGroup.position.set(
            Math.sin(initialTheta) * orbitRadiusX,
            -0.2 - Math.cos(initialTheta) * 0.65,
            Math.cos(initialTheta) * orbitRadiusZ
        );

        coinGroup.userData = {
            type: 'cosmos_badge',
            info: badge,
            radiusX: orbitRadiusX,
            radiusZ: orbitRadiusZ,
            theta: initialTheta,
            orbitSpeed: badge.orbitSpeed * 0.8,
            phase: i * 0.9
        };

        scene.add(coinGroup);
        floatingMeshes.push(coinGroup);
    });

    // 9. Floating Leaves / Stardust Particles in 3D Space
    createMiniFloatingLeaves();

    // Fade out 3D Loader
    setTimeout(() => {
        if (loaderEl) loaderEl.classList.add('fade-out');
    }, 450);

    // 10. Raycasting Click / Tap Handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function handleInteractionClick(clientX, clientY) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const checkObjects = [];
        floatingMeshes.forEach(fg => fg.children.forEach(c => checkObjects.push(c)));
        checkObjects.push(headMesh, bodyMesh);

        const intersects = raycaster.intersectObjects(checkObjects);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            const parentCoin = hit.parent && hit.parent.userData && hit.parent.userData.type === 'cosmos_badge' ? hit.parent : null;

            if (parentCoin) {
                const info = parentCoin.userData.info;
                playPopSound(800, 0.1);

                // Spin badge
                gsap.to(parentCoin.rotation, {
                    y: parentCoin.rotation.y + Math.PI * 2,
                    duration: 0.65,
                    ease: 'power2.inOut'
                });
                gsap.to(parentCoin.scale, {
                    x: 1.35, y: 1.35, z: 1.35,
                    duration: 0.2, yoyo: true, repeat: 1
                });

                // Cat joyful reaction & speech
                setSpeechBubble(info.catSpeech);
                gsap.to(mascotGroup.position, {
                    y: -0.3, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out'
                });
                if (headGroup) {
                    gsap.to(headGroup.rotation, {
                        z: 0.22, duration: 0.18, yoyo: true, repeat: 1
                    });
                }

                // If badge has link (e.g. LinkedIn, GitHub), open on click
                if (info.url) {
                    setTimeout(() => {
                        window.open(info.url, '_blank');
                    }, 500);
                }
            } else {
                // Clicked Tabby Cat itself!
                playPopSound(500, 0.1);
                setSpeechBubble('Meo meo! Bạn vừa nựng má chú mèo mướp nè! 🐾 Chạm các biểu tượng lập trình bay quanh để xem vũ trụ công nghệ của Quang nha!');
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

    // Touch tap handling for mobile
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
            if (dx < 10 && dy < 10) {
                handleInteractionClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
        }
    }, { passive: true });

    // 11. Mouse Head Tracking & Hover Detection
    let hoveredCoin = null;
    window.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

        targetHeadRotY = mouseX * 0.42;
        targetHeadRotX = mouseY * 0.24;

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

    // 12. Smartphone Gyroscope Tilt Integration
    if (window.DeviceOrientationEvent && isMobile) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                const clampGamma = Math.max(-45, Math.min(45, e.gamma));
                const clampBeta = Math.max(0, Math.min(90, e.beta));
                targetHeadRotY = (clampGamma / 45) * 0.45;
                targetHeadRotX = ((clampBeta - 45) / 45) * 0.3;
            }
        }, { passive: true });
    }

    // 13. Auto Blink Cycle
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

    // 14. Animation Render Loop
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.002;

        // Cat Gentle Breathing & Latte Cup floating
        mascotGroup.position.y = -0.75 + Math.sin(time) * 0.045;
        if (heldCupGroup) heldCupGroup.position.y = 0.58 + Math.cos(time * 1.4) * 0.03;

        // Tail swishing animation
        if (tailGroup) {
            tailGroup.rotation.y = Math.sin(time * 2.2) * 0.32;
            tailGroup.rotation.z = Math.cos(time * 1.8) * 0.15;
        }

        // Head tracking Lerp
        if (headGroup) {
            headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.08;
            headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.08;
        }

        // Holographic Gyro Rings
        if (orbitRingGroup) {
            orbitRingGroup.rotation.y += 0.008;
        }

        // Auto rotate entire group slightly if enabled
        if (autoRotateActive) {
            mascotGroup.rotation.y = Math.sin(time * 0.4) * 0.2;
        }

        // Orbiting Cosmic Badges (Planetary Halo Ring - Never covers cat face!)
        floatingMeshes.forEach(coin => {
            const ud = coin.userData;
            ud.theta += ud.orbitSpeed;

            coin.position.x = Math.sin(ud.theta) * ud.radiusX;
            coin.position.z = Math.cos(ud.theta) * ud.radiusZ;
            // Tilted halo orbit: dips below paws in front, rises behind head in back
            coin.position.y = -0.2 - Math.cos(ud.theta) * 0.65 + Math.sin(time * 1.1 + ud.phase) * 0.06;

            coin.lookAt(camera.position);
        });

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // 15. Responsive Window Resize
    window.addEventListener('resize', () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight || 480;
        const mobileNow = window.innerWidth < 768;
        camera.aspect = w / h;
        camera.position.z = mobileNow ? 9.8 : 8.6;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

function setSpeechBubble(text) {
    const speechEl = document.getElementById('speech-text');
    const speechBox = document.getElementById('mascot-speech-box');
    if (speechEl) speechEl.textContent = text;
    if (speechBox && typeof gsap !== 'undefined') {
        gsap.fromTo(speechBox, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
    }
}

// Floating leaves background particles
function createMiniFloatingLeaves() {
    const count = 45;
    const leafGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = [];

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 7.0;
        positions[i + 1] = Math.random() * 6.0 - 3.0;
        positions[i + 2] = (Math.random() - 0.5) * 6.0;
        speeds.push(0.008 + Math.random() * 0.015);
    }

    leafGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

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
        opacity: 0.65,
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
            if (pos[i] > 3.5) pos[i] = -2.8;
            speedIdx++;
        }
        leafGeo.attributes.position.needsUpdate = true;
        if (prevRender) prevRender();
    };
}

// --- Achievement Cards Hover & Click Reactions ---
function initAchievementReactions() {
    const trophyCards = document.querySelectorAll('.trophy-bento-card');
    const certCards = document.querySelectorAll('.cert-card');

    const triggerReaction = (title, speech) => {
        if (!mascotGroup) return;
        playPopSound(720, 0.08);

        gsap.to(mascotGroup.position, {
            y: mascotGroup.position.y + 0.35,
            duration: 0.22,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out'
        });
        if (headGroup) {
            gsap.to(headGroup.rotation, {
                z: 0.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        }
        setSpeechBubble(speech);
    };

    trophyCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const title = card.querySelector('.bento-title')?.textContent || '';
            let quote = `Meo! Thành tích "${title}" xịn sò quá sen ơi! 🐾`;
            if (title.includes('AI Riser')) quote = 'Meo! Top 500 AI Riser Vietnam 2026 của Google nè! Đỉnh nóc kịch trần luôn! 🏆🐾';
            else if (title.includes('Vibe Coding')) quote = 'Meo! Chứng nhận 5-Day Vibe Coding Kaggle & Google siêu cháy! ⚡🐾';
            else if (title.includes('STEM')) quote = 'Meo! Giải Nhất KHKT & Ngày hội STEM cấp trường 2026! 🥇🐾';
            else if (title.includes('Thành Phố') || title.includes('TP')) quote = 'Meo! Giải Ba KHKT cấp Thành Phố Đà Nẵng 2026! Đáng tự hào! 🥉🐾';
            triggerReaction(title, quote);
        });
    });

    certCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const title = card.querySelector('.cert-title')?.textContent || '';
            triggerReaction(title, `Meo! "${title}" - Cột mốc sáng giá của Quang đó! 🌟🐾`);
        });
    });

    // Scroll parallax dynamic tilt on cat
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const scrollDelta = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        if (mascotGroup) {
            mascotGroup.rotation.x = Math.max(-0.25, Math.min(0.25, scrollDelta * 0.005));
            gsap.to(mascotGroup.rotation, { x: 0, duration: 0.4 });
        }
    }, { passive: true });
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
        ease: 'power2.out',
        clearProps: 'all'
    });

    gsap.from('.contact-cta-pill', {
        opacity: 0,
        y: 15,
        stagger: 0.08,
        delay: 0.35,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all'
    });

    gsap.from('.contact-social-pill', {
        opacity: 0,
        scale: 0.85,
        stagger: 0.06,
        delay: 0.45,
        duration: 0.7,
        ease: 'back.out(1.8)',
        clearProps: 'all'
    });

    gsap.from('.skills-dashboard-cute', {
        opacity: 0,
        y: 25,
        delay: 0.5,
        duration: 0.9,
        ease: 'power2.out'
    });

    gsap.from('.mascot-universe-stage', {
        scale: 0.9,
        opacity: 0,
        delay: 0.3,
        duration: 1.1,
        ease: 'elastic.out(1, 0.75)'
    });
}
