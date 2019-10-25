import React from 'react'
import Masonry from 'react-masonry-css'

import OverlayDrawer from '../OverlayDrawer'
import Search from '../Grid/Search'

import { GifLayout, Gif } from './styles'
import useTrendsGifs from './useTrendsGifs'
import { getGifUrl } from './helpers'

interface Props {
  isOpen: boolean
  onClose?: () => void
}

function GifDrawer({ isOpen, onClose = () => {} }: Props) {
  const trends = useTrendsGifs()

  return (
    <OverlayDrawer open={isOpen} onClose={onClose}>
      <OverlayDrawer.Header title="Select a GIF" />
      <OverlayDrawer.Body>
        <Search
          onChange={() => {}}
          // isSearching={isSearching || showLoadingIndicator}
          // inputRef={ref => (this.searchInputRef = ref)}
          style={{
            // ...this.props.searchInputOptions.style,
            margin: '1.5rem 0'
          }}
        />

        <GifLayout>
          <Masonry
            breakpointCols={{
              default: 3
            }}
            className="gifs"
          >
            {trends.map((item, i) => (
              <Gif key={item.id}>
                <img src={getGifUrl(item)} alt={item.title} />
              </Gif>
            ))}
          </Masonry>
        </GifLayout>
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default GifDrawer
