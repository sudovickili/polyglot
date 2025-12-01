import { Button } from "@/components/ui/button"
import { setEditingSecrets, setOpenAiSecrets } from "@/state/appSlice"
import { useAppDispatch, useAppState } from "@/state/hooks"

export function Secrets() {
  const dispatch = useAppDispatch()
  const secrets = useAppState((s) => s.secrets)

  return (
    <div className="flex flex-col gap-2 w-150 max-w-full">
      <h3 className="text-xl mb-2">Set OpenAI API Secrets To Continue</h3>
      <LabeledInput
        label="Org ID"
        val={secrets.openai.orgId}
        onChange={(newVal) =>
          dispatch(
            setOpenAiSecrets({
              ...secrets.openai,
              orgId: newVal,
            })
          )
        }
      />
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
          dispatch(setEditingSecrets(false))
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
      <p>{label}</p>
      <input
        type="password"
        className="bg-neutral-700 p-2 rounded-md"
        value={val}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
