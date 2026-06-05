// --- Nguyễn Duy Quang Matcha Cute Profile Application ---

document.addEventListener('DOMContentLoaded', () => {
    initThreeJSMascot();
    init3DTiltEffect();
    initCertificatesLightbox();
    initBirthdayConfetti();
    initMatchaGame();
    initGSAPAnimations();
});

// --- 1. Three.js Mascot (Matcha Bear) & Clickable Floating 3D Logos Setup ---
let scene, camera, renderer, controls;
let mascotGroup, headGroup, eyeLeft, eyeRight;
let targetHeadRotY = 0, targetHeadRotX = 0;
let isBlinking = false;
let floatingMeshes = [];

const floatingIconsData = [
    // Contacts (Click opens link)
    { type: 'contact', logoUrl: 'https://img.icons8.com/color/96/facebook-new.png', name: 'Facebook', url: 'https://www.facebook.com/NgDoQ' },
    { type: 'contact', logoUrl: 'https://img.icons8.com/color/96/instagram-new.png', name: 'Instagram', url: 'https://www.instagram.com/quangcogo0406/' },
    { type: 'contact', logoUrl: 'https://img.icons8.com/color/96/github.png', name: 'GitHub', url: 'https://github.com/Wothing0406' },
    { type: 'contact', logoUrl: 'https://img.icons8.com/color/96/gmail-new.png', name: 'Gmail', url: 'mailto:poiairo4628@gmail.com' },
    { type: 'contact', logoUrl: 'https://img.icons8.com/color/96/phone.png', name: 'Điện thoại', url: 'tel:0795277227' },
    
    // Skills (Click makes mascot speak)
    { type: 'skill', logoUrl: 'https://img.icons8.com/color/96/python.png', name: 'Python', info: 'Quang dùng Python chủ yếu cho huấn luyện mô hình AI, xử lý dữ liệu lớn và viết script tự động hóa! 🐍' },
    { type: 'skill', logoUrl: 'https://img.icons8.com/color/96/html-5.png', name: 'HTML/CSS', info: 'Quang thiết kế giao diện HTML/CSS mượt mà, chuẩn SEO và tối ưu hóa trải nghiệm người dùng! 🌐' },
    { type: 'skill', logoUrl: 'https://img.icons8.com/color/96/nodejs.png', name: 'Node.js', info: 'Quang viết Node.js để xây dựng hệ thống server backend, API thời gian thực và socket server! 🟢' },
    { type: 'skill', logoUrl: 'https://img.icons8.com/color/96/java-coffee-cup-logo.png', name: 'Java', info: 'Quang dùng Java để phát triển các cấu trúc dữ liệu tối ưu và dự án hướng đối tượng quy mô! ☕' },
    { type: 'skill', logoUrl: 'https://img.icons8.com/color/96/mysql-logo.png', name: 'MySQL', info: 'Quang thiết kế cơ sở dữ liệu quan hệ tối ưu, viết các truy vấn phức tạp hiệu năng cao! 🐬' },
    { type: 'skill', logoUrl: 'https://img.icons8.com/color/96/c-plus-plus-logo.png', name: 'C++', info: 'Quang sử dụng C++ cho lập trình thuật toán, tối ưu tài nguyên và các tác vụ tính toán tốc độ! ⚡' }
];

