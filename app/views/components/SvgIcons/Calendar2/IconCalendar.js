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
  ${({noStyles}) => !noStyles ? getDimensionsCss() : null}
`

const defaultProps = {
  children: [
    <g
      fill='none'
      fillRule='evenodd'
      key='key-0'
    >
      <path
        fill='none'
        d='M0 0h24v24H0z'
      />
      <path
        fill='#000'
        fillRule='nonzero'
        d='M22 9V5.004l-3-.002v.995a.999.999 0 1 1-2 0v-.995L7 5v.997a.999.999 0 1 1-2 0V5H2.005l-.003 4H22zm0 2H2.001L2 21.996c0 .003 19.995.004 19.995.004.002 0 .003-6.107.004-11zm-3-8h2.995C23.102 3 24 3.896 24 5.004v16.992A2.004 2.004 0 0 1 21.995 24H2.005A2.003 2.003 0 0 1 0 21.996V5.004C0 3.897.897 3 2.005 3H5V1.003a.999.999 0 1 1 2 0V3h10V1.003a.999.999 0 1 1 2 0V3z'
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconCalendar'
})
