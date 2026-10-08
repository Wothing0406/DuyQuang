"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Leaf,
  Sparkles,
  Flame,
  Trophy,
  Zap,
  Medal,
  Award,
  ShieldCheck,
  Globe,
  BrainCircuit,
  Layers,
  Server,
  Database,
  RotateCw,
  Target,
  Compass,
  Loader2,
  Bot,
  FlaskConical,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Coffee,
  MessageCircle,
  Mail,
  Phone,
  Volume2,
  VolumeX,
  Github,
  Facebook,
  Instagram,
  ExternalLink,
  Code2,
} from "lucide-react";

// --- Types & Interfaces ---
interface Certificate {
  id: string;
  img: string;
  title: string;
  desc: string;
  tag: string;
  year: string;
  category: "google-ai" | "stem" | "honors";
  featuredRibbon?: string;
}

interface SkillItem {
  name: string;
  icon: React.ReactNode;
  percent: number;
}

// --- Data Constants ---
const CERTIFICATES: Certificate[] = [
  {
    id: "ai-riser-2026",
    img: "img/ai_riser_vietnam_2026.jpg",
    title: "Top 500 Toàn Quốc - AI Riser Vietnam 2026",
    desc: "Chứng nhận Top 500 cá nhân xuất sắc toàn quốc chương trình #BuildwithGoogleAI với sứ mệnh 'Vươn mình kiến tạo' do Google for Developers trao tặng.",
    tag: "Google for Developers",
    year: "10/2026",
    category: "google-ai",
    featuredRibbon: "Nổi Bật Toàn Quốc",
  },
  {
    id: "google-vibe-coding-2026",
    img: "img/google_vibe_coding_2026.png",
    title: "5-Day AI Agents: Intensive Vibe Coding Course",
    desc: "Chứng nhận hoàn thành khóa đào tạo chuyên sâu về AI Agents và phương pháp Vibe Coding do Kaggle & Google đồng tổ chức.",
    tag: "Google & Kaggle",
    year: "07/2026",
    category: "google-ai",
    featuredRibbon: "Chứng Nhận Quốc Tế",
  },
  {
    id: "vinh-danh-2026",
    img: "img/vinhdanh2026.jpg",
    title: "Vinh danh thành tích học tập xuất sắc 2026",
    desc: "Khen thưởng cấp trường ghi nhận nỗ lực toàn diện và thành tích học tập vượt trội trong năm học 2025 - 2026.",
    tag: "Vinh danh",
    year: "2026",
    category: "honors",
  },
  {
    id: "nhat-stem-2026",
    img: "img/nhatsteam2026.jpg",
    title: "Giải Nhất STEM Khoa học Kỹ thuật 2026",
    desc: "Giải Nhất cuộc thi Nghiên cứu Khoa học Kỹ thuật kết hợp ngày hội STEM cấp trường năm học 2025 - 2026.",
    tag: "Giải Nhất STEM",
    year: "2026",
    category: "stem",
  },
  {
    id: "ba-khkt-tp-2026",
    img: "img/giaibakhktcaptp2026.jpg",
    title: "Giải Ba KHKT cấp thành phố Đà Nẵng 2026",
    desc: "Đoạt giải Ba chung cuộc tại cuộc thi Khoa học Kỹ thuật học sinh trung học cấp Thành phố Đà Nẵng năm học 2025 - 2026.",
    tag: "Giải Ba Cấp TP",
    year: "2026",
    category: "stem",
  },
  {
    id: "ba-ai-challenge-2026",
    img: "img/giaibacuocthiAI.jpg",
    title: "Giải Ba Hội An Tây AI Challenge 2026",
    desc: "Đoạt giải Ba tại cuộc thi lập trình mô hình và giải pháp trí tuệ nhân tạo Chiến binh Kỷ nguyên số 2026.",
    tag: "Giải Ba AI",
    year: "2026",
    category: "google-ai",
  },
  {
    id: "samsung-sft-2026",
    img: "img/chungnhansamsung.JPG",
    title: "Chứng nhận Solve for Tomorrow 2026 (Samsung)",
    desc: "Chứng nhận hoàn thành đào tạo kỹ năng tư duy thiết kế và phát triển dự án công nghệ thực tế từ tập đoàn Samsung.",
    tag: "Samsung SFT",
    year: "2026",
    category: "stem",
  },
  {
    id: "kk-hsg-tin-2026",
    img: "img/khuyenkhichhsgtinhoc2026.jpg",
    title: "Giải Khuyến khích HSG Tin học cấp trường 2026",
    desc: "Khen thưởng kỳ thi tuyển chọn Học sinh giỏi bộ môn Tin học cấp trường năm học 2025 - 2026.",
    tag: "Giải KK Tin học",
    year: "2026",
    category: "honors",
  },
  {
    id: "kk-khkt-2025",
    img: "img/khuyenkhichkhktcaptinh.jpg",
    title: "Giải Khuyến khích KHKT cấp trường 2025",
    desc: "Giải Khuyến khích cuộc thi Nghiên cứu Khoa học Kỹ thuật học sinh trung học năm học 2024 - 2025.",
    tag: "Giải KK KHKT",
    year: "2025",
    category: "stem",
  },
];

