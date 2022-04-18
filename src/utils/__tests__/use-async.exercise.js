// 🐨 instead of React Testing Library, you'll use React Hooks Testing Library
import {act, renderHook} from '@testing-library/react-hooks'
import {deferred} from '../promises'
import {useAsync} from '../hooks'

describe('useAsync Hook', () => {
  let promiseResult
  let promise
  let resolve
  let reject

  beforeEach(() => {
    const deferredObject = deferred()
    promise = deferredObject.promise
    resolve = deferredObject.resolve
    reject = deferredObject.reject
    promiseResult = undefined
  })

  test('initial state', async () => {
    const {result} = renderHook(() => useAsync())

    expect(result.current).toEqual({
      status: 'idle',
      data: null,
      error: null,

      isIdle: true,
      isLoading: false,
      isError: false,
      isSuccess: false,

      run: expect.any(Function),
      reset: expect.any(Function),
      setData: expect.any(Function),
      setError: expect.any(Function),
    })
  })

  describe('calling run with a promise', () => {
    test('transitions to pending', async () => {
      const {result} = renderHook(() => useAsync())

      act(() => {
        result.current.run(promise)
      })

      expect(result.current).toEqual({
        status: 'pending',
        data: null,
        error: null,

        isIdle: false,
        isLoading: true,
        isError: false,
        isSuccess: false,

        run: expect.any(Function),
        reset: expect.any(Function),
        setData: expect.any(Function),
        setError: expect.any(Function),
      })
    })

    test('when the promise resolves', async () => {
      const {result} = renderHook(() => useAsync())

      act(() => {
        promiseResult = result.current.run(promise)
      })

      const mockResult = Symbol('hello-world')
      await act(async () => {
        resolve(mockResult)
        await promiseResult
      })

      expect(result.current).toEqual({
        status: 'resolved',
        data: mockResult,
        error: null,

        isIdle: false,
        isLoading: false,
        isError: false,
        isSuccess: true,

        run: expect.any(Function),
        reset: expect.any(Function),
        setData: expect.any(Function),
        setError: expect.any(Function),
      })
    })

    test('when the promise rejects', async () => {
      const {result} = renderHook(() => useAsync())

      act(() => {
        promiseResult = result.current.run(promise)
      })

      const rejectedValue = Symbol({message: 'rejected'})
      await act(async () => {
        reject(rejectedValue)
        await promiseResult.catch(() => {})
      })

      expect(result.current).toEqual({
        status: 'rejected',
        data: null,
        error: rejectedValue,

        isIdle: false,
        isLoading: false,
        isError: true,
        isSuccess: false,

        run: expect.any(Function),
        reset: expect.any(Function),
        setData: expect.any(Function),
        setError: expect.any(Function),
      })
    })
  })

  test('when useAsync resets', async () => {
    const {result} = renderHook(() => useAsync())

    act(() => {
      promiseResult = result.current.run(promise)
    })

    await act(async () => {
      resolve()
      await promiseResult
    })

    act(() => result.current.reset())

    expect(result.current).toEqual({
      status: 'idle',
      data: null,
      error: null,

      isIdle: true,
      isLoading: false,
      isError: false,
      isSuccess: false,

      run: expect.any(Function),
      reset: expect.any(Function),
      setData: expect.any(Function),
      setError: expect.any(Function),
    })
  })

  test('can specify an initial state', async () => {
    const {result} = renderHook(() =>
      useAsync({status: 'pending', data: null, error: null, hello: 'world'}),
    )

    expect(result.current).toEqual({
      status: 'pending',
      data: null,
      error: null,

      isIdle: false,
      isLoading: true,
      isError: false,
      isSuccess: false,

      run: expect.any(Function),
      reset: expect.any(Function),
      setData: expect.any(Function),
      setError: expect.any(Function),
    })
  })

  test('can set the data', async () => {
    const {result} = renderHook(() => useAsync())
    const mockData = Symbol('hello-world')

    act(() => {
      result.current.setData(mockData)
    })

    expect(result.current).toEqual({
      status: 'resolved',
      data: mockData,
      error: null,

      isIdle: false,
      isLoading: false,
      isError: false,
      isSuccess: true,

      run: expect.any(Function),
      reset: expect.any(Function),
      setData: expect.any(Function),
      setError: expect.any(Function),
    })
  })

  test('can set the error', async () => {
    const {result} = renderHook(() => useAsync())
    const mockData = Symbol('hello-world')

    act(() => {
      result.current.setError(mockData)
    })

    expect(result.current).toEqual({
      status: 'rejected',
      data: null,
      error: mockData,

      isIdle: false,
      isLoading: false,
      isError: true,
      isSuccess: false,

      run: expect.any(Function),
      reset: expect.any(Function),
      setData: expect.any(Function),
      setError: expect.any(Function),
    })
  })

  test('No state updates happen if the component is unmounted while pending', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
    const {result, unmount} = renderHook(() => useAsync())

    act(() => {
      promiseResult = result.current.run(promise)
    })

    unmount()

    await act(async () => {
      resolve()
      await promiseResult
    })

    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  test('calling "run" without a promise results in an early error', async () => {
    const {result} = renderHook(() => useAsync())

    expect(() =>
      result.current.run(() => {}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
    )
  })
})
