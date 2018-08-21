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
    <path
      d='M21.773.247H5.938a3.959 3.959 0 0 0-3.958 3.96v.989H.99a.99.99 0 1 0 0 1.98h.99v3.958H.99a.99.99 0 1 0 0 1.98h.99v3.958H.99a.99.99 0 1 0 0 1.98h.99v.99A3.959 3.959 0 0 0 5.938 24h15.835a1.98 1.98 0 0 0 1.98-1.98V2.227a1.98 1.98 0 0 0-1.98-1.98zm0 21.774H5.938a1.98 1.98 0 0 1-1.98-1.98v-.99h.99a.99.99 0 1 0 0-1.979h-.99v-3.959h.99a.99.99 0 1 0 0-1.979h-.99V7.175h.99a.99.99 0 1 0 0-1.98h-.99v-.989a1.98 1.98 0 0 1 1.98-1.98h15.835v19.795z'
      key='key-0'
    />,
    <path
      d='M8.907 19.052a.989.989 0 0 0 .99-.99v-.99a3.958 3.958 0 0 1 7.917 0v.99a.99.99 0 1 0 1.98 0v-.99a5.934 5.934 0 0 0-3.076-5.196 3.96 3.96 0 0 0-.085-5.555 3.961 3.961 0 0 0-6.736 2.76 3.96 3.96 0 0 0 1.096 2.795 5.935 5.935 0 0 0-3.076 5.196v.99a.989.989 0 0 0 .99.99zm2.97-9.897a1.98 1.98 0 1 1 3.959 0 1.98 1.98 0 0 1-3.96 0z'
      key='key-1'
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconContacts'
})
