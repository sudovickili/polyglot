import { SetupModal } from "./modals/Setup"
import { useAppState } from "@/state/hooks"
import { PostStoryModal } from "./modals/PostStory"

export function ModalsView() {
  const modal = useAppState((s) => s.modal)

  if (modal === "Setup") return <SetupModal />
  if (modal === "PostStory") return <PostStoryModal />
}
