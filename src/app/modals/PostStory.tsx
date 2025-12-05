import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/button"
import { setModal } from "@/state/appSlice"
import { useAppDispatch, useAppState } from "@/state/hooks"

export function PostStoryModal() {
  return (
    <Modal>
      <PostStory />
    </Modal>
  )
}

function PostStory() {
  const newKnownWords = useAppState((s) => s.progress.newKnownWords)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-2 items-center min-w-50">
      {newKnownWords.length > 0 && (
        <>
          <h3 className="text-3xl">Great Job 🔥</h3>
          <p className="text-lg opacity-50">
            {newKnownWords.length} new known words
          </p>
          <p className="mb-2 -mt-2 opacity-70 text-xl">
            {newKnownWords.join(" ")}
          </p>
        </>
      )}
      <Button
        className="self-stretch"
        label="Continue"
        onClick={() => dispatch(setModal(null))}
      />
    </div>
  )
}
