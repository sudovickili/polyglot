import { AudioLines, Volume2 } from "lucide-react"
import { useState, useRef } from "react"

/** For zh, wiktionary expects numbered pinyin (e.g. "yi1") */
export function WordPlayer({ wiktionary }: { wiktionary: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const url = `https://upload.wikimedia.org/wikipedia/commons/9/94/Zh-${wiktionary}.ogg`

  const handleClick = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(url)
        audioRef.current.addEventListener("ended", () => setIsPlaying(false))
        audioRef.current.addEventListener("error", () => setIsPlaying(false))
      }

      setIsPlaying(true)
      await audioRef.current.play()
    } catch (error) {
      console.error("Failed to play audio:", error)
      setIsPlaying(false)
    }
  }

  return isPlaying ? (
    <AudioLines onClick={handleClick} className="animate-pulse" />
  ) : (
    <Volume2 onClick={handleClick} />
  )
}
