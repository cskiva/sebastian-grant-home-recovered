import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <main className="min-h-screen grid place-items-center bg-[#05060f]">
      <Link href="art">
        <Button>Art</Button>
      </Link>
    </main>
  );
};

export default Page;
