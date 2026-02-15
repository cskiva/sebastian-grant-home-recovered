import type { NextPage } from "next";
import { MilestoneTimeline } from "@/components/home/MilestoneTimeline";
import { MirrorHero } from "@/components/home/MirrorHero";
import { milestonePayload } from "@/data/milestones";

const Page: NextPage = () => {
  return (
    <main className="min-h-screen bg-[#05060f]">
      <MirrorHero />
      <MilestoneTimeline milestones={milestonePayload.milestones} />
    </main>
  );
};

export default Page;
