import { cn } from "@/lib/utils"
import { setDebugMode } from "@/state/appSlice"
import { useState } from "react"
import { useDispatch } from "react-redux"

export const DEBUG_SECRET = "boop"
export const UNDEBUG_SECRET = "unboop"

export function DebugInput({ className }: { className?: string }) {
  const dispatch = useDispatch()
  const [value, setValue] = useState("")

  return (
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        if (e.target.value === DEBUG_SECRET) {
          dispatch(setDebugMode(true))
        } else {
          dispatch(setDebugMode(false))
        }
      }}
      className={cn("w-20 border", className)}
    ></input>
  )
}
