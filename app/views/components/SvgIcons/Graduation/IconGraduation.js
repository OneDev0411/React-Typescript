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
        key="key-0"
        fillRule='nonzero'
        d='M20.569 9.191l-7.83-4.106a.736.736 0 0 0-.688 0l-7.83 4.106a.81.81 0 0 0-.426.721.839.839 0 0 0 .073.323v5.036c-.663.37-1 1.166-.82 1.93.182.766.837 1.302 1.588 1.302.751 0 1.406-.536 1.587-1.301.182-.765-.156-1.56-.819-1.93v-4.03l1.429.75-1.091 2.796a.828.828 0 0 0 .288.995l5.945 4.081a.736.736 0 0 0 .852 0l5.837-4.186a.829.829 0 0 0 .28-.963l-1.01-2.695 2.639-1.382A.81.81 0 0 0 21 9.913a.81.81 0 0 0-.431-.722zm-4.017 3.554l.741 1.966-4.908 3.51-4.992-3.425.807-2.067 3.84 2.014a.736.736 0 0 0 .687 0l3.825-1.998zm-4.155.379L6.283 9.9l6.114-3.223L18.51 9.9l-6.113 3.224z'
      />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconGraduation'
})
