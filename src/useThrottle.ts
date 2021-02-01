import { useEffect, useRef, useState } from "react"
import { throttle } from "lodash-es"
import { UseThrottle } from "./types"

export const useThrottle: UseThrottle = <TValue>(
  value: TValue,
  delay,
  options
) => {
  const [state, setState] = useState<TValue | null>(
    typeof value === "function" ? null : value
  )
  const callback = throttle(
    (...args) => {
      if (typeof ref.current.value === "function") {
        ref.current.value(...args)
      } else {
        setState(ref.current.value)
      }
    },
    delay,
    options
  )

  const ref = useRef({ value, callback })

  useEffect(() => {
    ref.current.value = value

    if (typeof ref.current.value !== "function") {
      ref.current.callback()
    }
  }, [value])

  return typeof ref.current.value === "function"
    ? (ref.current.callback as any)
    : state
}
