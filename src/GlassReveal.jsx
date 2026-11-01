
import { useEffect, useRef, useState } from "react";
import "./GlassReveal.css";

export default function GlassReveal({ children }) {
  const fogRef = useRef(null);
  const crystalRef = useRef(null);

  const drawing = useRef(false);
  const pointerId = useRef(null);
  const lastPoint = useRef(null);

  const particles = useRef([]);
  const animationRef = useRef(null);

  const strokeCount = useRef(0);
  const strokeDistance = useRef(0);
  const finished = useRef(false);

  const [revealed, setRevealed] = useState(false);
  const [touched, setTouched] = useState(false);

  const colors = [
    "#ffffff",
    "#fff3a3",
    "#ffd700",
    "#ffb000",
    "#ff5252",
    "#e53935",
    "#ff8a80",
    "#ffc1e3",
    "#e1b5ff",
    "#c9b6ff"
  ];

  // ساخت بخار روی شیشه
  useEffect(() => {
    const canvas = fogRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const createFog = () => {
      if (finished.current) return;

      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // لایه اصلی بخار
      ctx.fillStyle = "rgba(238,235,242,0.96)";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // بافت ابری و طبیعی
      for (let i = 0; i < 180; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const radius = 20 + Math.random() * 85;

        const gradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, radius
        );

        gradient.addColorStop(
          0,
          `rgba(255,255,255,${0.12 + Math.random() * 0.18})`
        );
        gradient.addColorStop(0.5, "rgba(255,255,255,0.10)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // رگه‌های نرم بخار
      ctx.save();
      ctx.filter = "blur(16px)";
      ctx.lineCap = "round";

      for (let i = 0; i < 75; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x + Math.random() * 50,
          y + Math.random() * 30,
          x - Math.random() * 50,
          y + Math.random() * 50,
          x + Math.random() * 80,
          y + Math.random() * 30
        );

        ctx.strokeStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.12})`;
        ctx.lineWidth = 12 + Math.random() * 20;
        ctx.stroke();
      }

      ctx.restore();
    };

    createFog();

    const observer = new ResizeObserver(createFog);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  // اضافه کردن کریستال
  const addParticle = (x, y, explosion = false) => {
    const angle = Math.random() * Math.PI * 2;

    const speed = explosion
      ? 5 + Math.random() * 13
      : 2 + Math.random() * 6;

    particles.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: explosion
        ? 2 + Math.random() * 7
        : 1.5 + Math.random() * 4,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      life: 1,
      decay: explosion
        ? 0.006 + Math.random() * 0.009
        : 0.012 + Math.random() * 0.018,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  };

  // کریستال‌های اطراف انگشت
  const createCrystals = (x, y, count = 12) => {
    for (let i = 0; i < count; i++) {
      addParticle(x, y);
    }

    startAnimation();
  };

  // انفجار نهایی
  const crystalExplosion = () => {
    const canvas = crystalRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let wave = 0; wave < 3; wave++) {
      for (let i = 0; i < 85; i++) {
        const angle = (Math.PI * 2 * i) / 85 + Math.random() * 0.12;
        const speed = 5 + Math.random() * 12 + wave * 2;

        particles.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 7,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          life: 1,
          decay: 0.005 + Math.random() * 0.009,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    startAnimation();
  };

  // انیمیشن کریستال‌ها
  const startAnimation = () => {
    if (animationRef.current) return;

    const animate = () => {
      const canvas = crystalRef.current;

      if (!canvas) {
        animationRef.current = null;
        return;
      }

      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      particles.current = particles.current.filter(
        (p) => p.life > 0
      );

      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vy += 0.025;
        p.rotation += p.spin;
        p.life -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.life);

        ctx.shadowBlur = 18;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.moveTo(0, -p.size * 2);
        ctx.lineTo(p.size, -p.size * 0.3);
        ctx.lineTo(p.size * 0.7, p.size * 1.5);
        ctx.lineTo(-p.size * 0.7, p.size * 1.5);
        ctx.lineTo(-p.size, -p.size * 0.3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-p.size * 0.25, -p.size * 0.3, 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      if (particles.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // پاک‌کردن طبیعی بخار زیر انگشت
  const eraseAt = (x, y, radius) => {
    const canvas = fogRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";

    const gradient = ctx.createRadialGradient(
      x, y, radius * 0.12,
      x, y, radius
    );

    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0.96)");
    gradient.addColorStop(0.82, "rgba(0,0,0,0.68)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // رسم مسیر پاک‌کردن
  const eraseBetween = (from, to, radius) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const spacing = Math.max(3, radius * 0.18);
    const steps = Math.max(1, Math.ceil(distance / spacing));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;

      const x = from.x + dx * t;
      const y = from.y + dy * t;

      eraseAt(x, y, radius);
    }
  };

  // پایان پاک‌کردن
  const finishReveal = () => {
    if (finished.current) return;

    finished.current = true;

    const canvas = fogRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    crystalExplosion();
    setRevealed(true);
  };

  // شروع هر بار کشیدن
  const handlePointerDown = (e) => {
    if (finished.current || drawing.current) return;

    const canvas = fogRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawing.current = true;
    pointerId.current = e.pointerId;
    lastPoint.current = { x, y };

    strokeCount.current += 1;
    strokeDistance.current = 0;

    setTouched(true);

    canvas.setPointerCapture(e.pointerId);

    const radius = Math.max(24, rect.width * 0.20);

    eraseAt(x, y, radius);
    createCrystals(x, y, 12);

    if (strokeCount.current >= 3) {
      // حرکت سوم بخار را کامل پاک می‌کند
      return;
    }
  };

  // ادامه کشیدن انگشت
  const handlePointerMove = (e) => {
    if (!drawing.current || finished.current) return;
    if (e.pointerId !== pointerId.current) return;

    const canvas = fogRef.current;
    const rect = canvas.getBoundingClientRect();

    const current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    const previous = lastPoint.current;
    if (!previous) return;

    const dx = current.x - previous.x;
    const dy = current.y - previous.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    strokeDistance.current += distance;

    const radius = Math.max(24, rect.width * 0.075);

    // سه مرحله پاک‌کردن
    eraseBetween(previous, current, radius);

    // ذرات در طول مسیر
    if (distance > 3) {
      createCrystals(current.x, current.y, 2);
    }

    lastPoint.current = current;
  };

  // پایان یک حرکت
  const handlePointerUp = (e) => {
    if (e.pointerId !== pointerId.current) return;

    drawing.current = false;
    pointerId.current = null;
    lastPoint.current = null;

    // اگر سومین حرکت تمام شد، انفجار نهایی
    if (strokeCount.current >= 3) {
      finishReveal();
    }
  };

  // لغو حرکت
  const handlePointerCancel = () => {
    drawing.current = false;
    pointerId.current = null;
    lastPoint.current = null;
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="glass-reveal">
      <div className="glass-content">
        {children}
      </div>

      {!revealed && (
        <>
          <canvas
            ref={fogRef}
            className="glass-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          />

          {!touched && (
            <div className="glass-hint">
              <span className="hand-icon">👆</span>
            </div>
          )}
        </>
      )}

      <canvas
        ref={crystalRef}
        className="crystal-canvas"
      />
    </div>
  );
}
