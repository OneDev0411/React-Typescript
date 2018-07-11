import React from 'react'
import Flex from 'styled-flex-component'
import Cookies from 'universal-cookie'

import CloseButton from '../../../../../../../views/components/Button/IconButton'
import CloseIcon from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'

export const Box = Flex.extend`
  border-radius: 3px;
  background-color: #dce5eb;
  padding: 1em;
  font-size: 1.6rem;
  line-height: 1.5;
  color: #1e364b;
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
          backgroundColor: '#F6FAFB',
          borderBottom: '1px solid #dde5ec'
        }}
      >
        <Box alignCenter justifyBetween>
          Adding a custom field will add additional line items to all contacts.
          <CloseButton
            color="#7b91a6"
            hoverColor="#262626"
            onClick={this.onClose}
            size="20px"
          >
            <CloseIcon />
          </CloseButton>
        </Box>
      </div>
    )
  }
}
