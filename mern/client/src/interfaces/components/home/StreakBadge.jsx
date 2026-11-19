import streakIcon from "../../../assets/streakIcon.png";

export default function StreakBadge({ count }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[var(--streak-light)] px-5 py-3 text-2xl font-bold text-[var(--streak-dark)]">
      <img src={streakIcon} alt="" className="h-7 w-7" />
      <span>{count}</span>
      <span className="sr-only">day streak</span>
    </div>
  );
}