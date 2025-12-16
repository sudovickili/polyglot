import {
  StackedBarChart,
  StackedBarChartLegend,
  StackedBarEntry,
} from "@/components/StackedBarChart"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { targetBucketWeights } from "@/progress/preferredWordsByBucket"
import { useState } from "react"
import { colorByBucket } from "./statusBuckets"

export function DebugPreferredBuckets({ className }: { className?: string }) {
  const [ratio, setRatio] = useState(0.5)

  const targetWeights = targetBucketWeights(ratio)

  const targetEntries: StackedBarEntry[] = Object.entries(targetWeights).map(
    ([key, weight]) => ({
      label: key,
      color: colorByBucket[key],
      weight,
    })
  )

  return (
    <div className={cn(className, "flex flex-col gap-4")}>
      Buckets by H/S Ratio {ratio.toFixed(2)}
      <StackedBarChart
        title="Target (based on H/S Ratio)"
        entries={targetEntries}
      />
      <StackedBarChartLegend entries={targetEntries} />
      <div className="px-4">
        <Slider
          value={[ratio]}
          onValueChange={(value) => setRatio(value[0])}
          min={0}
          max={1}
          step={0.001}
          className="h-8"
        />
      </div>
    </div>
  )
}
