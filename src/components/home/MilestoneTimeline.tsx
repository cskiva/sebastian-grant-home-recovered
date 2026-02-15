"use client";

import type { PortfolioMilestone } from "@/data/milestones";
import { useEffect, useRef, useState } from "react";

type MilestoneTimelineProps = {
  milestones: PortfolioMilestone[];
};

const trackStyles: Record<
  PortfolioMilestone["track"],
  { badge: string; glow: string }
> = {
  "Fine Art": {
    badge: "border-amber-300/50 bg-amber-200/15 text-amber-100",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.25)]",
  },
  "Graphic Design": {
    badge: "border-cyan-300/50 bg-cyan-200/15 text-cyan-100",
    glow: "shadow-[0_0_40px_rgba(34,211,238,0.25)]",
  },
  Software: {
    badge: "border-lime-300/50 bg-lime-200/15 text-lime-100",
    glow: "shadow-[0_0_40px_rgba(163,230,53,0.23)]",
  },
  Music: {
    badge: "border-fuchsia-300/50 bg-fuchsia-200/15 text-fuchsia-100",
    glow: "shadow-[0_0_40px_rgba(232,121,249,0.23)]",
  },
};

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setRevealed((current) => {
          const next = { ...current };
          let changed = false;

          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("data-milestone-id");
            if (!id || next[id]) return;
            next[id] = true;
            changed = true;
          });

          return changed ? next : current;
        });
      },
      { rootMargin: "0px 0px -14% 0px", threshold: 0.24 }
    );

    itemRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [milestones.length]);

  return (
    <section
      id="timeline"
      className="relative overflow-hidden bg-[radial-gradient(120%_100%_at_20%_0%,#1e2a58_0%,#080a12_45%,#030307_100%)] px-6 pb-24 pt-24 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p
            className="text-sm uppercase tracking-[0.42em] text-cyan-100/70"
            style={{
              fontFamily: '"Futura", "Avenir Next", "Gill Sans", sans-serif',
            }}
          >
            Studio Timeline
          </p>
          <h2
            className="mt-3 text-4xl text-white sm:text-5xl"
            style={{
              fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif',
            }}
          >
            Milestones as Payload Objects
          </h2>
          <p className="mt-5 text-cyan-50/75">
            Timeline entries are structured as milestone payload objects so the
            same schema can drive this front page, archive views, and future CMS
            controls.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-3 top-0 h-full w-px bg-gradient-to-b from-cyan-200/70 via-cyan-200/35 to-transparent md:left-1/2 md:-translate-x-1/2" />
          <ol className="space-y-10 md:space-y-14">
            {milestones.map((milestone, index) => {
              const isLeft = index % 2 === 0;
              const isVisible = Boolean(revealed[milestone.id]);
              const trackClass = trackStyles[milestone.track];

              return (
                <li
                  key={milestone.id}
                  data-milestone-id={milestone.id}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  className="relative pl-12 md:pl-0"
                >
                  <div className="absolute left-3 top-8 h-3 w-3 -translate-x-1/2 rounded-full border border-cyan-100/70 bg-cyan-100/80 shadow-[0_0_14px_rgba(125,211,252,0.8)] md:left-1/2" />

                  <article
                    className={`rounded-3xl border border-white/15 bg-black/35 p-5 text-cyan-50/95 backdrop-blur-sm transition-all duration-700 md:w-[calc(50%-2.5rem)] ${
                      isLeft ? "md:mr-auto" : "md:ml-auto"
                    } ${trackClass.glow} ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em]">
                      <span className="rounded-full border border-white/25 px-3 py-1 text-white">
                        {milestone.year}
                      </span>
                      <span className={`rounded-full border px-3 py-1 ${trackClass.badge}`}>
                        {milestone.track}
                      </span>
                      {milestone.location && (
                        <span className="rounded-full border border-white/20 px-3 py-1 text-cyan-100/80">
                          {milestone.location}
                        </span>
                      )}
                    </div>

                    <h3
                      className="mt-4 text-2xl text-white"
                      style={{
                        fontFamily:
                          '"Century Schoolbook", "Palatino Linotype", serif',
                      }}
                    >
                      {milestone.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-cyan-50/80">
                      {milestone.summary}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {milestone.deliverables.map((deliverable) => (
                        <li
                          key={`${milestone.id}-${deliverable}`}
                          className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-cyan-50/80"
                        >
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
