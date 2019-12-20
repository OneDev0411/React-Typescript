import React from 'react'
import Masonry from 'react-masonry-css'
import { CircularProgress } from '@material-ui/core'

import OverlayDrawer from 'components/OverlayDrawer'
import Search from 'components/Grid/Search'

import { GifLayout, Gif } from './styles'
import useTrendsGifs from './useTrendsGifs'
import useSearchGif from './useSearchGif'
import { getGifUrl, gifOutput } from './helpers'
import { GifItem } from './types'

interface Props {
  isOpen: boolean
  onClose?: () => void
  onSelect: (value: GifItem | null) => void
}

function GifDrawer({ isOpen, onClose = () => {}, onSelect }: Props) {
  const trends = useTrendsGifs()
  const { results, setSearch, isSearching, searchFor } = useSearchGif()

  const items = searchFor ? results : trends

  return (
    <OverlayDrawer open={isOpen} onClose={onClose}>
      <OverlayDrawer.Header title="Select a GIF animation" />
      <OverlayDrawer.Body>
        <Search
          onChange={value => setSearch(value)}
          placeholder="Search for a GIF"
          isSearching={isSearching}
          debounceTime={345}
          style={{
            margin: '1.5rem 0'
          }}
        />

        {isSearching ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <GifLayout>
            <Masonry
              breakpointCols={{
                default: 3
              }}
              className="gifs"
            >
              {items.map(item => (
                <Gif key={item.id} onClick={() => onSelect(gifOutput(item))}>
                  <img src={getGifUrl(item)} alt={item.title} />
                </Gif>
              ))}
            </Masonry>
          </GifLayout>
        )}
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default GifDrawer
