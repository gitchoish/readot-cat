"use client";

import { useEffect, useState } from "react";
import { store } from "@/lib/localStore";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export default function SettingsModal({
  open,
  onClose,
  onSaved,
}: SettingsModalProps) {
  const [monthlyGoal, setMonthlyGoal] = useState(10);

  // 열릴 때마다 저장된 값 불러오기
  useEffect(() => {
    if (!open) return;
    const s = store.getSettings();
    setMonthlyGoal(s.monthlyGoal ?? 10);
  }, [open]);

  if (!open) return null;

  function handleSave() {
    const goal = Math.max(1, Number(monthlyGoal) || 1);
    store.storeSettings({ monthlyGoal: goal });
    onSaved?.();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white border-2 border-black rounded-md p-4 w-[280px]">
        <div className="font-bold mb-2">목표 설정</div>
        <p className="text-sm mb-3">이번 달 몇 일이나 읽을 건가요?</p>
        <input
          type="number"
          value={monthlyGoal}
          onChange={(e) => setMonthlyGoal(parseInt(e.target.value, 10))}
          className="w-full border-2 border-black rounded px-2 py-1 mb-3"
          min={1}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="border-2 border-black px-3 py-1 rounded bg-white"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="border-2 border-black px-3 py-1 rounded bg-black text-white"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
