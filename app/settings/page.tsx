"use client";

import { useEffect, useState } from "react";
import { store } from "@/lib/localStore";

export default function SettingsPage() {
  const [goal, setGoal] = useState(10);

  useEffect(() => {
    const s = store.getSettings();
    setGoal(s.monthlyGoal);
  }, []);

  function save() {
    store.saveSettings({ monthlyGoal: goal });
    alert("저장했어요!");
  }

  return (
    <div className="space-y-4">
      <h1>설정</h1>
      <label className="flex gap-2 items-center">
        이번 달 목표 독서 일수
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(parseInt(e.target.value || "0", 10))}
          className="border-2 border-black px-2 py-1 w-24"
        />
      </label>
      <button onClick={save} className="pixel-btn">
        저장
      </button>
    </div>
  );
}
