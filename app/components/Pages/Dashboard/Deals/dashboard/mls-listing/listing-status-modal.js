import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import { getStatusColorClass } from '../../../../../../utils/listing'

export default class ListingStatusModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedStatus: props.status
    }

    this.statusList = this.getStatues()
  }

  componentWillReceiveProps(nextProps) {
    const { show, status } = nextProps

    if (show && show !== this.props.show) {
      this.setState({ selectedStatus: status })
    }
  }

  getStatues() {
    const { deal, isBackOffice } = this.props
    const isLeaseDeal = deal.property_type.includes('Lease')

    if (isLeaseDeal) {
      return isBackOffice
        ? [
            'Active',
            'Temp Off Market',
            'Leased',
            'Withdrawn',
            'Expired',
            'Cancelled',
            'Contract Terminated'
          ]
        : ['Active', 'Leased', 'Contract Terminated']
    }

    return isBackOffice
      ? [
          'Active',
          'Sold',
          'Pending',
          'Temp Off Market',
          'Active Option Contract',
          'Active Contingent',
          'Active Kick Out',
          'Withdrawn',
          'Expired',
          'Cancelled',
          'Contract Terminated'
        ]
      : [
          'Active',
          'Pending',
          'Active Option Contract',
          'Active Contingent',
          'Active Kick Out',
          'Contract Terminated'
        ]
  }

  render() {
    const {
      show,
      onClose,
      isBackOffice,
      saveText,
      onChangeStatus,
      status: oldStatus
    } = this.props
    const { selectedStatus } = this.state

    return (
      <Modal
        show={show}
        onHide={onClose}
        dialogClassName="modal-deal-mls-status-modal"
      >
        <Modal.Header closeButton>
          {isBackOffice ? 'Deal status' : 'Request to change status'}
        </Modal.Header>

        <Modal.Body>
          <Row>
            {this.statusList.map((status, key) => (
              <Col
                key={key}
                md={6}
                sm={6}
                xs={6}
                className="vcenter"
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ selectedStatus: status })}
              >
                <span
                  className={cn('radio', {
                    selected: selectedStatus === status
                  })}
                >
                  <i className="fa fa-check" />
                </span>

                <span
                  className="status"
                  style={{ background: getStatusColorClass(status) }}
                />

                <span className="name">{status}</span>
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button className="select-status__button cancel" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={selectedStatus === oldStatus}
            className="select-status__button"
            onClick={() => onChangeStatus(selectedStatus)}
          >
            {saveText || 'Update'}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
