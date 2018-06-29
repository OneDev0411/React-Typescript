import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const getDimensions = () => ({
  height,
  width
})

const getStyle = () => css`
  width: ${width}px;
  height: ${height}px;

  > g {
    fill: #17283a;
  }
`

const Image = styled.svg`
  ${({ noStyles }) => (!noStyles ? getStyle() : null)};
`

const defaultProps = {
  children: [
    <g fill="none" fillRule="evenodd" key="key-0">
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        // fill=""
        fillRule="nonzero"
        d="M16.82 15.665l-.127-.263a5.245 5.245 0 0 1-.513-2.245v-1.38a4.349 4.349 0 0 0-.907-2.645 4.173 4.173 0 0 0-2.311-1.504h-.45V6.63A.518.518 0 0 0 12 6.105a.519.519 0 0 0-.513.525v.972h-.448c-.925.21-1.75.74-2.339 1.501a4.291 4.291 0 0 0-.892 2.675v1.379a5.252 5.252 0 0 1-.513 2.245l-.128.263c-.172.366-.148.797.063 1.14.21.344.579.553.975.554h1.821c.13.62.53 1.143 1.087 1.42a1.973 1.973 0 0 0 1.762 0 2.056 2.056 0 0 0 1.087-1.42h1.82c.397 0 .765-.21.976-.554.21-.343.235-.774.063-1.14zM12 17.975a.987.987 0 0 1-.897-.616h1.794a.987.987 0 0 1-.897.617zm3.885-1.72a.13.13 0 0 1-.103.066H8.218a.128.128 0 0 1-.106-.06.133.133 0 0 1-.01-.124l.129-.262a6.334 6.334 0 0 0 .615-2.705v-1.392a3.246 3.246 0 0 1 .656-1.985 3.112 3.112 0 0 1 1.716-1.14h1.564c.683.168 1.291.57 1.724 1.137a3.24 3.24 0 0 1 .66 1.988v1.379a6.35 6.35 0 0 0 .616 2.705l.128.263a.135.135 0 0 1-.025.13z"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getStyle,
  defaultProps,
  displayName: 'IconBell'
})
