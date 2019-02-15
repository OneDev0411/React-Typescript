import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
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
      fill="#FFF"
      d="M1.5 2.502a.333.333 0 0 1-.29-.496c.221-.4.55-.73.95-.953a.333.333 0 1 1 .326.582 1.79 1.79 0 0 0-.695.699.338.338 0 0 1-.291.168zM2.144.24a.333.333 0 0 1-.223.416A1.833 1.833 0 0 0 .652 1.924a.333.333 0 1 1-.638-.193A2.497 2.497 0 0 1 1.73.017a.333.333 0 0 1 .415.222zm4.238 1.225c.16.16.298.343.409.541.09.16.032.364-.128.454a.338.338 0 0 1-.454-.128 1.79 1.79 0 0 0-.695-.696.333.333 0 1 1 .325-.58c.2.11.382.248.543.41zm1.604.267a.333.333 0 0 1-.223.416.34.34 0 0 1-.415-.223 1.833 1.833 0 0 0-1.27-1.27.333.333 0 1 1 .193-.637c.83.237 1.478.885 1.715 1.714zM4.5 7.17c.092 0 .167.074.167.166a.667.667 0 0 1-1.334 0c0-.092.075-.166.167-.166h1zm1.667-2.62c0 .71.166 1.409.482 2.043a.167.167 0 0 1-.149.241h-5a.167.167 0 0 1-.149-.24 4.59 4.59 0 0 0 .482-2.044v-.216c0-1.164.693-2.16 1.667-2.423v-.41a.5.5 0 1 1 1 0v.41c.974.264 1.667 1.26 1.667 2.423v.216z"
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
