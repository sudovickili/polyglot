import { Stats } from "./progress/StatsView"
import { Story } from "./story/StoryView"
import cn from "classnames"

function App() {
  return (
    <div
      className={cn("w-screen h-screen bg-neutral-950", "flex items-stretch")}
    >
      <Story className="bg-neutral-950 flex-1 min-w-0 p-4" />
      <Stats className="bg-neutral-900 flex-1 min-w-0 p-4" />
    </div>
  )
}

export default App
