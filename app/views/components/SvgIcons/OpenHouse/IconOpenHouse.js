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
      fillRule="evenodd"
      d="M12.3478 12.6799c.3844 0 .6957-.3043.6957-.68 0-.3756-.3113-.6799-.6957-.6799-.3843 0-.6956.3043-.6956.68 0 .3756.3113.6799.6956.6799zM6.7826 6.5605H5.4021C4.631 6.5605 4 7.1782 4 7.9251v8.15c0 .7564.6223 1.3646 1.402 1.3646h1.3806c.3844 0 .6957-.3042.6957-.6799 0-.3757-.3113-.68-.6957-.68H5.4021c-.0115 0-.0108.0007-.0108-.0047v-8.15c0 .0038.0087-.0047.0108-.0047h1.3805c.3844 0 .6957-.3043.6957-.68 0-.3756-.3113-.6799-.6957-.6799zm3.4783-.4824c0-.372.3172-.636.6831-.5926l6.9816.8302c.3774.0452.6831.3815.6831.749v9.8705c0 .3685-.3172.7061-.6831.751l-6.9816.853c-.3774.0459-.6831-.2176-.6831-.5905V6.078zm-1.3913-.874c0-.753.6302-1.2861 1.3871-1.1937l8.3562 1.021C19.3788 5.1247 20 5.8203 20 6.554v10.8915c0 .7476-.6303 1.4306-1.3871 1.523l-8.3562 1.021c-.766.0938-1.3871-.4501-1.3871-1.1937V5.204z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconOpenHouse'
})
