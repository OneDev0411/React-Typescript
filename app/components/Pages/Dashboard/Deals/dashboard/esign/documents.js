import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'
import cn from 'classnames'

class SelectDocumentModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDocs: []
    }
  }

  componentDidMount() {

  }

  toggleSelectDocument(task) {
    const { selectedDocs } = this.state
    let newList = []
    const index = selectedDocs.indexOf(task.id)

    if (index === -1) {
      newList = [
        ...selectedDocs,
        task.id
      ]
    } else {
      newList = selectedDocs.filter(doc => doc !== task.id)
    }

    this.setState({
      selectedDocs: newList
    })
  }

  render() {
    const { selectedDocs } = this.state
    const { tasks, show, dealId, onDone, onClose } = this.props

    return (
      <Modal
        show={show}
        onHide={() => onClose()}
        dialogClassName="modal-deal-esign-documents"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Documents</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="documents">
            {
              _
              .chain(tasks)
              .filter(task => {
                return task.task_type === 'Form' &&
                  task.deal === dealId &&
                  task.submission
                  // task.submission.state === 'Fair'
              })
              .map(task => {
                const isSelected = selectedDocs.indexOf(task.id) > -1
                return (
                  <Row
                    key={task.id}
                    className="item"
                    onClick={() => this.toggleSelectDocument(task)}
                  >
                    <Col sm={1} xs={2} className="vcenter">
                      <span
                        className={cn('radio', { selected: isSelected })}
                      >
                        { isSelected && <i className="fa fa-check" /> }
                      </span>
                    </Col>

                    <Col sm={11} xs={10} className="name vcenter">
                      <div>{ task.title }</div>
                      <div className="date">
                        Completed {moment.unix(task.submission.updated_at).format('MMMM DD, YYYY')}
                      </div>
                    </Col>
                  </Row>
                )
              })
              .value()
            }
          </div>
        </Modal.Body>

        <Modal.Footer>
          <span className="count">
            { selectedDocs.length } doc selected
          </span>

          <Button
            className="deal-button"
            onClick={() => onDone(selectedDocs)}
            disabled={selectedDocs.length < 1}
          >
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect(({ deals }) => ({
  tasks: deals.tasks
}))(SelectDocumentModal)
