import React from 'react'
import { func } from 'prop-types'

import ShadowButton from '../../Button/ShadowButton'

const largeSize = '32px'

// todo: refactor shadowButton with IconButton
const Button = ShadowButton.extend`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 0;

  &:hover > svg {
    fill: #2196f3;
  }

  @media screen and (min-width: 48em) {
    top: ${largeSize};
    right: ${largeSize};

    & > svg {
      height: ${largeSize};
      width: ${largeSize};
    }
  }
`

CloseButton.propTypes = {
  onClick: func.isRequired
}

export function CloseButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      <svg
        fill="#333"
        height="24"
        width="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </Button>
  )
}
