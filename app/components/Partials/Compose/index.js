import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import AutosizeInput from 'react-input-autosize'

export default class Compose extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: ''
    }
  }

  componentDidMount() {

  }

  onChange(e) {
    console.log(e)
  }

  render() {
    const { show, onHide } = this.props

    return (
      <Modal
        show={show}
        dialogClassName="compose-modal"
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Members</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="tags-container">
            <span className="to">To: </span>
            <span className="tag">ABCDEFG</span>
            <span className="tag">ABCDEFG</span>
            <span className="tag">ABCDEFG</span>
            <span className="tag">ABCDEFG</span>
            <span className="tag">ABCDEFG</span>
            <span className="tag">ABCDEFG</span>
            <AutosizeInput
              value={this.state.input}
              onChange={e => this.setState({ input: e.target.value })}
              placeholder="Enter name, email or phone"
              maxLength={30}
              placeholderIsMinWidth
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="primary">Add</Button>
        </Modal.Footer>

      </Modal>
    )
  }
}
