import { cn } from "@/lib/utils"

interface Props {
  isEnabled: boolean
  onToggle: () => void
}

export function TraditionalToggle({ isEnabled, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={cn("flex flex-col items-end opacity-50 font-light")}
    >
      <span className={"text-sm -mb-1"}>
        {isEnabled ? "Traditional" : "Simplified"}
      </span>
      <span>{isEnabled ? "繁體字" : "简体字"}</span>{" "}
    </button>
  )
}
