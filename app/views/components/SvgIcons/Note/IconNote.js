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
      d="M16.431 3.065h-9.4c-1.314 0-2.38 1.108-2.38 2.475v1.285H3.84c-.358 0-.649.302-.649.675s.29.675.649.675h.813v3.15h-.813a.644.644 0 0 0-.562.338.699.699 0 0 0 0 .675c.116.208.33.337.562.337h.813v3.15h-.813c-.358 0-.649.302-.649.675s.29.675.649.675h.813v1.285c0 1.367 1.065 2.475 2.378 2.475h9.401c1.314 0 2.379-1.108 2.379-2.475V5.54c0-1.367-1.065-2.475-2.379-2.475zm-9.4 16.52a1.06 1.06 0 0 1-.765-.33 1.149 1.149 0 0 1-.317-.795v-1.285h.865c.358 0 .649-.302.649-.675s-.29-.675-.649-.675H5.95v-3.15h.865c.358 0 .649-.302.649-.675s-.29-.675-.649-.675H5.95v-3.15h.865c.358 0 .649-.302.649-.675s-.29-.675-.649-.675H5.95V5.54c0-.621.484-1.125 1.081-1.125h1.535v15.17H7.03zm10.481-1.125c0 .298-.114.584-.316.795a1.06 1.06 0 0 1-.765.33H9.865V4.415h6.566c.597 0 1.081.504 1.081 1.125v12.92z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconNote'
})
