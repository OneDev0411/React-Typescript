import React from 'react'

import {
  primary,
  borderColor
} from '../../../../../../../../views/utils/colors'
import IconButton from '../../../../../../../../views/components/Button/IconButton'
import IconCheck from '../../../../../../../../views/components/SvgIcons/Checkmark/IconCheckmark'

const Button = IconButton.extend`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  margin-right: 1em;
  justify-content: center;
  background-color: ${props => (props.checked ? primary : '#fff')};
  border: solid 1px ${props => (props.checked ? primary : borderColor)};
`

export function Status(props) {
  return (
    <Button isFit {...props}>
      {props.checked && <IconCheck style={{ fill: '#fff' }} />}
    </Button>
  )
}
