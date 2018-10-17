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
      key="1"
      fillRule="nonzero"
      d="M18.865 6.225h-3.37V5.59c0-.868-.732-1.589-1.57-1.589h-3.85c-.859 0-1.57.742-1.57 1.59v.635h-3.37C3.963 6.225 3 7.2 3 8.387v9.451C3 19.025 3.963 20 5.135 20h13.73C20.037 20 21 19.025 21 17.838V8.366a2.14 2.14 0 0 0-2.135-2.14zm.628 5.786v5.827a.62.62 0 0 1-.628.636H5.135a.62.62 0 0 1-.628-.636v-5.827h14.986zm-9.481-5.786V5.59c0-.042.02-.063.062-.063h3.852c.041 0 .062.021.062.063v.636h-3.976zm9.481 2.14v2.099H4.507V8.366a.62.62 0 0 1 .628-.636h13.73c.356.021.628.296.628.636z"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconWork'
})
