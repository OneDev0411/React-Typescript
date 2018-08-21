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
        d='M23.457 3.273a.984.984 0 0 0-.903-.122l-6.591 2.355-1.52-.543A5.447 5.447 0 0 0 9.038.123a5.447 5.447 0 0 0-5.405 4.84l-1.853.662a.989.989 0 0 0-.656.932v16.33a.99.99 0 0 0 1.322.932l6.592-2.355 6.591 2.355c.216.076.45.076.666 0l6.925-2.474a.989.989 0 0 0 .657-.933V4.082a.99.99 0 0 0-.42-.809zM8.048 19.714l-4.946 1.768V7.253l.688-.245c.73 2.85 3.326 5.524 4.258 6.413v6.293zM5.575 5.567a3.467 3.467 0 0 1 3.463-3.464A3.467 3.467 0 0 1 12.5 5.567c0 2.104-2.114 4.69-3.462 6.057-1.35-1.367-3.463-3.953-3.463-6.057zm9.398 15.915l-4.946-1.768V13.42c.931-.888 3.529-3.561 4.258-6.411l.688.245v14.228zm6.925-1.767l-4.946 1.768V7.254l4.946-1.768v14.23zM9.038 4.082a1.486 1.486 0 0 0 0 2.97 1.486 1.486 0 0 0 0-2.97z'
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconProperties'
})
