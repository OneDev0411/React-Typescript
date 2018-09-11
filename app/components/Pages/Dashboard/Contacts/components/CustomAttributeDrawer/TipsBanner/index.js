import React from 'react'
import Flex from 'styled-flex-component'
import Cookies from 'universal-cookie'

import CloseButton from '../../../../../../../views/components/Button/IconButton'
import CloseIcon from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'
import { grey, borderColor } from '../../../../../../../views/utils/colors'

export const Box = Flex.extend`
  border-radius: 3px;
  padding: 1em;
  background-color: ${grey.A100};
`

export class TipsBanner extends React.Component {
  constructor(props) {
    super(props)
    this.cookies = new Cookies()
    this.state = {
      isClosedCustomFieldDrawerTipsBanner: this.cookies.get(
        'isClosedCustomFieldDrawerTipsBanner'
      )
    }
  }

  onClose = () => {
    this.cookies.set('isClosedCustomFieldDrawerTipsBanner', true)
    this.setState({
      isClosedCustomFieldDrawerTipsBanner: this.cookies.get(
        'isClosedCustomFieldDrawerTipsBanner'
      )
    })
  }

  render() {
    if (this.state.isClosedCustomFieldDrawerTipsBanner) {
      return null
    }

    return (
      <div
        style={{
          padding: '1em',
          backgroundColor: grey.A100,
          borderBottom: `1px solid ${borderColor}`
        }}
      >
        <Box alignCenter justifyBetween>
          Adding a custom field will add additional line items to all contacts.
          <CloseButton onClick={this.onClose}>
            <CloseIcon />
          </CloseButton>
        </Box>
      </div>
    )
  }
}