const SKILLS_DATA: SkillItem[] = [
  {
    name: "Training AI / Deep Learning (PyTorch, Agents)",
    icon: <BrainCircuit className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />,
    percent: 92,
  },
  {
    name: "Frontend React, Three.js 3D & UI Modern",
    icon: <Layers className="w-4 h-4 text-blue-600 shrink-0" strokeWidth={2} />,
    percent: 88,
  },
  {
    name: "Backend API & Microservices (Node.js, FastAPI)",
    icon: <Server className="w-4 h-4 text-emerald-700 shrink-0" strokeWidth={2} />,
    percent: 85,
  },
  {
    name: "Database Architecture & Optimization (SQL)",
    icon: <Database className="w-4 h-4 text-cyan-600 shrink-0" strokeWidth={2} />,
    percent: 82,
  },
];

export default function ProfilePage() {
  // --- States ---
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [speechText, setSpeechText] = useState<string>(
    "Xin chào! Mình là chú gấu Matcha 3D của Quang. Tương tác với mình hoặc các huy hiệu 3D bay quanh nhé!"
  );
  const [activeNavSection, setActiveNavSection] = useState<string>("hero");
  const [is3DLoaded, setIs3DLoaded] = useState<boolean>(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const threeStateRef = useRef<any>(null);

  // --- Sound Helper ---
  const playInteractionSound = (freq = 560, duration = 0.08) => {
    if (!isAudioEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  // --- Filtered Certificates ---
  const filteredCerts = useMemo(() => {
    if (activeFilter === "all") return CERTIFICATES;
    return CERTIFICATES.filter((c) => c.category === activeFilter);
  }, [activeFilter]);

  // --- Modal Navigation ---
  const handleOpenModal = (index: number) => {
    setActiveModalIndex(index);
    playInteractionSound(640);
  };

  const handleCloseModal = () => {
    setActiveModalIndex(null);
  };

  const handlePrevModal = () => {
    if (activeModalIndex === null) return;
    setActiveModalIndex((prev) => (prev! - 1 + CERTIFICATES.length) % CERTIFICATES.length);
    playInteractionSound(580);
  };

  const handleNextModal = () => {
    if (activeModalIndex === null) return;
    setActiveModalIndex((prev) => (prev! + 1) % CERTIFICATES.length);
    playInteractionSound(680);
  };

  // --- 3D Mascot Mount & Lifecycle ---
  useEffect(() => {
    if (typeof window === "undefined" || !canvasContainerRef.current) return;

    // Check WebGL
    try {
      const canvas = document.createElement("canvas");
      const hasWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      if (!hasWebGL) {
        setIsWebGLSupported(false);
        setIs3DLoaded(true);
        return;
      }
    } catch {
      setIsWebGLSupported(false);
      setIs3DLoaded(true);
      return;
    }

    const THREE = (window as any).THREE;
    if (!THREE) {
      // Dynamic load Three.js if needed or fallback gracefully
      setIs3DLoaded(true);
      return;
    }

    const container = canvasContainerRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 420;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 8.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Orbit Controls
    let controls: any = null;
    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI / 2.7;
      controls.maxPolarAngle = Math.PI / 1.75;
      controls.minAzimuthAngle = -Math.PI / 2.2;
      controls.maxAzimuthAngle = Math.PI / 2.2;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xf2f8ee, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaea, 0.85);
    dirLight.position.set(6, 9, 6);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xa7f3d0, 1.0, 12);
    pointLight.position.set(-2, -1.5, 3);
    scene.add(pointLight);

    // Mascot Group
    const mascotGroup = new THREE.Group();
    mascotGroup.position.y = -0.85;
    scene.add(mascotGroup);

    // Materials
    const matchaMat = new THREE.MeshStandardMaterial({ color: 0x6ca561, roughness: 0.55, metalness: 0.08 });
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xffb8b4, roughness: 0.75 });
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xf9fcf8, roughness: 0.65 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.1, metalness: 0.2 });

    // Torso
    const bodyGeo = new THREE.CylinderGeometry(0.92, 1.22, 2.05, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, creamMat);
    bodyMesh.position.y = 0.5;
    bodyMesh.castShadow = true;
    mascotGroup.add(bodyMesh);

    const stripeGeo = new THREE.CylinderGeometry(1.09, 1.16, 0.38, 32);
    const stripeMesh = new THREE.Mesh(stripeGeo, matchaMat);
    stripeMesh.position.y = 0.5;
    mascotGroup.add(stripeMesh);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.72, 0);
    mascotGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(1.18, 32, 32);
    const headMesh = new THREE.Mesh(headGeo, matchaMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Ears
    const earOuterGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const earLeft = new THREE.Mesh(earOuterGeo, matchaMat);
    earLeft.position.set(-0.88, 0.88, -0.1);
    headGroup.add(earLeft);
    const earInnerLeft = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), innerEarMat);
    earInnerLeft.position.set(-0.88, 0.88, 0.1);
    earInnerLeft.scale.z = 0.5;
    headGroup.add(earInnerLeft);

    const earRight = earLeft.clone();
    earRight.position.x = 0.88;
    headGroup.add(earRight);
    const earInnerRight = earInnerLeft.clone();
    earInnerRight.position.x = 0.88;
    headGroup.add(earInnerRight);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const eyeLeftMesh = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeftMesh.position.set(-0.42, 0.16, 1.02);
    headGroup.add(eyeLeftMesh);
    const eyeRightMesh = eyeLeftMesh.clone();
    eyeRightMesh.position.x = 0.42;
    headGroup.add(eyeRightMesh);

    // Snout & Nose
    const snoutMesh = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), creamMat);
    snoutMesh.scale.set(1.22, 0.82, 0.62);
    snoutMesh.position.set(0, -0.16, 0.98);
    headGroup.add(snoutMesh);

    const noseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 8), eyeMat);
    noseMesh.position.set(0, -0.1, 1.16);
    headGroup.add(noseMesh);

    // Cheeks
    const cheekMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), innerEarMat);
    cheekMesh.scale.z = 0.15;
    cheekMesh.position.set(-0.72, -0.12, 0.98);
    headGroup.add(cheekMesh);
    const cheekRightMesh = cheekMesh.clone();
    cheekRightMesh.position.x = 0.72;
    headGroup.add(cheekRightMesh);

    // Gyro Rings
    const orbitRingGroup = new THREE.Group();
    orbitRingGroup.position.y = 0.4;
    mascotGroup.add(orbitRingGroup);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.02, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.45, wireframe: true })
    );
    ring1.rotation.x = Math.PI / 2.3;
    orbitRingGroup.add(ring1);

    // Store refs
    threeStateRef.current = {
      scene,
      camera,
      renderer,
      controls,
      mascotGroup,
      headGroup,
      orbitRingGroup,
      isAutoRotate: true,
    };

    setIs3DLoaded(true);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = Date.now() * 0.002;
      mascotGroup.position.y = -0.78 + Math.sin(time) * 0.05;
      orbitRingGroup.rotation.y += 0.008;

      if (threeStateRef.current?.isAutoRotate) {
        mascotGroup.rotation.y = Math.sin(time * 0.4) * 0.22;
      }

      if (controls) controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  // --- Scroll Spy ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const sections = ["hero", "gallery-cute", "matcha-game", "contact"];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNavSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6faf4] text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-20 md:pb-0">
      {/* Background Ambient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-[500px] h-[500px] rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute top-1/3 left-2/3 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-72 h-72 rounded-full bg-sky-100/50 blur-3xl" />
      </div>

      {/* --- Header / Navigation --- */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-18 bg-[#f6faf4]/90 backdrop-blur-md border-b border-emerald-600/15 z-50 transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="inline-flex items-center gap-2 group text-emerald-950 font-bold text-lg md:text-xl tracking-tight transition-transform active:scale-95"
          >
            <span className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 group-hover:rotate-12 transition-transform duration-300 shrink-0">
              <Leaf className="w-5 h-5 shrink-0" strokeWidth={2} />
            </span>
            <span>QUANG CÓ GỜ</span>
          </a>

          {/* Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 border border-blue-200/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
            <span className="text-xs font-semibold text-blue-950">Top 500 AI Riser VN • Google</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Desktop Navigation">
            <a
              href="#hero"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                activeNavSection === "hero"
                  ? "text-emerald-900 bg-emerald-100/80"
                  : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              <User className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span>Giới thiệu</span>
            </a>
            <a
              href="#gallery-cute"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                activeNavSection === "gallery-cute"
                  ? "text-emerald-900 bg-emerald-100/80"
                  : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              <Award className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span>Thành tựu</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">9</span>
            </a>
            <a
              href="#matcha-game"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                activeNavSection === "matcha-game"
                  ? "text-emerald-900 bg-emerald-100/80"
                  : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              <Coffee className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span>Tiệm Trà 3D</span>
            </a>
            <a
              href="#contact"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                activeNavSection === "contact"
                  ? "text-emerald-900 bg-emerald-100/80"
                  : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span>Liên hệ</span>
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAudioEnabled((prev) => !prev)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/80 border border-emerald-200 text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all shadow-xs"
              title={isAudioEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              aria-label="Toggle Sound"
            >
              {isAudioEnabled ? (
                <Volume2 className="w-4 h-4 shrink-0" strokeWidth={2} />
              ) : (
                <VolumeX className="w-4 h-4 shrink-0 text-slate-400" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 space-y-24">
        {/* --- Hero Section --- */}
        <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[82vh]">
          {/* Left Text & Dashboard Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Prominent Recognition Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-100/90 via-sky-50 to-blue-100/90 border border-blue-300/60 shadow-xs">
              <Flame className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={2} />
              <span className="text-xs md:text-sm font-bold text-blue-900 tracking-wide">
                TOP 500 AI RISER VIỆT NAM 2026 • GOOGLE FOR DEVELOPERS
              </span>
            </div>

            {/* Main Title & Nickname */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-950 tracking-tight leading-[1.1]">
                NGUYỄN DUY QUANG
              </h1>
              <p className="mt-2 text-base md:text-lg text-slate-600 font-medium">
                Biệt danh:{" "}
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-200/80 text-amber-900 font-bold text-sm">
                  Quang có Gờ
                </span>
              </p>
            </div>

            {/* Clear Concise Summary (Clean Code principle) */}
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              Học sinh THPT tại Đà Nẵng chuyên nghiên cứu <strong>Training AI / Deep Learning</strong>, phát triển{" "}
              <strong>React & 3D Web</strong>, kiến trúc <strong>Backend API</strong> và tối ưu hóa <strong>SQL</strong>.
            </p>

            {/* Bento Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-blue-50/80 border border-blue-200/60 shadow-xs hover:border-blue-400 transition-all">
                <span className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                  <Trophy className="w-5 h-5 shrink-0" strokeWidth={2} />
                </span>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    #BuildwithGoogleAI
                  </span>
                  <h4 className="text-sm font-bold text-emerald-950">Top 500 AI Riser VN</h4>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-cyan-50/90 to-amber-50/80 border border-cyan-200/60 shadow-xs hover:border-cyan-400 transition-all">
                <span className="p-2.5 rounded-xl bg-amber-100 text-amber-600 shrink-0">
                  <Zap className="w-5 h-5 shrink-0" strokeWidth={2} />
                </span>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Kaggle & Google
                  </span>
                  <h4 className="text-sm font-bold text-emerald-950">5-Day Vibe Coding</h4>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-emerald-200/60 shadow-xs hover:border-emerald-400 transition-all">
                <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <Medal className="w-5 h-5 shrink-0" strokeWidth={2} />
                </span>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    KHKT Cấp Trường
                  </span>
                  <h4 className="text-sm font-bold text-emerald-950">Giải Nhất STEM 2026</h4>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 border border-emerald-200/60 shadow-xs hover:border-emerald-400 transition-all">
                <span className="p-2.5 rounded-xl bg-sky-100 text-sky-700 shrink-0">
                  <Award className="w-5 h-5 shrink-0" strokeWidth={2} />
                </span>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    KHKT Cấp TP
                  </span>
                  <h4 className="text-sm font-bold text-emerald-950">Giải Ba Đà Nẵng 2026</h4>
                </div>
              </div>
            </div>

            {/* Social Connection Row - Mobile 44px Touch Targets */}
            <div className="flex items-center gap-2.5 flex-wrap pt-2" id="contact">
              <a
                href="https://github.com/Wothing0406"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-slate-800 hover:bg-slate-50 active:scale-95 transition-all shadow-xs"
                title="GitHub"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              </a>
              <a
                href="https://www.facebook.com/NgDoQ"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-white border border-blue-200 text-blue-600 hover:border-blue-600 hover:bg-blue-50 active:scale-95 transition-all shadow-xs"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              </a>
              <a
                href="https://www.instagram.com/quangcogo0406/"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-white border border-pink-200 text-pink-600 hover:border-pink-600 hover:bg-pink-50 active:scale-95 transition-all shadow-xs"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              </a>
              <a
                href="mailto:poiairo4628@gmail.com"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-white border border-amber-200 text-amber-600 hover:border-amber-600 hover:bg-amber-50 active:scale-95 transition-all shadow-xs"
                title="Gmail"
                aria-label="Gmail"
              >
                <Mail className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              </a>
              <a
                href="tel:0795277227"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl bg-white border border-emerald-200 text-emerald-700 hover:border-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all shadow-xs"
                title="Hotline: 0795 277 227"
                aria-label="Điện thoại"
              >
                <Phone className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              </a>
            </div>

            {/* Core Skills Dashboard */}
            <div className="p-5 md:p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-600/20 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-950 inline-flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
                  Năng Lực Cốt Lõi
                </h3>
                <span className="text-xs font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100">
                  Full-Stack & AI
                </span>
              </div>

              <div className="space-y-3.5">
                {SKILLS_DATA.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs md:text-sm font-medium text-slate-700">
                      <span className="inline-flex items-center gap-2">
                        {skill.icon}
                        {skill.name}
                      </span>
                      <span className="font-bold text-emerald-900">{skill.percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-1000"
                        style={{ width: `${skill.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 3D Mascot Canvas Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-3.5 rounded-3xl bg-white/75 backdrop-blur-md border border-emerald-600/25 shadow-sm space-y-3">
              {/* 3D Header Toolstrip */}
              <div className="flex items-center justify-between px-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" strokeWidth={2} />
                  Mascot 3D Tương Tác
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (threeStateRef.current) {
                        threeStateRef.current.isAutoRotate = !threeStateRef.current.isAutoRotate;
                      }
                      playInteractionSound(520);
                    }}
                    className="min-h-[34px] px-2.5 py-1 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 border border-emerald-200 transition-all inline-flex items-center gap-1"
                    title="Bật/Tắt tự xoay"
                  >
                    <RotateCw className="w-3 h-3 shrink-0" strokeWidth={2} />
                    <span>Tự xoay</span>
                  </button>
                  <button
                    onClick={() => {
                      if (threeStateRef.current?.camera) {
                        threeStateRef.current.camera.position.set(0, 0.6, 8.8);
                        threeStateRef.current.mascotGroup.rotation.y = 0;
                      }
                      playInteractionSound(620);
                    }}
                    className="min-h-[34px] px-2.5 py-1 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 border border-emerald-200 transition-all inline-flex items-center gap-1"
                    title="Đặt lại góc camera"
                  >
                    <Target className="w-3 h-3 shrink-0" strokeWidth={2} />
                    <span>Góc chuẩn</span>
                  </button>
                </div>
              </div>

              {/* Canvas Container */}
              <div
                ref={canvasContainerRef}
                className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-b from-white to-emerald-50/50 border border-emerald-200/50 touch-pan-y"
              >
                {!is3DLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#f6faf4]/90 z-10">
                    <Loader2 className="w-7 h-7 text-emerald-600 animate-spin shrink-0" strokeWidth={2} />
                    <span className="text-xs font-semibold text-emerald-900">Đang nạp không gian 3D...</span>
                  </div>
                )}
                {!isWebGLSupported && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/95 z-10">
                    <Compass className="w-8 h-8 text-emerald-600 mb-2 shrink-0" />
                    <h4 className="text-sm font-bold text-emerald-950">Mascot 3D</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Thiết bị đang chạy chế độ tiết kiệm năng lượng. Vui lòng kích hoạt WebGL để hiển thị 3D.
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Speech Bubble */}
              <div className="relative p-3 rounded-2xl bg-white border border-emerald-300 text-xs text-center font-medium text-emerald-950 shadow-xs">
                <span>{speechText}</span>
              </div>

              {/* Mobile Touch Hint */}
              <p className="text-[11px] text-center text-slate-500 font-medium inline-flex items-center justify-center w-full gap-1">
                <Compass className="w-3 h-3 text-emerald-600 shrink-0" />
                Dùng 1 ngón tay xoay 3D • Chạm để tương tác
              </p>
            </div>
          </div>
        </section>

        {/* --- Achievements Section (Filterable Grid) --- */}
        <section id="gallery-cute" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              Hồ Sơ Danh Hiệu
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
              THÀNH TỰU & CHỨNG NHẬN
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Ghi nhận hành trình nghiên cứu khoa học kỹ thuật, lập trình hệ thống và các giải thưởng AI danh giá.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { key: "all", label: "Tất cả (9)", icon: <Sparkles className="w-3.5 h-3.5 shrink-0" /> },
              { key: "google-ai", label: "Google & AI (3)", icon: <Bot className="w-3.5 h-3.5 shrink-0" /> },
              { key: "stem", label: "KHKT & STEM (4)", icon: <FlaskConical className="w-3.5 h-3.5 shrink-0" /> },
              { key: "honors", label: "Vinh danh (2)", icon: <Trophy className="w-3.5 h-3.5 shrink-0" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveFilter(tab.key);
                  playInteractionSound(540);
                }}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all active:scale-95 inline-flex items-center gap-1.5 ${
                  activeFilter === tab.key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Certificates Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => {
              const originalIndex = CERTIFICATES.findIndex((c) => c.id === cert.id);
              const isGoogle = cert.category === "google-ai";

              return (
                <div
                  key={cert.id}
                  onClick={() => handleOpenModal(originalIndex)}
                  className={`group relative flex flex-col p-4 rounded-3xl bg-white border cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98] ${
                    isGoogle
                      ? "border-blue-300/80 shadow-xs hover:border-blue-500 bg-gradient-to-b from-white to-blue-50/20"
                      : "border-emerald-200/80 shadow-xs hover:border-emerald-500"
                  }`}
                >
                  {/* Top Badge Ribbon */}
                  {cert.featuredRibbon && (
                    <div className="absolute top-6 right-6 z-10 px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white shadow-xs bg-gradient-to-r from-blue-600 to-indigo-600 inline-flex items-center gap-1">
                      {cert.featuredRibbon.includes("Quốc Tế") ? (
                        <Globe className="w-3 h-3 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                      )}
                      <span>{cert.featuredRibbon}</span>
                    </div>
                  )}

                  {/* Image Thumbnail */}
                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
                    <img
                      src={cert.img}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-emerald-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">
                        <Search className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                        Xem chi tiết
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="pt-4 flex flex-col flex-1 justify-between space-y-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            cert.tag.includes("Google")
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {cert.tag}
                        </span>
                        <span className="text-slate-600">{cert.year}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{cert.desc}</p>
                    </div>

                    <div className="pt-2 text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                      <span>Xem phóng to</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- Matcha Brewing Simulator (Game Area - 100% UNTOUCHED DOM/LOGIC) --- */}
        <section id="matcha-game" className="matcha-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">TIỆM TRÀ MATCHA LATTE</h2>
              <p className="section-desc">
                Hãy tự tay pha chế một ly Matcha Latte thơm lừng béo ngậy để cùng nhâm nhi nhé! 🍵
              </p>
            </div>

            <div className="game-box glassmorphism">
              <div className="game-left">
                <h3>Công thức pha chế</h3>
                <p>
                  Nhấp chuột vào từng nút nguyên liệu bên dưới để thả vào cốc, sau đó nhấn giữ và di chuyển chuột liên
                  tục trong cốc để khuấy đều nhé!
                </p>

                <div className="ingredients-list-cute">
                  <button className="ing-btn-cute" data-ingredient="matcha">
                    <span className="ing-icon-cute">🍵</span>
                    <span>Bột Matcha</span>
                  </button>
                  <button className="ing-btn-cute" data-ingredient="water">
                    <span className="ing-icon-cute">💧</span>
                    <span>Nước Sôi</span>
                  </button>
                  <button className="ing-btn-cute" data-ingredient="milk">
                    <span className="ing-icon-cute">🥛</span>
                    <span>Sữa Tươi</span>
                  </button>
                  <button className="ing-btn-cute" data-ingredient="sugar">
                    <span className="ing-icon-cute">🍯</span>
                    <span>Mật Ong</span>
                  </button>
                </div>
              </div>

              <div className="game-right">
                <div className="cup-container-cute">
                  <div id="matcha-cup" className="matcha-cup-cute">
                    <div className="cup-handle-cute" />
                    <div className="cup-body-cute">
                      <div className="liquid-wrapper-cute">
                        <div id="liquid-base" className="liquid-layer-cute" />
                        <div id="liquid-foam" className="liquid-layer-cute foam-layer" />
                        <div id="stirring-spiral" className="stirring-spiral-cute" />
                      </div>
                    </div>
                    <div className="cup-shadow-cute" />
                  </div>
                </div>

                <div className="brew-progress-box">
                  <span id="brew-progress-text">Thêm đầy đủ 4 nguyên liệu vào cốc...</span>
                  <div className="progress-bar-container-cute">
                    <div id="brew-progress-bar" className="progress-bar-fill-cute" />
                  </div>
                </div>
              </div>

              {/* Win Game Card Overlay */}
              <div id="game-win-overlay" className="game-win-overlay hidden">
                <div className="win-card glassmorphism">
                  <span className="win-emoji">🐻🍵🎉</span>
                  <h3>Ly Matcha đã hoàn thành!</h3>
                  <p>Bạn đã pha chế thành công một ly Matcha Latte thơm béo ngậy chuẩn gu vị giác của Quang rồi đó!</p>
                  <p className="win-quote">"Matcha đắng thanh hòa cùng sữa ngọt lành, khôi nguồn cảm hứng sáng tạo!"</p>
                  <button id="reset-game-btn" className="btn btn-cute">
                    Pha ly khác 🔄
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="mt-28 border-t border-emerald-600/15 bg-emerald-50/50 py-10 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-950 font-bold text-base">
            <Leaf className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
            <span>NGUYỄN DUY QUANG (Quang có Gờ)</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500">
            Google for Developers Participant • Đà Nẵng, Việt Nam
          </p>
        </div>
      </footer>

      {/* --- Mobile Bottom Navigation Dock (Ergonomic Touch Targets >= 44px) --- */}
      <nav
        className="fixed bottom-3 left-4 right-4 h-15 bg-white/95 backdrop-blur-md border border-emerald-200/80 rounded-3xl shadow-lg flex items-center justify-around px-2 z-50 md:hidden"
        aria-label="Mobile Navigation"
      >
        <a
          href="#hero"
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center flex-1 rounded-2xl active:scale-95 transition-all ${
            activeNavSection === "hero" ? "text-emerald-800 bg-emerald-50 font-bold" : "text-slate-500 font-medium"
          }`}
        >
          <User className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span className="text-[10px] mt-0.5">Giới thiệu</span>
        </a>
        <a
          href="#gallery-cute"
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center flex-1 rounded-2xl active:scale-95 transition-all ${
            activeNavSection === "gallery-cute"
              ? "text-emerald-800 bg-emerald-50 font-bold"
              : "text-slate-500 font-medium"
          }`}
        >
          <Award className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span className="text-[10px] mt-0.5">Thành tựu</span>
        </a>
        <a
          href="#matcha-game"
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center flex-1 rounded-2xl active:scale-95 transition-all ${
            activeNavSection === "matcha-game"
              ? "text-emerald-800 bg-emerald-50 font-bold"
              : "text-slate-500 font-medium"
          }`}
        >
          <Coffee className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span className="text-[10px] mt-0.5">Tiệm Trà</span>
        </a>
        <a
          href="#contact"
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center flex-1 rounded-2xl active:scale-95 transition-all ${
            activeNavSection === "contact" ? "text-emerald-800 bg-emerald-50 font-bold" : "text-slate-500 font-medium"
          }`}
        >
          <MessageCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span className="text-[10px] mt-0.5">Liên hệ</span>
        </a>
      </nav>

      {/* --- Lightbox Modal (Full Touch Navigation) --- */}
      {activeModalIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={handleCloseModal} />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-2xl z-10 border border-emerald-200">
            {/* Close Button - 44px touch area */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all"
              aria-label="Đóng"
            >
              <X className="w-5 h-5 shrink-0" strokeWidth={2} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-4 md:pt-0">
              <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                <img
                  src={CERTIFICATES[activeModalIndex].img}
                  alt={CERTIFICATES[activeModalIndex].title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                    {CERTIFICATES[activeModalIndex].tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {CERTIFICATES[activeModalIndex].year}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                  {CERTIFICATES[activeModalIndex].title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {CERTIFICATES[activeModalIndex].desc}
                </p>

                {/* Modal Navigation Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={handlePrevModal}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 shrink-0" />
                    <span>Trước</span>
                  </button>
                  <span className="text-xs font-bold text-slate-400">
                    {activeModalIndex + 1} / {CERTIFICATES.length}
                  </span>
                  <button
                    onClick={handleNextModal}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <span>Sau</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
