import React, { useState } from "react"
import { mount } from "enzyme"
import { useThrottle } from "./useThrottle"
import { act } from "react-dom/test-utils"
import { createTimeout } from "@corets/promise-helpers"

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

      return (
        <div>
          {renders},{count},{debouncedCount}
        </div>
      )
    }

    const wrapper = mount(<Test />)
    const targetText = () => wrapper.find("div").text()

    expect(targetText()).toBe("1,0,0")

    act(() => _setCount(1))

    expect(targetText()).toBe("2,1,0")

    act(() => _setCount(2))

    expect(targetText()).toBe("3,2,0")

    await act(() => createTimeout(10))

    expect(targetText()).toBe("3,2,0")

    await act(() => createTimeout(10))

    act(() => _setCount(3))

    expect(targetText()).toBe("5,3,2")

    await act(() => createTimeout(30))

    expect(targetText()).toBe("6,3,3")
  })

  it("throttles function", async () => {
    let renders = 0
    let _increment

    const Test = () => {
      renders++

      const [count, setCount] = useState(0)
      const increment = useThrottle((x) => setCount(count + x), 30)
      _increment = increment

      return (
        <div>
          {renders},{count}
        </div>
      )
    }

    const wrapper = mount(<Test />)
    const targetText = () => wrapper.find("div").text()

    expect(targetText()).toBe("1,0")

    act(() => _increment(1))

    expect(targetText()).toBe("2,1")

    act(() => _increment(2))

    await act(() => createTimeout(20))

    expect(targetText()).toBe("2,1")

    act(() => _increment(3))

    expect(targetText()).toBe("2,1")

    await act(() => createTimeout(10))

    expect(targetText()).toBe("3,4")

    await act(() => createTimeout(20))

    expect(targetText()).toBe("3,4")
  })
})
