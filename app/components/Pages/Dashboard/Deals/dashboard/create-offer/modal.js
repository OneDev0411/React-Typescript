import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { addNotification as notify } from 'reapop'
import { Modal, Button } from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import { createOffer } from '../../../../../../store_actions/deals'

class CreateOfferModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      creating: false,
      buyerName: '',
      activeOption: props.hasPrimaryOffer ? 'backup' : null
    }
  }

  async createOffer() {
    const { deal, notify, onClose } = this.props
    const { buyerName, activeOption } = this.state
    const isBackup = activeOption === 'backup'
    const order = this.getMaxOrder() + 1

    this.setState({ creating: true })

    try {
      await this.props.createOffer(deal.id, buyerName, order, isBackup, deal.property_type)

      notify({
        title: 'Offer created',
        message: `The offer(${buyerName}) has been created`,
        status: 'success',
        dismissible: true,
        dismissAfter: 6000
      })

      return this.setState({
        creating: false,
        buyerName: '',
        activeOption: null
      }, onClose)

    } catch(e) {
      console.log(e)
      /* nothing */
    }

    this.setState({ creating: false })
  }

  getMaxOrder() {
    let max = 0

    const { deal, checklists } = this.props
    if (!deal.checklists) {
      return max
    }

    deal.checklists.forEach(id => {
      const list = checklists[id]
      if (list.order > max) {
        max = list.order
      }
    })

    return max
  }

  render() {
    const { show, hasPrimaryOffer, onClose } = this.props
    const { activeOption, buyerName, creating } = this.state

    return (
      <Modal
        show={show}
        onHide={() => onClose()}
        dialogClassName="modal-deal-add-offer"
      >
        <Modal.Header closeButton>
          Add New Offer
        </Modal.Header>

        <Modal.Body>
          <ReactTooltip
            place="top"
            className="deal-filter--tooltip"
            multiline
          />

          <span className="control-label">BUYER NAME</span>
          <input
            className="buyer-name"
            placeholder="Type a name..."
            value={buyerName}
            onChange={e => this.setState({ buyerName: e.target.value })}
          />

          <div
            className={`option active ${hasPrimaryOffer ? 'disabled' : ''}`}
            data-tip={hasPrimaryOffer ?
              'You can not have 2 primary offers at the same time' :
              null
            }
            onClick={() => !hasPrimaryOffer && this.setState({ activeOption: 'active' })}
          >
            <span className="check-area">
              <i className={`fa fa-${activeOption === 'active' ? 'check-circle-o' : 'circle-o'}`} />
            </span>
            Primary Offer
          </div>

          <div
            className="option backup"
            onClick={() => this.setState({ activeOption: 'backup' })}
          >
            <span className="check-area">
              <i className={`fa fa-${activeOption === 'backup' ? 'check-circle-o' : 'circle-o'}`} />
            </span>
            Backup Offer
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="deal-button"
            disabled={creating || buyerName.length === 0 || activeOption === null}
            onClick={() => this.createOffer()}
          >
            { creating ? 'Creating' : 'Add' }
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect(({ deals }) => ({
  checklists: deals.checklists
}), { createOffer, notify })(CreateOfferModal)
