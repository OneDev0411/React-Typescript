import React from 'react'
import _ from 'underscore'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import InfoIcon from 'components/SvgIcons/InfoOutline/IconInfoOutline'

import { Container } from './styled'

export default class DraftBanner extends React.Component {
  state = {
    showBanner: true
  }

  /**
   * show banner when deal is draft and
   * has one task with needs_attention at least
   */
  get ShowDraftBanner() {
    return (
      this.props.deal.is_draft &&
      _.some(this.props.deal.checklists, chId =>
        _.some(
          this.props.checklists[chId].tasks,
          id => this.props.tasks[id].attention_requested
        )
      )
    )
  }

  hideBanner = () => this.setState({ showBanner: false })

  render() {
    if (this.state.showBanner === false || this.ShowDraftBanner === false) {
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
          IMPORTANT: your admin will not be notified until you make the deal
          visible to them, then all of your notifications will be sent at once.
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
