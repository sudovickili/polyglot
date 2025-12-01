import { Star } from "lucide-react"
import { GradeLetter, gradeToStarCount } from "./Grade"
import { cn } from "@/lib/utils"

interface Props {
  grade: GradeLetter
  size: string
}

export function StarsView({ grade, size }: Props) {
  const starCount = gradeToStarCount(grade)

  return (
    <div className="flex items-center" style={{ gap: `calc(${size} / 5)` }}>
      {Array.from({ length: 3 }, (_, i) => (
        <StarView key={i} filled={i < starCount} size={size} />
      ))}
    </div>
  )
}

function StarView({ filled, size }: { filled: boolean; size: string }) {
  return (
    <Star
      size={size}
      className={cn(
        filled ? "text-amber-100" : "text-gray-400",
        filled && "fill-amber-400"
      )}
    />
  )
}
