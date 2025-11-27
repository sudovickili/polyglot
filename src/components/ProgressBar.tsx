export function ProgressBar({
  percent,
  height,
}: {
  percent: number
  height: string
}) {
  return (
    <div className="bg-white/10 relative" style={{ height: height }}>
      <div
        className="bg-blue-500 absolute top-0 left-0 bottom-0"
        style={{
          width: `${percent}%`,
        }}
      />
    </div>
  )
}
