import React, { useState } from "react"
import { useThrottle } from "./useThrottle"
import { createTimeout } from "@corets/promise-helpers"
import { act, render, screen } from "@testing-library/react"

describe("useThrottle", () => {
  it("throttles value", async () => {
    let renders = 0
    let _count
    let _setCount

    const Test = () => {
      renders++

      const [count, setCount] = useState(0)
      _count = count
      _setCount = setCount

      const debouncedCount = useThrottle(count, 30)

      return <h1>{renders},{count},{debouncedCount}</h1>
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("1,0,0")

    act(() => _setCount(1))

    expect(target).toHaveTextContent("3,1,1")

    act(() => _setCount(2))

    expect(target).toHaveTextContent("4,2,1")

    await act(() => createTimeout(10))

    expect(target).toHaveTextContent("4,2,1")

    await act(() => createTimeout(0))

    act(() => _setCount(3))

    expect(target).toHaveTextContent("5,3,1")

    await act(() => createTimeout(30))

    expect(target).toHaveTextContent("6,3,3")
  })

  it("throttles function", async () => {
    let renders = 0
    let _increment

    const Test = () => {
      renders++

      const [count, setCount] = useState(0)
      const increment = useThrottle((x) => setCount(count + x), 30)
      _increment = increment

      return <h1>{renders},{count}</h1>
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("1,0")

    act(() => _increment(1))

    expect(target).toHaveTextContent("2,1")

    act(() => _increment(2))

    await act(() => createTimeout(20))

    expect(target).toHaveTextContent("2,1")

    act(() => _increment(3))

    expect(target).toHaveTextContent("2,1")

    await act(() => createTimeout(10))

    expect(target).toHaveTextContent("3,4")

    await act(() => createTimeout(20))

    expect(target).toHaveTextContent("3,4")
  })
})
