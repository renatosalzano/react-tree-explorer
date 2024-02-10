import { useEffect } from "react"

export function useMounted(onMounted: () => void) {
  useEffect(() => {
    onMounted()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useUnmounted(onUnmounted: () => void) {
  useEffect(() => {
    return () => {
      onUnmounted()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}