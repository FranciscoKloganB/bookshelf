// 🐨 we're going to use React hooks in here now so we'll need React
// eslint-disable-next-line no-unused-vars
import * as React from 'react'
import {useQuery, useMutation, queryCache} from 'react-query'
import {setQueryDataForBook} from './books'
import {useClient} from './api-client'

// 💣 remove the user argument here
function useListItems() {
  // 🐨 get the user from React.useContext(AuthContext)
  const client = useClient()
  const {data} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`).then(data => data.listItems),
    onSuccess: async listItems => {
      for (const listItem of listItems) {
        setQueryDataForBook(listItem.book)
      }
    },
  })
  return data ?? []
}

// 💣 remove the user argument here
function useListItem(bookId) {
  // 💣 you no longer need to pass the user here
  const listItems = useListItems()
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

// 💣 remove the user argument here
function useUpdateListItem(options) {
  // 🐨 get the user from React.useContext(AuthContext)
  const client = useClient()

  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
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

// 💣 remove the user argument here
function useRemoveListItem(options) {
  // 🐨 get the user from React.useContext(AuthContext)
  const client = useClient()

  return useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE'}),
    {
      onMutate(removedItem) {
        const previousItems = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.filter(item => item.id !== removedItem.id)
        })

        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}

// 💣 remove the user argument here
function useCreateListItem(options) {
  // 🐨 get the user from React.useContext(AuthContext)
  const client = useClient()

  return useMutation(
    ({bookId}) => client(`list-items`, {data: {bookId}}),
    {...defaultMutationOptions, ...options},
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
