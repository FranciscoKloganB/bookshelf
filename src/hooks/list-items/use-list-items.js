import {useQuery} from 'react-query'
import {client} from 'utils/api-client'

export function useListItems(user) {
  const queryResult = useQuery('list-items', () =>
    client('list-items', {token: user.token}).then(data => data.listItems),
  )

  return {...queryResult, listItems: queryResult.data ?? []}
}