function initThreeJSMascot() {
    const container = document.getElementById('mascot-canvas-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 400; // fallback to 400 if layout is delayed

    // Create Scene
    scene = new THREE.Scene();

    // Create Camera
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9.0);

    // Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; 
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minAzimuthAngle = -Math.PI / 3;
    controls.maxAzimuthAngle = Math.PI / 3;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xbbe3b5, 1.2, 10);
    pointLight.position.set(-3, -2, -3);
    scene.add(pointLight);

    // Mascot Main Group
    mascotGroup = new THREE.Group();
    mascotGroup.position.y = -0.8;
    scene.add(mascotGroup);

    // Mascot Materials setup
    const matchaMat = new THREE.MeshStandardMaterial({
        color: 0x76b06c, // Matcha Green
        roughness: 0.6,
        metalness: 0.1
    });

    const innerEarMat = new THREE.MeshStandardMaterial({
        color: 0xffc4c2, // Cute Pink
        roughness: 0.8
    });

    const creamMat = new THREE.MeshStandardMaterial({
        color: 0xfafef9, // Soft Cream
        roughness: 0.7
    });

    const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x1f1f1f, // Glossy Black
        roughness: 0.1,
        metalness: 0.1
    });

    const strawMat = new THREE.MeshStandardMaterial({
        color: 0xffb7b2, // Pink Straw
        roughness: 0.4
    });

    // 1. Create Mascot Body (Cute Chubby Torso)
    const bodyGeo = new THREE.CylinderGeometry(0.9, 1.2, 2.0, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, creamMat); // Cream sweater
    bodyMesh.position.y = 0.5;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    mascotGroup.add(bodyMesh);

    // Sweater Green Stripe
    const stripeGeo = new THREE.CylinderGeometry(1.08, 1.15, 0.35, 32);
    const stripeMesh = new THREE.Mesh(stripeGeo, matchaMat);
    stripeMesh.position.y = 0.5;
    mascotGroup.add(stripeMesh);

    // Sweater Collar
    const collarGeo = new THREE.TorusGeometry(0.85, 0.12, 16, 32);
    const collarMesh = new THREE.Mesh(collarGeo, matchaMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.y = 1.45;
    mascotGroup.add(collarMesh);

    // Stubby legs
    const legGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const legLeft = new THREE.Mesh(legGeo, matchaMat);
    legLeft.position.set(-0.6, -0.4, 0.2);
    legLeft.scale.y = 1.2;
    mascotGroup.add(legLeft);

    const legRight = legLeft.clone();
    legRight.position.x = 0.6;
    mascotGroup.add(legRight);

    // Stubby arms
    const armGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const armLeft = new THREE.Mesh(armGeo, matchaMat);
    armLeft.position.set(-1.1, 0.9, 0.2);
    mascotGroup.add(armLeft);

    const armRight = armLeft.clone();
    armRight.position.set(1.1, 0.9, 0.2);
    mascotGroup.add(armRight);

    // 2. Create Mascot Head Group
    headGroup = new THREE.Group();
    headGroup.position.set(0, 1.7, 0);
    mascotGroup.add(headGroup);

    // Head Base
    const headGeo = new THREE.SphereGeometry(1.15, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, matchaMat);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headGroup.add(headMesh);

    // Ears Left
    const earOuterGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const earOuterLeft = new THREE.Mesh(earOuterGeo, matchaMat);
    earOuterLeft.position.set(-0.85, 0.85, -0.1);
    headGroup.add(earOuterLeft);

    const earInnerGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const earInnerLeft = new THREE.Mesh(earInnerGeo, innerEarMat);
    earInnerLeft.position.set(-0.85, 0.85, 0.1);
    earInnerLeft.scale.z = 0.5;
    headGroup.add(earInnerLeft);

    // Ears Right
    const earOuterRight = earOuterLeft.clone();
    earOuterRight.position.x = 0.85;
    headGroup.add(earOuterRight);

    const earInnerRight = earInnerLeft.clone();
    earInnerRight.position.x = 0.85;
    headGroup.add(earInnerRight);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(-0.4, 0.15, 0.98);
    headGroup.add(eyeLeft);

    eyeRight = eyeLeft.clone();
    eyeRight.position.x = 0.4;
    headGroup.add(eyeRight);

    // Snout
    const snoutGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const snoutMesh = new THREE.Mesh(snoutGeo, creamMat);
    snoutMesh.scale.set(1.2, 0.8, 0.6);
    snoutMesh.position.set(0, -0.15, 0.96);
    headGroup.add(snoutMesh);

    // Nose
    const noseGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const noseMesh = new THREE.Mesh(noseGeo, eyeMat);
    noseMesh.position.set(0, -0.1, 1.12);
    headGroup.add(noseMesh);

    // Cheeks (Rosy blush)
    const cheekGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const cheekLeft = new THREE.Mesh(cheekGeo, innerEarMat);
    cheekLeft.scale.z = 0.15;
    cheekLeft.position.set(-0.7, -0.12, 0.95);
    headGroup.add(cheekLeft);

    const cheekRight = cheekLeft.clone();
    cheekRight.position.x = 0.7;
    headGroup.add(cheekRight);

    // 3. Mini Matcha Cup Held in Hand
    const heldCupGroup = new THREE.Group();
    heldCupGroup.position.set(0.65, 0.6, 0.8);
    mascotGroup.add(heldCupGroup);

    // Cup Body
    const miniCupGeo = new THREE.CylinderGeometry(0.28, 0.22, 0.6, 16);
    const miniCupMesh = new THREE.Mesh(miniCupGeo, creamMat);
    miniCupMesh.castShadow = true;
    heldCupGroup.add(miniCupMesh);

    // Cup Liquid Content
    const miniLiquidGeo = new THREE.CylinderGeometry(0.26, 0.22, 0.1, 16);
    const miniLiquidMesh = new THREE.Mesh(miniLiquidGeo, matchaMat);
    miniLiquidMesh.position.y = 0.26;
    heldCupGroup.add(miniLiquidMesh);

    // Straw
    const strawGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    const strawMesh = new THREE.Mesh(strawGeo, strawMat);
    strawMesh.position.set(0.08, 0.4, 0.05);
    strawMesh.rotation.z = -0.2;
    heldCupGroup.add(strawMesh);

    // Floor shadow circle
    const shadowGeo = new THREE.RingGeometry(0.01, 1.3, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
        color: 0xd0ebcd,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });
    const shadowFloor = new THREE.Mesh(shadowGeo, shadowMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.42;
    mascotGroup.add(shadowFloor);

    // 4. Create Clickable Floating 3D Badge Logos (Clean, Transparent & Sharp!)
    const textureLoader = new THREE.TextureLoader();
    const tokenGeo = new THREE.PlaneGeometry(0.68, 0.68);

    floatingIconsData.forEach((data, i) => {
        // Load the texture asynchronously
        const texture = textureLoader.load(data.logoUrl);
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            roughness: 0.3,
            metalness: 0.1,
            alphaTest: 0.05
        });

        const tokenMesh = new THREE.Mesh(tokenGeo, material);
        
        // Setup orbits: Inner orbit (contacts) vs Outer orbit (skills)
        const isContact = data.type === 'contact';
        const orbitRadius = isContact ? 1.8 : 2.6;
        
        // Distribute angles evenly within each group
        const groupIndex = isContact ? i : (i - 5);
        const groupTotal = isContact ? 5 : 6;
        const initialTheta = (groupIndex / groupTotal) * Math.PI * 2;
        
        // Initial height offset
        const y = isContact ? 0.6 + Math.sin(groupIndex * 1.5) * 0.4 : 0.8 + Math.cos(groupIndex * 1.2) * 0.7;

        tokenMesh.position.set(
            Math.sin(initialTheta) * orbitRadius,
            y,
            Math.cos(initialTheta) * orbitRadius
        );

        tokenMesh.userData = {
            type: 'floating_badge',
            info: data,
            initialY: y,
            radius: orbitRadius,
            theta: initialTheta,
            orbitSpeed: isContact ? 0.0035 : -0.0022, // Contacts orbit counter-clockwise, skills clockwise
            phase: i * 0.9
        };
        
        scene.add(tokenMesh);
        floatingMeshes.push(tokenMesh);
    });

    // Particle background
    createMiniFloatingLeaves();

    // Raycaster click triggers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    container.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        
        // Intersect with floating meshes & mascot
        const intersects = raycaster.intersectObjects(floatingMeshes.concat([headMesh, bodyMesh, stripeMesh]));

        if (intersects.length > 0) {
            const hitObject = intersects[0].object;
            
            // Check if clicked floating mesh
            if (hitObject.userData.type === 'floating_badge') {
                const info = hitObject.userData.info;
                
                // Spin clicked mesh
                gsap.to(hitObject.rotation, {
                    y: hitObject.rotation.y + Math.PI * 2,
                    duration: 0.6,
                    ease: "power2.inOut"
                });

                // Scale pop reaction
                gsap.to(hitObject.scale, {
                    x: 1.3, y: 1.3, z: 1.3,
                    duration: 0.2, yoyo: true, repeat: 1
                });

                // Handle click action
                if (info.type === 'contact') {
                    document.getElementById('speech-text').textContent = `Đang mở liên kết ${info.name} của Quang... 🚀`;
                    document.getElementById('speech-text').style.color = "var(--matcha-dark)";
                    
                    setTimeout(() => {
                        window.open(info.url, '_blank');
                    }, 500);
                } else if (info.type === 'skill') {
                    // Make mascot speak
                    document.getElementById('speech-text').textContent = info.info;
                    document.getElementById('speech-text').style.color = "var(--matcha-dark)";
                    
                    // Mascot wiggles and jumps
                    gsap.to(mascotGroup.position, {
                        y: -0.4,
                        duration: 0.15,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.out"
                    });
                    
                    gsap.to(headGroup.rotation, {
                        z: 0.2,
                        duration: 0.15,
                        yoyo: true,
                        repeat: 1
                    });
                }
            } else {
                // Clicked Mascot itself
                document.getElementById('speech-text').textContent = "Ui da! Bạn vừa cù lét mình đó hả? 🐻🍵";
                
                gsap.to(mascotGroup.position, {
                    y: -0.4,
                    duration: 0.15,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out"
                });
                
                gsap.to(mascotGroup.rotation, {
                    y: mascotGroup.rotation.y + Math.PI,
                    duration: 0.6,
                    ease: "back.out(1.5)"
                });
            }
        }
    });

    // Track mouse head-tracking & Raycaster hover
    let hoveredObject = null;
    window.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        
        targetHeadRotY = mouseX * 0.42; 
        targetHeadRotX = mouseY * 0.25; 
        
        // Raycast hover
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(floatingMeshes);
        
        if (intersects.length > 0) {
            const hit = intersects[0].object;
            document.body.style.cursor = 'pointer';
            
            if (hoveredObject !== hit) {
                if (hoveredObject) {
                    gsap.to(hoveredObject.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2 });
                }
                hoveredObject = hit;
                gsap.to(hit.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.2 });
            }
        } else {
            document.body.style.cursor = 'default';
            if (hoveredObject) {
                gsap.to(hoveredObject.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.2 });
                hoveredObject = null;
            }
        }
    });

    // Auto blink
    function triggerBlink() {
        if (isBlinking) return;
        isBlinking = true;
        
        gsap.to([eyeLeft.scale, eyeRight.scale], {
            y: 0.1,
            duration: 0.12,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                isBlinking = false;
                setTimeout(triggerBlink, 3000 + Math.random() * 3000);
            }
        });
    }
    setTimeout(triggerBlink, 2000);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.002;
        
        // Bobbing floating animation for mascot
        mascotGroup.position.y = -0.7 + Math.sin(time) * 0.06;
        heldCupGroup.position.y = 0.55 + Math.cos(time * 1.5) * 0.04;

        // Head tracking Lerp
        if (headGroup) {
            headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.08;
            headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.08;
        }

        // Animate floating badge logos (orbiting and billboarding)
        floatingMeshes.forEach(mesh => {
            const ud = mesh.userData;
            
            // 1. Update orbit angle
            ud.theta += ud.orbitSpeed;
            
            // 2. Update position on circle + bob Y
            mesh.position.x = Math.sin(ud.theta) * ud.radius;
            mesh.position.z = Math.cos(ud.theta) * ud.radius;
            mesh.position.y = ud.initialY + Math.sin(time * 0.8 + ud.phase) * 0.12;
            
            // 3. Make them always face the camera perfectly (billboard)
            mesh.lookAt(camera.position);
        });

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Window Resize
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight || 400;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

