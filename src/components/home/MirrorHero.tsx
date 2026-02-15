"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";

type Point = {
  x: number;
  y: number;
};

const MIRROR_SIDES = 6;
const BORDER_LAYERS = 6;

const buildMirrorPoints = (
  centerX: number,
  centerY: number,
  radius: number,
  time: number,
): Point[] => {
  const points: Point[] = [];
  const step = (Math.PI * 2) / MIRROR_SIDES;

  for (let index = 0; index < MIRROR_SIDES; index += 1) {
    const angle = -Math.PI / 2 + index * step;
    const pinched = index % 2 === 0 ? 1.08 : 0.76;
    const pulse = 1 + Math.sin(time * 1.4 + index * 0.8) * 0.04;
    const ripple = 1 + Math.cos(time * 0.9 + index * 1.3) * 0.05;
    const edgeRadius = radius * pinched * pulse * ripple;

    points.push({
      x: centerX + Math.cos(angle) * edgeRadius,
      y: centerY + Math.sin(angle) * edgeRadius,
    });
  }

  return points;
};

const drawPolygonPath = (
  context: CanvasRenderingContext2D,
  points: Point[],
): void => {
  if (!points.length) return;

  context.beginPath();
  context.moveTo(points[0].x, points[0].y);

  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index].x, points[index].y);
  }

  context.closePath();
};

