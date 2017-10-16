import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { addNotification as notify } from 'reapop'
import { Modal, Button } from 'react-bootstrap'
import { addContract } from '../../../../../../store_actions/deals'

class AddContractModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      creating: false,
      buyerName: '',
      activeOption: null
    }
  }

  async createContract() {
    const { deal, addContract, notify, onClose } = this.props
    const { buyerName, activeOption } = this.state
    const isBackup = activeOption === 'backup'
    const order = this.getMaxOrder() + 1

    this.setState({ creating: true })

    try {
      await addContract(deal.id, buyerName, order, isBackup, deal.property_type)

      notify({
        title: 'Contract created',
        message: `The Contract(${buyerName}) has been created`,
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
    const { show, onClose } = this.props
    const { activeOption, buyerName, creating } = this.state

    return (
      <Modal
        show={show}
        onHide={() => onClose()}
        dialogClassName="modal-deal-add-contract"
      >
        <Modal.Header closeButton>
          Add a Contract
        </Modal.Header>

        <Modal.Body>
          <span className="control-label">BUYER NAME</span>
          <input
            className="buyer-name"
            placeholder="Type a name..."
            value={buyerName}
            onChange={e => this.setState({ buyerName: e.target.value })}
          />

          <div
            className="option active"
            onClick={() => this.setState({ activeOption: 'active' })}
          >
            <span className="check-area">
              <i className={`fa fa-${activeOption === 'active' ? 'check-circle-o' : 'circle-o'}`} />
            </span>
            Primary Contract
          </div>

          <div
            className="option backup"
            onClick={() => this.setState({ activeOption: 'backup' })}
          >
            <span className="check-area">
              <i className={`fa fa-${activeOption === 'backup' ? 'check-circle-o' : 'circle-o'}`} />
            </span>
            Backup Contract
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="deal-button"
            disabled={creating || buyerName.length === 0 || activeOption === null}
            onClick={() => this.createContract()}
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
}), { addContract, notify })(AddContractModal)
