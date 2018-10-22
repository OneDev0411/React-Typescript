import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 100 100'

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
      d="M94.805 15.23a3.996 3.996 0 0 0-3.652-.498L64.5 24.252l-6.145-2.195C57.135 11.072 47.805 2.5 36.5 2.5s-20.637 8.572-21.855 19.557l-7.492 2.676A4 4 0 0 0 4.5 28.5v66a3.996 3.996 0 0 0 5.344 3.768l26.656-9.52 26.652 9.52c.871.309 1.82.309 2.691 0l28-10a3.998 3.998 0 0 0 2.656-3.768v-66a4 4 0 0 0-1.694-3.27zM32.5 81.68l-20 7.145V31.318l2.781-.992C18.23 41.848 28.73 52.654 32.5 56.244V81.68zm-10-57.18c0-7.719 6.279-14 14-14 7.719 0 14 6.281 14 14 0 8.504-8.547 18.957-14 24.479-5.457-5.522-14-15.975-14-24.479zm38 64.324l-20-7.145V56.244c3.766-3.59 14.268-14.395 17.219-25.916l2.781.992v57.504zm28-7.142l-20 7.143V31.32l20-7.145v57.507zM36.5 18.5c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconProperties'
})