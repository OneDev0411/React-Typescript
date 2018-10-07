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
      d="M21 17.5877C21 18.8864 19.95 20 18.7256 20c-1.0095 0-1.9287-.7877-2.1473-1.8095h-.7886c-1.6639 0-3.1115-.9727-3.8978-2.3645-.7458 1.3918-2.1923 2.3645-3.855 2.3645H7.38c-.2197 1.0205-1.0973 1.8083-2.1484 1.8083C4.0071 19.9988 3 18.885 3 17.5865c0-1.2986 1.0071-2.3644 2.2316-2.3644.9644 0 1.798.6946 2.1045 1.6686h.6996c1.8385 0 3.241-1.5302 3.241-3.4781v-6.955L9.5261 8.2193l-.8788-.9286 2.8052-2.8742L11.8479 4l.4383.463 2.8028 2.9208-.9215.9286-1.664-1.8083v6.9085c0 1.9491 1.4928 3.478 3.2862 3.478h.8314c.3076-.974 1.1401-1.6685 2.1045-1.6685C19.95 15.2233 21 16.289 21 17.5877zm-1.2685 0c0-.5562-.4382-1.067-1.0048-1.067-.526 0-1.0094.5108-1.0094 1.067 0 .6028.4833 1.0671 1.0094 1.0671.5666 0 1.0048-.4643 1.0048-1.067zm-13.4893 0c0-.5562-.4382-1.067-1.0094-1.067-.5689 0-1.0071.5108-1.0071 1.067 0 .6028.4382 1.0671 1.0071 1.0671.5712 0 1.0094-.4643 1.0094-1.067z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconMerge'
})
