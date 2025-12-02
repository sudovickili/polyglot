import { Button } from "@/components/ui/button"
import { setModal, setOpenAiSecrets } from "@/state/appSlice"
import { useAppDispatch, useAppState } from "@/state/hooks"

export function Setup() {
  const dispatch = useAppDispatch()
  const secrets = useAppState((s) => s.secrets)

  return (
    <div className="flex flex-col gap-2 w-150 max-w-full">
      <p className="-mb-1">Tutorial</p>
      <ul className="bg-neutral-900 rounded-sm text-sm p-2 flex flex-col gap-1 list-disc list-inside">
        <li>Click a word once to see the pinyin</li>
        <li>Click again to see the definition</li>
        <li>Summarize the story to start the next one</li>
        <li>Check your skill in the Stats tab</li>
      </ul>
      <div className="h-px bg-white/10" />
      <h3 className="mb-0">⚠️ Required Secrets ⚠️</h3>
      <LabeledInput
        label="API Key"
        val={secrets.openai.apiKey}
        onChange={(newVal) =>
          dispatch(
            setOpenAiSecrets({
              ...secrets.openai,
              apiKey: newVal,
            })
          )
        }
      />
      <Button
        className="mt-2"
        label="Done"
        onClick={() => {
          dispatch(setModal(null))
        }}
      />
    </div>
  )
}

export function LabeledInput({
  label,
  val,
  onChange,
}: {
  label: string
  val: string
  onChange: (newVal: string) => void
}) {
  return (
    <div className="flex flex-col">
      <p className="text-sm opacity-50">{label}</p>
      <input
        className="bg-neutral-700 p-2 rounded-md"
        value={val}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
