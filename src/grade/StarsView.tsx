import { Star } from "lucide-react"
import { StarCount } from "./Grade"
import { cn } from "@/lib/utils"

interface Props {
  stars: StarCount
  size: string
}

export function StarsView({ stars, size }: Props) {
  return (
    <div className="flex items-center" style={{ gap: `calc(${size} / 5)` }}>
      {Array.from({ length: 3 }, (_, i) => (
        <StarView key={i} filled={i < stars} size={size} />
      ))}
    </div>
  )
}

function StarView({ filled, size }: { filled: boolean; size: string }) {
  return <Star size={size} className={cn(filled && "fill-white")} />
}
