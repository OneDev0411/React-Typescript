import React from 'react'
import styled, { css } from 'styled-components'

const width = '12'
const height = '16'
const viewBox = '0 0 12 16'

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
    <g fill="none" fillRule="evenodd" key="key-0">
      <path d="M-6-4h24v24H-6z" />
      <g fill="#2196F3" fillRule="nonzero">
        <path d="M3.352 5.374h1.324a.65.65 0 0 0 .662-.656.65.65 0 0 0-.662-.656H3.352a.65.65 0 0 0-.662.656c0 .349.29.656.662.656zm0 2.626h5.317a.65.65 0 0 0 .662-.656.65.65 0 0 0-.662-.657H3.352a.65.65 0 0 0-.662.657c0 .369.29.656.662.656zm0 2.626h5.317a.65.65 0 0 0 .662-.657.65.65 0 0 0-.662-.656H3.352a.65.65 0 0 0-.662.656c0 .37.29.657.662.657zm3.972 1.312H3.352a.65.65 0 0 0-.662.657c0 .37.29.656.662.656h3.972a.65.65 0 0 0 .662-.656.664.664 0 0 0-.662-.657z" />
        <path d="M11.772 4.246L7.8.308a.658.658 0 0 0-.476-.185H.683A.65.65 0 0 0 .02.78v14.483c0 .369.29.656.662.656h10.614a.65.65 0 0 0 .662-.656V4.718a.519.519 0 0 0-.187-.472zM7.986 2.36l1.717 1.703H7.986V2.359zm-2.648-.944c.724 0 1.324.595 1.324 1.313v1.99c0 .37.29.656.662.656h3.31v9.21h-9.29V1.416h3.994z" />
      </g>
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'Document'
})
