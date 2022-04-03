import {useQuery} from 'react-query'
import {client} from 'utils/api-client'

import bookPlaceholderSvg from 'assets/book-placeholder.svg'

export function useBook(bookId, user) {
  const loadingBook = {
    title: 'Loading...',
    author: 'loading...',
    coverImageUrl: bookPlaceholderSvg,
    publisher: 'Loading Publishing',
    synopsis: 'Loading...',
    loadingBook: true,
  }

  const queryResult = useQuery(['book', {bookId}], () =>
    client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  )

  return {...queryResult, book: queryResult.data ?? loadingBook}
}
