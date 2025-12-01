import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { useAppDispatch, useAppState } from "@/state/hooks"
import {
  Grade,
  GradeLetter,
  gradeToStarCount,
  gradeToText,
  isPassingGrade,
  StarCount,
} from "./Grade"
import { CircleArrowRight, RotateCcw, Star } from "lucide-react"
import { retryStory } from "@/state/appSlice"
import { createStoryThunk } from "@/story/createStoryThunk"
import { StreamedState } from "@/util/StreamedState"
import { Button } from "@/components/ui/button"
import { StarsView } from "./StarsView"

export function GradeView({ className }: { className?: string }) {
  const grade = useAppState((s) => s.currentStory.grade)

  if (!grade) return null

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="m-10 p-8 max-w-[700px] bg-neutral-800 rounded-xl shadow-2xl">
        <StreamedGradeView grade={grade} />
      </div>
    </div>
  )
}

function StreamedGradeView({ grade }: { grade: StreamedState<Grade> }) {
  switch (grade.status) {
    case "idle":
      return <GradeLoadingView />
    case "loading": {
      if (grade.partial) {
        return <GradeSuccessView grade={grade.partial} />
      } else {
        return <GradeLoadingView />
      }
    }
    case "success":
      return <GradeSuccessView grade={grade.val} />
    case "error":
      return (
        <div className="flex flex-col gap-4">
          <p>Error grading summary: {grade.err}</p>
          <ClearErrorButton />
        </div>
      )
  }
}

function GradeLoadingView() {
  return (
    <div className="flex items-center gap-2">
      <Spinner className="w-6 h-6" />
      Grading
    </div>
  )
}

function GradeSuccessView({ grade }: { grade: Grade }) {
  const isPass = isPassingGrade(grade.letter)
  const text = gradeToText(grade.letter)

  return (
    <div className="flex flex-col gap-4 min-w-50">
      <div className="flex flex-col items-center gap-2">
        {/* <p className="text-4xl" style={{ color }}>
          {grade.letter} -
        </p> */}
        <p className="text-4xl">{text}</p>
        <StarsView grade={grade.letter} size="3rem" />
      </div>

      <p>{grade.reason}</p>

      {isPass ? <ContinueButton /> : <RetryButton />}
    </div>
  )
}

function RetryButton() {
  const dispatch = useAppDispatch()
  return (
    <Button
      icon={<RotateCcw />}
      label="Re-read Story"
      onClick={() => {
        dispatch(retryStory())
      }}
    />
  )
}

function ContinueButton() {
  const dispatch = useAppDispatch()

  return (
    <Button
      icon={<CircleArrowRight />}
      label="Continue"
      onClick={() => dispatch(createStoryThunk())}
    />
  )
}

function ClearErrorButton() {
  const dispatch = useAppDispatch()
  return (
    <Button
      icon={<CircleArrowRight />}
      label="Clear Error"
      onClick={() => dispatch(retryStory())}
    />
  )
}
