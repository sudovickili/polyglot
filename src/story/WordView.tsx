import { Popover } from "radix-ui"
import { useRef } from "react"
import { useAppState, useAppDispatch } from "@/state/hooks"
import { hint } from "@/state/appSlice"
import { HintView } from "./HintView"
import { wrapClick } from "@/util/wrapClick"
import { ParsedWord } from "./Story"
import { cn } from "@/lib/utils"

const className = "group p-1 rounded relative"

export function SimpleWordView({ word }: { word: string }) {
  return <span className={className}>{word}</span>
}

export function WordView({ word }: { word: ParsedWord }) {
  const hintLevel = useAppState((state) => {
    if (state.hint && state.hint.word.parsedId === word.parsedId) {
      return state.hint.level
    } else {
      return 0
    }
  })
  const dispatch = useAppDispatch()
  const anchorRef = useRef<HTMLSpanElement | null>(null)

  return (
    <Popover.Root
      open={hintLevel > 0}
      // onOpenChange
    >
      <Popover.Anchor asChild>
        <span
          ref={anchorRef}
          onClick={wrapClick((e) => {
            e.preventDefault()
            dispatch(
              hint({
                word,
                level: hintLevel > 0 ? hintLevel + 1 : 1,
              })
            )
          })}
          className={cn(className)}
        >
          {word.word}
        </span>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          sideOffset={5}
          collisionPadding={20}
          className="focus:outline-none"
        >
          <HintView word={word} />
          <Popover.Arrow className="fill-blue-400" width={15} height={8} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