// --- Icons are loaded directly as PNG textures ---

// Floating leaves background particles
function createMiniFloatingLeaves() {
    const leafGeo = new THREE.BufferGeometry();
    const count = 35;
    const positions = new Float32Array(count * 3);
    const speeds = [];

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 6; // X
        positions[i+1] = Math.random() * 5 - 2; // Y
        positions[i+2] = (Math.random() - 0.5) * 5; // Z
        speeds.push(0.008 + Math.random() * 0.012);
    }

    leafGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#76b06c';
    ctx.beginPath();
    ctx.arc(8, 8, 6, 0, Math.PI * 2);
    ctx.fill();
    const leafTexture = new THREE.CanvasTexture(canvas);

    const leafMat = new THREE.PointsMaterial({
        size: 0.15,
        map: leafTexture,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
    });

    const leafPoints = new THREE.Points(leafGeo, leafMat);
    scene.add(leafPoints);

    function animateLeaves() {
        const pos = leafGeo.attributes.position.array;
        let speedIdx = 0;
        for (let i = 1; i < count * 3; i += 3) {
            pos[i] += speeds[speedIdx]; // Float up
            pos[i-1] += Math.sin(Date.now()*0.001 + speedIdx) * 0.004; // sway
            if (pos[i] > 3) {
                pos[i] = -2.5; // Loop back
            }
            speedIdx++;
        }
        leafGeo.attributes.position.needsUpdate = true;
    }

    const prevRender = scene.onBeforeRender;
    scene.onBeforeRender = function() {
        animateLeaves();
        if (prevRender) prevRender();
    };
}

