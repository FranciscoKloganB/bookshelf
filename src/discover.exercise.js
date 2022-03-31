/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import {client} from './utils/api-client'

function DiscoverBooksScreen() {
  // 🐨 add state for status ('idle', 'loading', or 'success'), data, and query
  const [data, setData] = React.useState(null)
  const [query, setQuery] = React.useState(null)
  const [queried, setQueried] = React.useState(false)
  const [status, setStatus] = React.useState('idle')

  // 🐨 Add a useEffect callback here for making the request with the client and updating the status and data.
  React.useEffect(() => {
    // 🐨 you'll also notice that we don't want to run the search until the user has submitted the form, so you'll need a boolean for that as well
    if (!queried) {
      return
    }

    setStatus('loading')
    client(`books?query=${encodeURIComponent(query)}`)
      .then(result => {
        setData(result)
        setStatus('success')
      })
      .catch(e => {
        console.log('Unable to fetch books', e?.message)
        setStatus('error')
      })
    // 🐨 remember, effect callbacks are called on the initial render too
  }, [queried, query])

  // 🐨 replace these with derived state values based on the status.
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  function handleSearchSubmit(event) {
    // 🐨 call preventDefault on the event so you don't get a full page reload
    event.preventDefault()
    // 🐨 set the queried state to true
    setQueried(true)
    // 🐨 set the query value which you can get from event.target.elements
    // 💰 console.log(event.target.elements) if you're not sure.
    setQuery(event.target.elements.search.value)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? <Spinner /> : <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
