import { ChevronRight } from "lucide-react"
import { WordProgress } from "./Progress"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { dict } from "@/dictionary/Dictionary"
import { WordProgressView } from "./WordProgressView"
import { getClassName, getRarity } from "@/dictionary/WordRarity"

export function WordProgressGroup({
  label,
  description,
  words,
  selected,
  setSelected,
  collapsedOnRender,
}: {
  label: string
  description?: string
  words: WordProgress[]
  selected: WordProgress | null
  setSelected: (word: WordProgress | null) => void
  collapsedOnRender?: boolean
}) {
  const [collapsed, setCollapsed] = useState(collapsedOnRender ?? false)

  return (
    <div>
      <div
        className="text-xl mb-2 flex items-baseline gap-2 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <ChevronRight
          size="1rem"
          className={cn(
            "transition-transform duration-200",
            collapsed ? "" : "rotate-90"
          )}
        />
        {label}
        <span className="text-sm opacity-50">({words.length})</span>
        <span className="text-sm opacity-50">{description}</span>
      </div>
      {!collapsed && (
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {words
            .sort(
              (a, b) =>
                (dict.frequncyRanking(a.word) ?? 0) -
                (dict.frequncyRanking(b.word) ?? 0)
            )
            .map((w) => {
              const rarity = getRarity(dict.frequncyRanking(w.word) ?? 0)

              return (
                <WordProgressView
                  key={w.word}
                  wordProgress={w}
                  selected={selected?.word === w.word}
                  onMouseEnter={() => {
                    setSelected(w)
                  }}
                  onMouseLeave={() => {
                    setSelected(null)
                  }}
                  className={cn("p-1 -m-1 text-xl", getClassName(rarity))}
                />
              )
            })}
        </div>
      )}
    </div>
  )
}
