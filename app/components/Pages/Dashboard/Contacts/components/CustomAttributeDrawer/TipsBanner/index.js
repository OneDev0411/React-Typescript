import React from 'react'
import Flex from 'styled-flex-component'
import Cookies from 'universal-cookie'

import CloseButton from '../../../../../../../views/components/Button/IconButton'
import CloseIcon from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'
import {
  borderColor,
  brandBackground
} from '../../../../../../../views/utils/colors'

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
          margin: '1.5em 0',
          padding: '1.5em',
          backgroundColor: brandBackground
        }}
      >
        <Flex alignCenter justifyBetween>
          Adding a custom field will add additional line items to all contacts.
          <CloseButton isFit iconSize="medium" inverse onClick={this.onClose}>
            <CloseIcon />
          </CloseButton>
        </Flex>
      </div>
    )
  }
}
