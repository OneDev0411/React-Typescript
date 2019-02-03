import React from 'react'
import styled, { css } from 'styled-components'

const width = '12'
const height = '12'
const viewBox = '0 0 8 8'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)}
`

const defaultProps = {
  children: [
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M2.446 5.203a3.397 3.397 0 0 1 3.205-.062c.4.205.586.755.416 1.232-.17.477-.63.702-1.033.503a2.039 2.039 0 0 0-1.924.037c-.397.218-.868.012-1.051-.46-.184-.473-.01-1.032.387-1.25zM7.9 3.366a.832.832 0 0 1-.477.446.683.683 0 0 1-.603-.085c-1.752-1.17-3.9-1.12-5.612.13-.373.272-.861.133-1.09-.31-.229-.444-.112-1.024.261-1.296C2.581.645 5.342.58 7.596 2.084c.381.255.517.829.303 1.282z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconPending'
})
