import { useAppDispatch, useAppState } from "../state/hooks"
import cn from "classnames"
import { clearHint } from "@/state/appSlice"
import { wrapClick } from "@/util/wrapClick"
import { useKeyboardHandling } from "@/state/useKeyboardHandling"
import { ProgressView } from "@/progress/ProgressView"
import { Home } from "./Home"
import { HistoryView } from "@/progress/HistoryView"
import { MenuBar } from "./MenuBar"
import { Secrets } from "./Secrets"
import { Modal } from "@/components/Modal"
import "@/dictionary/Dictionary" // Ensure dictionary is loaded

function App() {
  const dispatch = useAppDispatch()
  useKeyboardHandling()

  const nav = useAppState((s) => s.nav)
  const editingSecrets = useAppState((s) => s.secrets.editing)

  return (
    <div
      className={cn("w-full h-full bg-neutral-900 flex flex-col")}
      onClick={wrapClick((e) => {
        dispatch(clearHint())
      })}
    >
      <div className="flex-1 min-h-0">
        {nav === "Home" && <Home />}
        {nav === "Progress" && <ProgressView />}
        {nav === "History" && <HistoryView />}
      </div>
      <MenuBar className="bg-neutral-800 pointer-events-auto " />
      {editingSecrets && (
        <Modal>
          <Secrets />
        </Modal>
      )}
    </div>
  )
}

export default App
