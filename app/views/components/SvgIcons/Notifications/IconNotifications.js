import React from 'react'
import styled, { css } from 'styled-components'

const width = '23'
const height = '24'
const viewBox = '0 0 23 24'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({noStyles}) => !noStyles ? getDimensionsCss() : null}
`

const defaultProps = {
  children: [
    <g
      fill='none'
      key='key-0'
    >
      <path
        d='M-1 0h24v24H-1z'
      />
      <path
        fill='#000'
        d='M22.726 8.764c0-3.047-2.519-5.528-5.613-5.528a5.49 5.49 0 0 0-2.574.62c-.356-.189-.712-.377-1.095-.512-.055-.027-.082-.108-.082-.189.027-.243 0-.485-.027-.728-.192-1.079-1.041-1.915-2.136-2.13A2.818 2.818 0 0 0 8.954.89a2.607 2.607 0 0 0-.986 2.05v.242c0 .08-.028.162-.082.162-3.15 1.213-4.874 3.829-4.874 7.335 0 1.483-.164 6.364-2.136 6.85l-.63.16v3.884h7.147A3.46 3.46 0 0 0 10.679 24a3.427 3.427 0 0 0 3.285-2.427h7.092V17.69l-.63-.162c-.876-.216-1.56-1.456-1.89-3.425 2.41-.62 4.19-2.777 4.19-5.339zM4.682 10.679c0-2.886 1.287-4.854 3.833-5.825A1.752 1.752 0 0 0 9.611 3.02v-.108c0-.296.137-.593.383-.809a1.11 1.11 0 0 1 .876-.215c.411.08.74.404.822.809a.546.546 0 0 1 0 .296c-.082.81.356 1.564 1.122 1.834.082.027.137.054.22.08-.932 1.026-1.534 2.374-1.534 3.857 0 2.993 2.41 5.42 5.421 5.528.247 1.483.63 2.508 1.096 3.236H3.367c.877-1.402 1.315-3.694 1.315-6.85zm5.997 11.703c-.52 0-1.014-.216-1.342-.593h2.683a1.776 1.776 0 0 1-1.341.593zm8.734-3.236v.81H1.944v-.81h17.47zm-2.3-6.472c-2.19 0-3.97-1.753-3.97-3.91s1.78-3.91 3.97-3.91c2.19 0 3.97 1.753 3.97 3.91s-1.78 3.91-3.97 3.91z'
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconNotifications'
})
