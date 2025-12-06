import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/button"
import { navigate, setModal } from "@/state/appSlice"
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
    <div className="flex flex-col gap-4 items-center min-w-50">
      {newKnownWords.length > 0 && (
        <>
          <h3 className="text-3xl">Great Job 🔥</h3>
          <p className="text-lg opacity-50 -mb-4">
            {newKnownWords.length} new known words
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-0 opacity-70">
            {newKnownWords.map((w) => (
              <p>{w}</p>
            ))}
            <p className="mb-2 -mt-2 opacity-70 text-xl"></p>
          </div>
        </>
      )}
      <div className="self-stretch flex gap-2">
        <Button
          className="flex-1"
          label="See All"
          onClick={() => {
            dispatch(navigate("Progress"))
            dispatch(setModal(null))
          }}
          variant="outline"
        />
        <Button
          className="flex-1"
          label="Continue"
          onClick={() => dispatch(setModal(null))}
        />
      </div>
    </div>
  )
}
