"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useReward } from "react-rewards";

export default function Page() {
  const { reward, isAnimating } = useReward("reward", "confetti");
  useEffect(() => {
    reward();
  }, []);

  return (
    <main className="h-[80vh] w-full flex flex-col space-y-6 justify-center items-center">
      <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Your answer has been submitted!
      </h1>
      <Button asChild variant="outline" id="reward">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back to home
        </Link>
      </Button>
    </main>
  );
}
