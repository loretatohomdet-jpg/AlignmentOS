export default function ProgressBar({ value }) {
  const clamped = Math.max(0, Math.min(100, value ?? 0));

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 text-sm text-alignment-accent/70">
        <span>Progress</span>
        <span className="font-medium text-alignment-accent">{Math.round(clamped)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-alignment-accent/5 overflow-hidden">
        <div
          className="h-full bg-alignment-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