// --- 2. 3D Tilt Effect for Contact Cards ---
function init3DTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const w = rect.width;
            const h = rect.height;
            
            const tiltX = ((y / h) - 0.5) * -20;
            const tiltY = ((x / w) - 0.5) * 20;
            
            el.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.08)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translateY(0) rotateX(0) rotateY(0) scale(1)`;
        });
    });
}

// --- 3. Certificate Lightbox Modal ---
const certificates = [
    {
        img: "img/vinhdanh2026.jpg",
        title: "Vinh danh thành tích học tập xuất sắc 2026",
        desc: "Bảng vinh danh chính thức vinh danh toàn diện các thành tích vượt trội và nỗ lực cống hiến vượt bậc của Nguyễn Duy Quang trong suốt năm học 2026.",
        tag: "Vinh danh"
    },
    {
        img: "img/nhatsteam2026.jpg",
        title: "Giải Nhất STEM KHKT cấp trường 2026",
        desc: "Đoạt giải Nhất cuộc thi Nghiên cứu Khoa học Kỹ thuật (KHKT) kết hợp hoạt động STEM cấp trường năm học 2025 - 2026, khẳng định năng lực ứng dụng công nghệ thực tế.",
        tag: "Giải Nhất"
    },
    {
        img: "img/khuyenkhichkhktcaptinh.jpg",
        title: "Giải Khuyến khích KHKT cấp trường năm 2025",
        desc: "Giải thưởng ghi nhận nỗ lực sáng tạo đạt Giải Khuyến khích trong cuộc thi Khoa học Kỹ thuật (KHKT) cấp trường tổ chức năm học 2024 - 2025 (năm ngoái).",
        tag: "Giải KK"
    },
    {
        img: "img/giaibakhktcaptp2026.jpg",
        title: "Giải Ba KHKT cấp thành phố Đà Nẵng 2026",
        desc: "Đạt giải Ba chung cuộc tại cuộc thi Khoa học Kỹ thuật học sinh trung học cấp Thành Phố Đà Nẵng năm học 2025-2026 nhờ đề tài khoa học sáng tạo.",
        tag: "Giải Ba Cấp TP"
    },
    {
        img: "img/khuyenkhichhsgtinhoc2026.jpg",
        title: "Giải Khuyến khích HSG Tin học cấp trường 2026",
        desc: "Đạt giải Khuyến khích trong kỳ thi tuyển chọn Học sinh giỏi bộ môn Tin học cấp trường năm học 2025-2026.",
        tag: "Giải HSG"
    },
    {
        img: "img/giaibacuocthiAI.jpg",
        title: "Giải Ba Chiến binh Kỷ nguyên số Hội An Tây AI Challenge 2026",
        desc: "Đoạt giải Ba tại cuộc thi lập trình mô hình và giải pháp trí tuệ nhân tạo lớn 'Chiến binh Kỷ nguyên số Hội An Tây AI Challenge 2026'.",
        tag: "Giải Ba AI"
    },
    {
        img: "img/chungnhansamsung.JPG",
        title: "Chứng nhận Solve for Tomorrow 2026 (Samsung)",
        desc: "Chứng nhận hoàn thành đào tạo kỹ năng tư duy thiết kế và phát triển dự án thực tế do tập đoàn công nghệ Samsung cấp trong cuộc thi Solve for Tomorrow 2026.",
        tag: "Chứng nhận Samsung"
    }
];

function initCertificatesLightbox() {
    const certCards = document.querySelectorAll('.cert-card');
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTag = document.querySelector('.modal-tag');
    const closeBtn = document.getElementById('modal-close-btn');
    const backdrop = document.querySelector('.modal-backdrop');

    if (!modal || certCards.length === 0) return;

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.getAttribute('data-index'));
            const cert = certificates[idx];
            
            if (cert) {
                modalImg.src = cert.img;
                modalTitle.textContent = cert.title;
                modalDesc.textContent = cert.desc;
                modalTag.textContent = cert.tag;
                
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; 
            }
        });
    });

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; 
    };

    closeBtn.onclick = closeModal;
    backdrop.onclick = closeModal;
}

// --- 4. Confetti Celebration Trigger ---
function initBirthdayConfetti() {
}

// --- 5. Matcha Latte Brewing Mini-Game (Cute version) ---
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
            
            gsap.from(btn, { scale: 0.85, duration: 0.3, ease: "back.out(2)" });

            updateLiquidHeight();
            updateLiquidColor();
            
            if (totalIngredientsAdded === 4) {
                brewProgressText.textContent = "Bắt đầu khuấy đều bằng cách giữ và xoay tròn chuột trong cốc nhé!";
                brewProgressText.style.color = "var(--matcha-dark)";
                cup.style.cursor = "pointer";
                setupStirring();
            } else {
                brewProgressText.textContent = `Đã chuẩn bị ${totalIngredientsAdded}/4 nguyên liệu...`;
            }
        });
    });
    
    function updateLiquidHeight() {
        const fillPercent = (totalIngredientsAdded / 4) * 75; 
        liquidBase.parentElement.style.height = `${fillPercent}%`;
    }
    
    function updateLiquidColor() {
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
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            if (lastX !== null && lastY !== null) {
                const dx = clientX - lastX;
                const dy = clientY - lastY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 1.5) {
                    brewProgress += dist * 0.18; 
                    brewProgress = Math.min(100, brewProgress);
                    
                    brewProgressBar.style.width = `${brewProgress}%`;
                    brewProgressText.textContent = `Đang tạo bọt trà sữa: ${Math.round(brewProgress)}%`;
                    
                    if (brewProgress > 30) {
                        liquidFoam.style.opacity = (brewProgress - 30) / 70;
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
        
        cup.addEventListener('touchstart', handleStirStart);
        window.addEventListener('touchmove', handleStirMove);
        window.addEventListener('touchend', handleStirEnd);
        
        cup.userData = {
            cleanup: () => {
                cup.removeEventListener('mousedown', handleStirStart);
                window.removeEventListener('mousemove', handleStirMove);
                window.removeEventListener('mouseup', handleStirEnd);
                cup.removeEventListener('touchstart', handleStirStart);
                window.removeEventListener('touchmove', handleStirMove);
                window.removeEventListener('touchend', handleStirEnd);
            }
        };
    }
    
    function finishBrewing() {
        if (cup.userData && cup.userData.cleanup) {
            cup.userData.cleanup();
        }
        
        brewProgressText.textContent = "Đã hoàn thành! Thơm ngon béo ngậy! 🍵";
        brewProgressText.style.color = "var(--matcha-dark)";
        
        setTimeout(() => {
            winOverlay.classList.remove('hidden');
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.65 },
                colors: ['#76b06c', '#ffb7b2', '#ffeaa7', '#fafef9']
            });
        }, 600);
    }
    
    resetBtn.addEventListener('click', () => {
        brewProgress = 0;
        isStirring = false;
        totalIngredientsAdded = 0;
        for (let k in ingredients) ingredients[k] = false;
        
        ingredientBtns.forEach(btn => btn.classList.remove('added'));
        liquidBase.parentElement.style.height = `0%`;
        liquidFoam.style.opacity = 0;
        brewProgressBar.style.width = `0%`;
        brewProgressText.textContent = "Thêm đầy đủ 4 nguyên liệu vào cốc...";
        brewProgressText.style.color = "var(--text-muted)";
        cup.style.cursor = "default";
        
        winOverlay.classList.add('hidden');
    });
}

// --- 6. GSAP Transitions & Entrance Animations ---
function initGSAPAnimations() {
    gsap.from(".badge-cute", {
        scale: 0.3,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(2)"
    });
    
    gsap.from(".hero-title", {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out"
    });
    
    gsap.from(".hero-nickname", {
        x: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: "power3.out"
    });
    
    gsap.from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out"
    });
    
    gsap.from(".contact-circle-btn", {
        opacity: 0,
        y: 15,
        stagger: 0.08,
        delay: 0.3,
        duration: 0.8,
        ease: "power2.out"
    });
    
    gsap.from(".skills-dashboard-cute", {
        opacity: 0,
        y: 25,
        delay: 0.45,
        duration: 0.9,
        ease: "power2.out"
    });
    
    gsap.from(".mascot-box", {
        scale: 0.85,
        opacity: 0,
        delay: 0.3,
        duration: 1.2,
        ease: "elastic.out(1, 0.75)"
    });
    
    // Skills bars stagger reveal
    gsap.from(".progress-bar-cute", {
        width: 0,
        delay: 0.85,
        duration: 1.5,
        stagger: 0.15,
        ease: "power3.out"
    });
}
