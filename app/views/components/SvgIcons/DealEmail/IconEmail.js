import React from 'react'
import styled, { css } from 'styled-components'

const width = '56'
const height = '21'
const viewBox = '0 0 56 21'

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
      <rect
        width='28'
        height='18'
        x='14'
        y='1'
        fill='#D8D8D8'
        rx='2'
      />
      <path
        fill='#000'
        fillRule='nonzero'
        d='M16.696 0c-2.04 0-3.71 1.645-3.71 3.652v13.696c0 2.007 1.67 3.652 3.71 3.652h22.26c2.04 0 3.71-1.645 3.71-3.652V3.652c0-2.007-1.67-3.652-3.71-3.652h-22.26zm0 1.826h22.26c1.044 0 1.856.799 1.856 1.826v13.696c0 1.027-.812 1.826-1.855 1.826H16.696c-1.044 0-1.855-.799-1.855-1.826V3.652c0-1.027.81-1.826 1.855-1.826zM.889 3.965A.901.901 0 0 0 0 4.878c0 .504.398.913.889.913h8.889c.49 0 .889-.409.889-.913a.901.901 0 0 0-.89-.913H.89zm45.333 0a.901.901 0 0 0-.889.913c0 .504.398.913.89.913h8.888c.491 0 .889-.409.889-.913a.901.901 0 0 0-.889-.913h-8.889zM18.126 5.162a.903.903 0 0 0 .236.958l4.667 4.565-4.638 4.152a.904.904 0 0 0-.065 1.291.939.939 0 0 0 1.312.064l4.71-4.223 1.406 1.37c1.137 1.11 2.993 1.108 4.13 0l1.406-1.37 4.724 4.223c.38.34.968.31 1.312-.064a.904.904 0 0 0-.065-1.291l-4.652-4.166 4.68-4.55a.904.904 0 0 0 .261-.888.92.92 0 0 0-.66-.657.938.938 0 0 0-.904.246l-7.42 7.219c-.343.333-1.168.332-1.508 0l-7.391-7.219a.936.936 0 0 0-1.54.34zM2.266 9.25a.923.923 0 0 0-.933.913c0 .504.418.913.934.913h7.466a.923.923 0 0 0 .934-.913.923.923 0 0 0-.934-.913H2.267zm44 0a.923.923 0 0 0-.933.913c0 .504.418.913.934.913h7.466a.923.923 0 0 0 .934-.913.923.923 0 0 0-.934-.913h-7.466zm-42.6 5.286c-.552 0-1 .409-1 .913 0 .505.448.913 1 .913h6c.553 0 1-.408 1-.913 0-.504-.447-.913-1-.913h-6zm42.667 0c-.552 0-1 .409-1 .913 0 .505.448.913 1 .913h6c.553 0 1-.408 1-.913 0-.504-.447-.913-1-.913h-6z'
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconEmail'
})
