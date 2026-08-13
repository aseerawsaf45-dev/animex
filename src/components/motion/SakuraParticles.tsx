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
  count = 25,
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = isFixed ? window.innerWidth : canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = isFixed ? window.innerHeight : canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = isFixed ? window.innerWidth : canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = isFixed ? window.innerHeight : canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize Sakura Petals & Red/White Dust
    const particles: Particle[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 6 + 3,
      speedX: Math.random() * 0.8 - 0.4 + 0.3, // Mild rightward wind
      speedY: Math.random() * 0.7 + 0.3,       // Slow downward drift
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.4 ? "rgba(211,47,47," : Math.random() > 0.5 ? "rgba(250,248,243," : "rgba(255,182,193,",
      type: Math.random() > 0.3 ? "petal" : "dust",
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX + Math.sin(time + p.y * 0.005) * 0.4;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        // Wrap around boundaries smoothly
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "petal") {
          // Draw subtle organic Sakura petal shape
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size, -p.size, p.size * 1.5, p.size, 0, p.size * 1.8);
          ctx.bezierCurveTo(-p.size * 1.5, p.size, -p.size, -p.size, 0, 0);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.fill();
        } else {
          // Draw tiny floating dust/ember particle
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity * 0.8})`;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

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
