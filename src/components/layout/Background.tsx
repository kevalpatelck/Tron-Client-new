import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps {
  className?: string;
  density?: "low" | "medium" | "high";
  speed?: "slow" | "medium" | "fast";
  color?: "blue" | "purple" | "gradient";
}

const Background = ({
  className,
  density = "medium",
  speed = "medium",
  color = "gradient",
}: BackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Define circuit node points
    const getNodeCount = () => {
      switch (density) {
        case "low":
          return 50;
        case "high":
          return 150;
        case "medium":
        default:
          return 100;
      }
    };

    const getAnimationSpeed = () => {
      switch (speed) {
        case "slow":
          return 0.0005;
        case "fast":
          return 0.100;
        case "medium":
        default:
          return 0.001;
      }
    };

    const getColor = (alpha: number = 1) => {
      switch (color) {
        case "blue":
          return `rgba(64, 196, 255, ${alpha})`;
        case "purple":
          return `rgba(157, 78, 221, ${alpha})`;
        case "gradient":
        default:
          return ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      }
    };

    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = getNodeCount();
    const animationSpeed = getAnimationSpeed();

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * animationSpeed * 10,
        vy: (Math.random() - 0.5) * animationSpeed * 10,
      });
    }

    // Set up gradient if needed
    let gradient;
    if (color === "gradient") {
      gradient = getColor() as CanvasGradient;
      gradient.addColorStop(0, "rgba(64, 196, 255, 0.8)");
      gradient.addColorStop(1, "rgba(157, 78, 221, 0.8)");
    }

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      // Draw connections between nearby nodes
      ctx.beginPath();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
          }
        }
      }

      // Set line style
      ctx.strokeStyle = color === "gradient" ? gradient! : getColor(0.6);
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = color === "gradient" ? gradient! : getColor(0.8);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Make nodes slightly attracted to mouse position
      nodes.forEach((node) => {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          node.vx += dx * 0.00001;
          node.vy += dy * 0.00001;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed, color]);

  return (
    <div className={cn("fixed inset-0 z-0 bg-black", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "linear-gradient(to bottom, #0f0f1e, #1a1a2e)" }}
      />
    </div>
  );
};

export default Background;
