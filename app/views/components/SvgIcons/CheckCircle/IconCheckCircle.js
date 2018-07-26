import React from 'react'
import styled, { css } from 'styled-components'

const checkedColor = '#35B863'
const unCheckedColor = '#cedae0'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const getDimensions = () => ({
  height,
  width
})

const getStyle = checked => css`
  width: ${width}px;
  height: ${height}px;

  .c-icon-check-circle {
    fill: ${checked ? checkedColor : '#fff'};
  }

  .c-icon-check-circle__border {
    stroke: ${checked ? checkedColor : unCheckedColor};
  }

  .c-icon-check-circle__check {
    fill: ${checked ? '#fff' : unCheckedColor};
  }

  ${!checked &&
    `&:hover {
    .c-icon-check-circle__border {
      stroke: ${checkedColor};
    }

    .c-icon-check-circle__check {
      fill: ${checkedColor};
    }
  }`};
`

const Image = styled.svg`
  ${({ noStyles, checked = false }) => (!noStyles ? getStyle(checked) : null)};
`

const defaultProps = {
  children: [
    <defs key="key-0">
      <rect id="s-c4c196dc86-a" width="24" height="24" rx="12" />
    </defs>,
    <g fill="none" fillRule="evenodd" key="key-1">
      <use className="c-icon-check-circle" xlinkHref="#s-c4c196dc86-a" />
      <rect
        width="23"
        height="23"
        x=".5"
        y=".5"
        rx="11.5"
        className="c-icon-check-circle__border"
      />
      <path
        className="c-icon-check-circle__check"
        fillRule="nonzero"
        d="M10.862 15.848a.923.923 0 0 1-.66-.277l-1.896-1.93a.918.918 0 0 1 .015-1.302.924.924 0 0 1 1.305.015l1.145 1.166 3.525-4.667a.925.925 0 0 1 1.293-.182c.407.306.49.882.183 1.288L11.6 15.481a.923.923 0 0 1-.738.367z"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getStyle,
  defaultProps,
  displayName: 'IconCheckCircle'
})
