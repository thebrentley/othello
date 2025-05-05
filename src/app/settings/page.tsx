"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store";
import { insertKnowledgeAction } from "@/store/gameSlice";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [knowledgeText, setKnowledgeText] = useState("");
  const [knowledgeKey, setKnowledgeKey] = useState("");
  const handleInsertKnowledge = () => {
    if (knowledgeText.trim()) {
      dispatch(
        insertKnowledgeAction({
          id: Date.now().toString(),
          key: knowledgeKey,
          text: knowledgeText,
        })
      );
      setKnowledgeText("");
      setKnowledgeKey("");
    }
  };

  return (
    <main className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button onClick={() => router.push("/")} className="px-4 py-2">
            Back to Game
          </Button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Knowledge Management</h2>
          <p className="text-gray-600 mb-4">
            Add Othello strategies, tips, or knowledge to help the AI make
            better moves.
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={knowledgeKey}
              onChange={(e) => setKnowledgeKey(e.target.value)}
              placeholder="Enter a label for this knowledge"
              className="w-full p-4 rounded-lg border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
            />
            <textarea
              value={knowledgeText}
              onChange={(e) => setKnowledgeText(e.target.value)}
              placeholder="Enter Othello knowledge or strategy..."
              className="w-full h-32 p-4 rounded-lg border border-gray-300 focus:border-green-700 focus:ring-1 focus:ring-green-700"
            />
            <Button
              onClick={handleInsertKnowledge}
              className="px-6 py-3 cursor-pointer"
              disabled={!knowledgeText.trim()}
            >
              Add Knowledge
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
