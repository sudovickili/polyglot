import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { navigate, setEditingSecrets } from "@/state/appSlice"
import { useAppDispatch, useAppState } from "@/state/hooks"
import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  GraduationCap,
  History,
} from "lucide-react"
import { act } from "react"

export function MenuBar({ className }: { className?: string }) {
  const dispatch = useAppDispatch()
  const nav = useAppState((s) => s.nav)

  return (
    <div className={cn("flex", className)}>
      <Button
        label="Set Secrets"
        variant="invisible"
        className="shrink min-w-0"
      />
      <div className="flex-1 " />
      <MenuItem
        icon={<History />}
        onClick={() => dispatch(navigate("History"))}
        active={nav === "History"}
      />
      <MenuItem
        icon={<BookOpen />}
        onClick={() => dispatch(navigate("Home"))}
        active={nav === "Home"}
      />
      <MenuItem
        icon={<ChartNoAxesColumnIncreasing />}
        onClick={() => dispatch(navigate("Progress"))}
        active={nav === "Progress"}
      />
      {/* <MenuItem
        icon={<GraduationCap />}
        onClick={() => dispatch(navigate("Progress"))}
      /> */}
      <div className="flex-1" />
      <Button
        label="Set Secrets"
        variant="link"
        className="opacity-50 text-sm"
        onClick={() => dispatch(setEditingSecrets(true))}
      />
    </div>
  )
}

function MenuItem({
  onClick,
  icon,
  active,
}: {
  onClick: () => void
  icon: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 hover:bg-white/5",
        active && "bg-white/10 hover:bg-white/10"
      )}
    >
      {icon}
    </button>
  )
}
