import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import AutosizeInput from 'react-input-autosize'
import _ from 'underscore'

class Compose extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      criteria: '',
      viewList: {}
    }
  }

  componentDidMount() {

  }

  onSearch(e) {
    const { contacts } = this.props
    const criteria = e.target.value

    const viewList = _.filter(contacts, contact => {
      return contact.display_name.includes(criteria)
    })

    this.setState({
      criteria,
      viewList
    })
  }

  render() {
    const { show, onHide } = this.props
    const { criteria, viewList } = this.state

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


            <AutosizeInput
              value={criteria}
              onChange={e => this.onSearch(e) }
              placeholder="Enter name, email or phone"
              maxLength={30}
              placeholderIsMinWidth
            />
          </div>

          <div className="suggestions">
            {
              _.map(viewList, item =>
                <div
                  className="item"
                  key={`ITEM_SUG_${item.id}`}
                >
                  { item.display_name }
                </div>
              )
            }
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="primary">Add</Button>
        </Modal.Footer>

      </Modal>
    )
  }
}

export default connect(s => ({
  contacts: s.contact.list
}))(Compose)
