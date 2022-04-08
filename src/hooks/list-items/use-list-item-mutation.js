import {useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

const QUERY_KEY = 'list-items'

/**
 * By invalidating queries by default, whenever we mutate we make a new request
 * to the server on the background to ensure we always have the latest data.
 *
 * This is particularly useful when errors handled by `react-query` occur.
 */
function onSettled() {
  queryCache.invalidateQueries(QUERY_KEY)
}

/**
 * The 3rd value of onError is whatever is returned by the triggering onMutate
 * configuration function. In our case we expect a pure paramless recover
 * function, but could be anything else. Including nothing, primitive values or
 * objects.
 */
function onError(e, _variables, recover) {
  console.error('list-item-mutation hook (recover, err)', recover, e.message)

  if (typeof recover === 'function') {
    return recover()
  }

  return null
}

const defaultMutationOptions = {onSettled, onError}

function useListItemUpdateMutation(user, options) {
  return useMutation(
    updates =>
      client(`${QUERY_KEY}/${updates.id}`, {
        data: updates,
        method: 'PUT',
        token: user.token,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })

        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function useListItemCreateMutation(user, options) {
  return useMutation(
    bookId => client(QUERY_KEY, {data: {bookId}, token: user.token}),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData(QUERY_KEY)

        queryCache.setQueryData(QUERY_KEY, old => [newItem, ...old])

        return () => queryCache.setQueryData(QUERY_KEY, previousItems)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function useListItemRemoveMutation(user, options) {
  return useMutation(
    bookId =>
      client(`${QUERY_KEY}/${bookId}`, {
        method: 'DELETE',
        token: user.token,
      }),
    {
      onMutate(removedItemId) {
        const previousItems = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.filter(item => item.id !== removedItemId)
        })

        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}

export {
  useListItemUpdateMutation,
  useListItemCreateMutation,
  useListItemRemoveMutation,
  QUERY_KEY as LIST_ITEMS_QUERY_KEY,
}
