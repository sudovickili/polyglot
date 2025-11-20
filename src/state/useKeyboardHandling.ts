import { useDispatch } from "react-redux";
import { clearHint } from "./appSlice";
import { useEffect } from "react";

export function useKeyboardHandling() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(clearHint())
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
}