export function MirrorHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    let animationFrame = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (timeMs: number) => {
      const time = timeMs / 1000;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const centerX = width / 2;
      const centerY = Math.min(height * 0.46, 420);
      const radius = Math.min(width, height) * 0.2;

      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, "#06050f");
      background.addColorStop(0.5, "#121131");
      background.addColorStop(1, "#070712");
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      context.save();
      context.globalAlpha = 0.18;
      context.strokeStyle = "#dce2ff";
      context.lineWidth = 0.4;

      for (let x = 0; x <= width; x += 30) {
        context.beginPath();
        context.moveTo(x + ((time * 6) % 30), 0);
        context.lineTo(x - 40, height);
        context.stroke();
      }
      context.restore();

      const mirrorPoints = buildMirrorPoints(centerX, centerY, radius, time);

      context.save();
      drawPolygonPath(context, mirrorPoints);
      context.clip();

      const mirrorFill = context.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.52,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.6,
      );
      mirrorFill.addColorStop(0, "rgba(240, 252, 255, 0.96)");
      mirrorFill.addColorStop(0.4, "rgba(165, 205, 255, 0.52)");
      mirrorFill.addColorStop(1, "rgba(11, 22, 58, 0.94)");
      context.fillStyle = mirrorFill;
      context.fillRect(
        centerX - radius * 1.6,
        centerY - radius * 1.6,
        radius * 3.2,
        radius * 3.2,
      );

      const ribbons = 68;

      for (let index = 0; index < ribbons; index += 1) {
        const ratio = index / (ribbons - 1);
        const y = centerY - radius + ratio * radius * 2;
        const swing = Math.sin(time * 1.8 + ratio * 18) * radius * 0.18;
        const drift = Math.cos(time * 1.3 + ratio * 12) * radius * 0.15;
        const hue = 188 + ratio * 120 + Math.sin(time + ratio * 7) * 16;
        context.strokeStyle = `hsla(${hue}, 88%, ${48 + ratio * 26}%, 0.24)`;
        context.lineWidth = 1.2 + Math.sin(time + ratio * 5) * 0.4;
        context.beginPath();
        context.moveTo(centerX - radius * 1.2, y);
        context.bezierCurveTo(
          centerX - radius * 0.42 + swing,
          y - radius * 0.34,
          centerX + radius * 0.44 - drift,
          y + radius * 0.34,
          centerX + radius * 1.2,
          y,
        );
        context.stroke();
      }

      context.globalCompositeOperation = "screen";
      context.fillStyle = "rgba(199, 255, 255, 0.09)";
      context.fillRect(
        centerX - radius * 1.4,
        centerY - radius * 1.4,
        radius * 2.8,
        radius * 2.8,
      );
      context.restore();

      for (let layer = 0; layer < BORDER_LAYERS; layer += 1) {
        const scale = 1 + layer * 0.035;
        const layerPoints = mirrorPoints.map((point) => ({
          x: centerX + (point.x - centerX) * scale,
          y: centerY + (point.y - centerY) * scale,
        }));

        context.save();
        context.lineWidth = Math.max(0.7, 2.8 - layer * 0.28);
        context.shadowBlur = Math.max(2, 18 - layer * 2);
        context.shadowColor = `hsla(${202 + layer * 12}, 95%, 72%, 0.45)`;
        context.strokeStyle = `hsla(${198 + layer * 11}, 100%, ${74 - layer * 7}%, ${0.74 - layer * 0.08})`;
        drawPolygonPath(context, layerPoints);
        context.stroke();
        context.restore();
      }

      const anchors: Point[] = [
        { x: centerX, y: centerY - radius * 1.56 },
        { x: centerX + radius * 1.58, y: centerY },
        { x: centerX, y: centerY + radius * 1.62 },
        { x: centerX - radius * 1.58, y: centerY },
      ];
      const targetIndices = [0, 3, 6, 9];

      anchors.forEach((anchor, index) => {
        const target = mirrorPoints[targetIndices[index]];
        context.save();
        context.strokeStyle = "rgba(220, 255, 255, 0.5)";
        context.lineWidth = 1.35;
        context.beginPath();
        context.moveTo(anchor.x, anchor.y);
        context.lineTo(target.x, target.y);
        context.stroke();
        context.fillStyle = "rgba(255, 255, 255, 0.95)";
        context.beginPath();
        context.arc(anchor.x, anchor.y, 2.8, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });

      const trailOrigins = [
        mirrorPoints[5],
        mirrorPoints[6],
        mirrorPoints[7],
        anchors[2],
      ];

      trailOrigins.forEach((origin, trailIndex) => {
        for (let strand = 0; strand < 3; strand += 1) {
          const wobble = Math.sin(time * 1.7 + strand + trailIndex) * 7;
          const terminal = origin.x + Math.sin(time + trailIndex + strand) * 24;
          context.strokeStyle = `rgba(176, 241, 255, ${0.26 - strand * 0.05})`;
          context.lineWidth = 1.2 - strand * 0.2;
          context.beginPath();
          context.moveTo(origin.x + wobble, origin.y);
          context.quadraticCurveTo(
            origin.x + wobble * 2.1,
            origin.y + height * 0.22,
            terminal,
            height + 30,
          );
          context.stroke();
        }
      });

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    animationFrame = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full"
      />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col justify-between px-6 pb-10 pt-20 sm:px-10">
        <div className="max-w-2xl">
          <p
            className="text-sm uppercase tracking-[0.42em] text-cyan-100/80"
            style={{
              fontFamily: '"Futura", "Avenir Next", "Gill Sans", sans-serif',
            }}
          >
            Fine Art + Graphic Design
          </p>
          <h1
            className="mt-4 text-5xl leading-[0.95] text-white sm:text-7xl"
            style={{
              fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif',
            }}
          >
            Sebastian Grant
          </h1>
          <p
            className="mt-6 max-w-xl text-base text-cyan-50/80 sm:text-lg"
            style={{
              fontFamily:
                '"Century Gothic", "Trebuchet MS", "Avenir Next", sans-serif',
            }}
          >
            A mirror-field of paintings, drawings, and design work. Enter the
            gallery and follow the studio milestones below.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/art"
              className="rounded-full border border-cyan-200/70 bg-cyan-100/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-900 transition hover:-translate-y-0.5 hover:bg-white"
            >
              Enter Gallery
            </Link>
            <Link
              href="#timeline"
              className="rounded-full border border-cyan-200/40 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-100/10"
            >
              View Timeline
            </Link>
          </div>
        </div>
        <div
          className="text-xs uppercase tracking-[0.3em] text-cyan-100/65"
          style={{
            fontFamily:
              '"Century Gothic", "Trebuchet MS", "Avenir Next", sans-serif',
          }}
        >
          12-sided mirror - 6 border layers - 4 anchor points
        </div>
      </div>
    </section>
  );
}
