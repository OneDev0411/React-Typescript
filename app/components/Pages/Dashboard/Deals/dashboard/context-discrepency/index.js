import React from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import History from './modal'
import ActionButton from '../../../../../../views/components/Button/ActionButton'
import Deal from '../../../../../../models/Deal'
import DealContext from '../../../../../../models/DealContext'
import ContextHistory from '../../../../../../models/Deal/context-history-helper'

class ContextDiscrepency extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showHistoryModal: false,
      history: [],
      isFetching: false
    }

    this.toggleShowHistory = this.toggleShowHistory.bind(this)
    this.toggleShowPopover = this.toggleShowPopover.bind(this)
  }

  toggleShowPopover() {
    const { history, isFetching } = this.state

    if (history.length === 0 && !isFetching) {
      this.loadHistory()
    }
  }

  toggleShowHistory() {
    const showHistoryModal = !this.state.showHistoryModal

    this.setState({
      showHistoryModal
    })

    if (showHistoryModal) {
      this.popover.hide()
    }
  }

  getCreaterName() {
    const { history } = this.state

    if (history && history.length > 0) {
      return ContextHistory.getCreatorName(history[0])
    }

    return null
  }

  getFormName() {
    const { history } = this.state

    if (history && history.length > 0) {
      return ContextHistory.getFormName(history[0])
    }

    return null
  }

  async loadHistory() {
    const { deal, contextName } = this.props

    this.setState({
      isFetching: true
    })

    try {
      const history = await await Deal.getContextHistory(deal.id, contextName)

      this.setState({
        history,
        isFetching: false
      })
    } catch (e) {
      this.setState({
        isFetching: false
      })
    }
  }

  render() {
    const { history, showHistoryModal, isFetching } = this.state
    const { disabled, deal, contextName, placement } = this.props

    if (disabled || !deal.deal_context[contextName]) {
      return false
    }

    const discrepency = Deal.get.discrepency(deal, contextName)

    const overview = (
      <Popover id="deal-context-discrepency-overview-popover">
        <div className="context-row">
          <div className="item separated">
            <div>ON MLS</div>
            <div>
              {DealContext.getValueByContext(contextName, discrepency.mls)}
            </div>
          </div>

          <div className="item">
            <div>On Rechat</div>
            <div className={cn({ hasDiscrepency: discrepency.hasDiff })}>
              {discrepency.hasDiff && <i className="fa fa-warning" />}

              {DealContext.getValueByContext(contextName, discrepency.rechat)}
            </div>
          </div>

          <div className="item">
            <div>Provided By</div>
            <div>{this.getCreaterName()}</div>
          </div>

          <div className="item">
            <div>Form</div>
            <div>{this.getFormName()}</div>
          </div>

          <div className="item">
            <div>Approved By</div>
            <div>{ContextHistory.getApproverName(discrepency)}</div>
          </div>
        </div>

        <div className="cta">
          <ActionButton disabled={isFetching} onClick={this.toggleShowHistory}>
            {isFetching ? (
              <span>
                Loading History <i className="fa fa-spin fa-spinner" />
              </span>
            ) : (
              'View History'
            )}
          </ActionButton>
        </div>
      </Popover>
    )

    return (
      <div className="deal-context-discrepency">
        <OverlayTrigger
          trigger="click"
          placement={placement || 'bottom'}
          rootClose
          overlay={overview}
          ref={ref => (this.popover = ref)}
        >
          <i
            className={`icon-trigger fa fa-${
              discrepency.hasDiff ? 'warning' : 'info-circle'
            }`}
            onClick={this.toggleShowPopover}
          />
        </OverlayTrigger>

        <History
          field={discrepency}
          history={history}
          isOpen={showHistoryModal}
          handleOnClose={this.toggleShowHistory}
        />
      </div>
    )
  }
}

// function mapStateToProps({ deals }, { deal, contextName }) {
//   const ctx = deal.deal_context[contextName]

//   if (!ctx) {
//     return {
//       noDealContext: true
//     }
//   }

//   return {
//     history: deals.contextsHistory[ctx.id]
//   }
// }

export default ContextDiscrepency
// connect(null, { getContextHistory })(ContextDiscrepency)
