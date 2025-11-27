import { Popover } from "radix-ui"
import { WordProgress } from "./Progress"
import { cn } from "@/lib/utils"

interface Props {
  wordProgress: WordProgress
  selected: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  className?: string
}

export function WordProgressView({
  wordProgress,
  selected,
  onMouseEnter,
  onMouseLeave,
  className,
}: Props) {
  return (
    <Popover.Root open={selected}>
      <Popover.Anchor asChild>
        <span
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={cn(className)}
        >
          {wordProgress.word}
        </span>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          sideOffset={5}
          collisionPadding={20}
          className="focus:outline-none"
        >
          <WordProgressPopover wordProgress={wordProgress} />
          <Popover.Arrow className="fill-blue-400" width={15} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

function WordProgressPopover({ wordProgress }: Pick<Props, "wordProgress">) {
  return (
    <div className={cn("bg-blue-400 text-white rounded-sm p-2 text-sm")}>
      <p className="">{wordProgress.nSeen} seen</p>
      <p className="">{wordProgress.nHints} hints</p>
    </div>
  )
}
