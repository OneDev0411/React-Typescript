import styled from 'styled-components'

import { Props, LoadingPosition } from '.'

const LOADING_HEIGHT = '4rem'

/**
 * calculate top or bottom of loading position based on given input
 * @param position - the loading position
 */
function getLoaderPosition(position: LoadingPosition) {
  if (position === LoadingPosition.Top) {
    return {
      top: 0
    }
  }

  if (position === LoadingPosition.Bottom) {
    return {
      bottom: 0
    }
  }

  return {
    top: 0,
    bottom: 0,
    height: '100%'
  }
}

export const Container = styled.div`
  position: relative;
`

export const Loading = styled.div<Partial<Props>>`
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: ${LOADING_HEIGHT};
  left: 0;
  right: 0;
  ${props => getLoaderPosition(props.loadingPosition as LoadingPosition)}
`
