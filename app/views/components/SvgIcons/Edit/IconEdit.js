import React from 'react'
import styled, { css } from 'styled-components'

const width = '15'
const height = '16'
const viewBox = '0 0 15 16'

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
      <path d="M-4-4h24v24H-4z" />
      <g fill="#2196F3" fillRule="nonzero">
        <path d="M7.521 4.062H6.17a.658.658 0 0 0-.676.656c0 .37.296.656.676.656h1.352c.38 0 .676-.287.676-.656a.658.658 0 0 0-.676-.656z" />
        <path d="M14.768 4.246L10.71.308a.68.68 0 0 0-.486-.185h-6.78a.658.658 0 0 0-.676.656v3.672L.254 6.871c-.275.267-.275.678 0 .924l2.514 2.461v4.985c0 .37.295.656.676.656h10.838c.38 0 .676-.287.676-.656V4.718a.513.513 0 0 0-.19-.472zM10.9 2.36l1.754 1.703H10.9V2.359zm-2.704 9.58H6.444l-.676-.657L7.52 9.58l.676.657v1.702zM6.55 8.655L4.796 10.36 1.69 7.344 3.444 5.64l3.105 3.015zm-.866 4.41a.68.68 0 0 0 .486.185h5.43c.38 0 .676-.287.676-.656a.658.658 0 0 0-.676-.657H9.57v-1.312h2.03c.38 0 .676-.288.676-.657a.658.658 0 0 0-.676-.656H9.148L7.796 8h3.781c.38 0 .677-.287.677-.656a.658.658 0 0 0-.677-.657H6.444L4.14 4.451l-.021-.02V1.415h4.056c.74 0 1.352.595 1.352 1.313v1.99c0 .37.296.656.676.656h3.38v9.21H4.12V11.57l1.563 1.498z" />
      </g>
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'Edit'
})
