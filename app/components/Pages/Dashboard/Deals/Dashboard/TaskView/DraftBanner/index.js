import React from 'react'
import _ from 'underscore'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import InfoIcon from 'components/SvgIcons/InfoOutline/IconInfoOutline'

import { Container } from './styled'

export default class DraftBanner extends React.Component {
  state = {
    showBanner: true
  }

  hideBanner = () => this.setState({ showBanner: false })

  render() {
    if (this.state.showBanner === false || this.props.isDraftDeal === false) {
      return false
    }

    return (
      <Container>
        <InfoIcon
          style={{
            marginRight: '0.75rem'
          }}
        />

        <span>
          Your masseges saved and once your deal goes live, admin can read it
        </span>

        <CloseIcon
          onClick={this.hideBanner}
          style={{
            cursor: 'pointer'
          }}
        />
      </Container>
    )
  }
}
