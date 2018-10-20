import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)};
`

const defaultProps = {
  children: [
    <path
      d="M12.6747 4.1959a.6464.6464 0 0 0-.4865-.1955l-6.2999.1466c-.9539.019-1.7226.7877-1.7415 1.7416l-.1466 6.2999a.6664.6664 0 0 0 .1954.4865l8.5369 8.5412a2.6657 2.6657 0 0 0 3.7763 0l4.7072-4.7138a2.6657 2.6657 0 0 0 0-3.7764L12.6747 4.196zm7.595 11.3646L15.5603 20.27a1.3328 1.3328 0 0 1-1.886 0l-8.3346-8.3347.14-6.0222c0-.2453.1988-.4443.4442-.4443l6.0222-.1399 8.3236 8.3458a1.3328 1.3328 0 0 1 0 1.886zM11.4752 8.019c-.9544-.954-2.5014-.9537-3.4555.0005-.954.9543-.954 2.5012 0 3.4555.9541.9542 2.501.9544 3.4555.0005a2.428 2.428 0 0 0 0-3.4565zm-.942 2.5146a1.1107 1.1107 0 1 1 0-1.5705c.4337.4337.4337 1.1368 0 1.5705z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'TagIcon'
})
