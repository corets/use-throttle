export type UseThrottle = <TValue = any>(
  initialState: TValue,
  delay: number,
  options?: UseThrottleOptions
) => TValue

export type UseThrottleOptions = {
  leading?: boolean
  trailing?: boolean
}
