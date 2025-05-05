"use client";

import { useRouter } from "next/navigation";
import { Gear } from "@phosphor-icons/react";
import Button from "@/components/atoms/Button";

export default function Header() {
  const router = useRouter();

  return (
    <header className="w-full bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          Othello
        </h1>
        {/* <Button
          onClick={() => router.push("/settings")}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Gear size={24} weight="bold" />
        </Button> */}
      </div>
    </header>
  );
}
