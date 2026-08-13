"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  color: string;
  type: "petal" | "dust";
}

export function SakuraParticles({
  count = 15,
  isFixed = false,
  className = "",
}: {
  count?: number;
  isFixed?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = isFixed ? window.innerWidth : canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = isFixed ? window.innerHeight : canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = isFixed ? window.innerWidth : canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = isFixed ? window.innerHeight : canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Initialize particles with reduced count
    const particles: Particle[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 3,
      speedX: Math.random() * 0.6 - 0.3 + 0.2,
      speedY: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      opacity: Math.random() * 0.4 + 0.15,
      color: Math.random() > 0.4 ? "rgba(211,47,47," : Math.random() > 0.5 ? "rgba(250,248,243," : "rgba(255,182,193,",
      type: Math.random() > 0.3 ? "petal" : "dust",
    }));

    let time = 0;
    let lastFrame = 0;
    const TARGET_FPS = 30; // Cap at 30fps — sakura petals don't need 60fps
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);

      const delta = timestamp - lastFrame;
      if (delta < FRAME_INTERVAL) return;
      lastFrame = timestamp - (delta % FRAME_INTERVAL);

      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX + Math.sin(time + p.y * 0.005) * 0.3;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "petal") {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size, -p.size, p.size * 1.5, p.size, 0, p.size * 1.8);
          ctx.bezierCurveTo(-p.size * 1.5, p.size, -p.size, -p.size, 0, 0);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity * 0.8})`;
          ctx.fill();
        }

        ctx.restore();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, isFixed]);

  return (
    <canvas
      ref={canvasRef}
      className={`${isFixed ? "fixed inset-0 pointer-events-none z-[40]" : "absolute inset-0 pointer-events-none z-10"} ${className}`}
    />
  );
}
