import React from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'
import _ from 'underscore'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      newTags: []
    }
  }

  addTag() {
    const { newTags, title } = this.state

    if (title.length === 0 || newTags.indexOf(title.trim()) > -1)
      return

    newTags.push(title.trim())

    this.setState({ newTags, title: '' })
  }

  done() {
    const { newTags } = this.state

    this.setState({
      newTags: []
    })

    this.props.onChange({
      create: newTags
    })
  }

  render() {
    const { show, tags } = this.props
    const { newTags, title } = this.state

    return (
      <Modal
        dialogClassName="modal-add-tag"
        show={show}
      >
        <Modal.Body>
          <Modal.Header>
            <Modal.Title>Tags</Modal.Title>
            <Button
              className="done"
              bsStyle="link"
              onClick={() => this.done()}
            >
              Done
            </Button>

          </Modal.Header>
          <div className="tags-container">
            <ul className="tags">
              {
                _.map(tags, item =>
                  <li key={`tag_${item.id}`}>
                    { item.tag }
                  </li>
                )
              }

              {
                _.map(newTags, (name, key) =>
                  <li key={`tag_new_${key}`}>
                    { name }
                  </li>
                )
              }

              {
                title.length > 0 &&
                <li className="new-item">
                  { title }
                </li>
              }
            </ul>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <FormControl
            placeholder="Type tag here"
            onChange={e => this.setState({ title: e.target.value })}
            value={title}
            maxLength={20}
          />
          <Button
            bsStyle="primary"
            onClick={() => this.addTag()}
            disabled={title.length === 0 || newTags.indexOf(title) > -1}
          >
            Add Tag
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
