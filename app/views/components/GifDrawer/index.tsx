import React from 'react'

import { CircularProgress } from '@material-ui/core'
import Masonry from 'react-masonry-css'

import Search from 'components/Grid/Search'
import OverlayDrawer from 'components/OverlayDrawer'

import { getGifUrl, gifOutput } from './helpers'
import { GifLayout, Gif } from './styles'
import { GifItem } from './types'
import useSearchGif from './useSearchGif'
import useTrendsGifs from './useTrendsGifs'

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
