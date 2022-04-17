// 🐨 instead of React Testing Library, you'll use React Hooks Testing Library
import {act, renderHook} from '@testing-library/react-hooks'
import {deferred} from '../promises'
import {useAsync} from '../hooks'

describe('useAsync Hook', () => {
  // 🐨 flesh out these tests
  test('calling run with a promise which resolves', async () => {

  })
  // 🐨 get a promise and resolve function from the deferred utility
  // 🐨 use renderHook with useAsync to get the result
  // 🐨 assert the result.current is the correct default state

  // 🐨 call `run`, passing the promise
  //    (💰 this updates state so it needs to be done in an `act` callback)
  // 🐨 assert that result.current is the correct pending state

  // 🐨 call resolve and wait for the promise to be resolved
  //    (💰 this updates state too and you'll need it to be an async `act` call so you can await the promise)
  // 🐨 assert the resolved state

  // 🐨 call `reset` (💰 this will update state, so...)
  // 🐨 assert the result.current has actually been reset

  test('calling run with a promise which rejects', async () => {

  })
  // 🐨 this will be very similar to the previous test, except you'll reject the
  // promise instead and assert on the error state.
  // 💰 to avoid the promise actually failing your test, you can catch
  //    the promise returned from `run` with `.catch(() => {})`

  test('can specify an initial state', async () => {

  })
  // 💰 useAsync(customInitialState)

  test('can set the data', async () => {

  })
  // 💰 result.current.setData('whatever you want')

  test('can set the error', async () => {

  })
  // 💰 result.current.setError('whatever you want')

  test('No state updates happen if the component is unmounted while pending', async () => {

  })
  // 💰 const {result, unmount} = renderHook(...)
  // 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

  test('calling "run" without a promise results in an early error', async () => {

  })
})
