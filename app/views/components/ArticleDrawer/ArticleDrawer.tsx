import React, { useState, useEffect } from 'react'
import usePrevious from 'react-use/lib/usePrevious'
import { CircularProgress, Button } from '@material-ui/core'

import OverlayDrawer from 'components/OverlayDrawer'
import Search from 'components/Grid/Search'

import { Image } from './styled'
import { Metadata } from './types'
import { sendUrlMetadataRequest } from './send-url-metadata-request'

interface Props {
  isOpen: boolean
  onClose?: () => void
  onSelect: (metadata?: Metadata) => void
}

export default function ArticleDrawer({
  isOpen,
  onClose = () => {},
  onSelect
}: Props) {
  const [url, setUrl] = useState<string>('')
  const prevURL = usePrevious(url)
  const [error, setError] = useState<string>('')
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [article, setArticle] = useState<Metadata | undefined>(undefined)

  const setInitialState = () => {
    setUrl('')
    setError('')
    setArticle(undefined)
  }

  useEffect(() => {
    if (url === '') {
      if (article || error) {
        setInitialState()
      }

      return
    }

    if (url === prevURL) {
      return
    }

    setError('')
    setArticle(undefined)
    setIsFetching(true)

    sendUrlMetadataRequest(url)
      .then(({ response }) => {
        setIsFetching(false)
        setArticle(response)
      })
      .catch(() => {
        setIsFetching(false)
        setArticle(undefined)
        setError('Not Found!')
      })
  }, [article, error, prevURL, url])

  const handleInputOnChange = (value = '') => {
    setUrl(value)
  }

  const handleInsert = () => {
    onSelect(article)
    setUrl('')
    setArticle(undefined)
  }

  const handleOnClose = () => {
    setInitialState()
    onClose()
  }

  return (
    <OverlayDrawer open={isOpen} onClose={handleOnClose}>
      <OverlayDrawer.Header title="Insert a web page URL" />
      <OverlayDrawer.Body>
        <Search
          debounceTime={500}
          isSearching={isFetching}
          onChange={handleInputOnChange}
          onClearSearch={setInitialState}
          placeholder="https://rechat.com"
          style={{
            margin: '1.5rem 0'
          }}
        />
        {isFetching && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {article && (
          <div>
            {article.image && (
              <Image onLoad={() => setIsFetching(false)} src={article.image} />
            )}
            <h3>{article.title}</h3>
            <p>{article.description}</p>
          </div>
        )}
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer rowReverse>
        <Button
          disabled={isFetching || !article}
          color="primary"
          variant="contained"
          onClick={handleInsert}
        >
          Insert article
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}
