import { FlameIcon } from "../..assets/streakIcon.png";

export default function StreakBadge({ count }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[var(--streak-light)] px-5 py-3 text-2xl font-bold text-[var(--streak-dark)]">
      <span>{count}</span>
    </div>
  );
}