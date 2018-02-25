import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import { getStatusColorClass } from '../../../../../../utils/listing'

export default class extends React.Component {
  constructor(props) {
    super(props)

    const { deal } = props
    const isLeaseDeal = deal.property_type.includes('Lease')

    this.statusList = isLeaseDeal
      ? ['Lease', 'Lease Contract', 'Leased']
      : [
          'Active',
          'Cancelled',
          'Active Contingent',
          'Expired',
          'Active Kick Out',
          'Archived',
          'Active Option Contract',
          'Temp Off Market',
          'Pending',
          'Withdrawn',
          'Sold',
          'Withdrawn Sublisting'
        ]

    this.state = {
      selectedStatus: props.status
    }
  }

  render() {
    const { show, onClose, saveText, onChangeStatus } = this.props
    const { selectedStatus } = this.state

    return (
      <Modal
        show={show}
        onHide={onClose}
        dialogClassName="modal-deal-mls-status-modal"
      >
        <Modal.Header closeButton>Deal status</Modal.Header>

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
          <Button className="deal-button cancel" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="deal-button"
            onClick={() => onChangeStatus(selectedStatus)}
          >
            {saveText || 'Update'}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
