import React from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'
import _ from 'underscore'
import cn from 'classnames'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tagName: '',
      tags: props.tags
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tags: nextProps.tags
    })
  }

  updateTag(item) {
    const { tags } = this.state

    const newTags = {
      ...tags,
      ...{ [item.tag]: {
        ...tags[item.tag],
        ...{ active: !item.active }
      } }
    }

    this.setState({
      tags: newTags
    })
  }

  addTag() {
    const { tags } = this.state
    const tagName = this.state.tagName.trim()

    if (tagName.length === 0 || tags[tagName]) {
      return false
    }

    const newTags = {
      ...tags,
      ...{ [tagName]: {
        is_new: true,
        id: tagName,
        active: true,
        type: 'tag',
        tag: tagName
      } }
    }

    this.setState({
      tags: newTags,
      tagName: ''
    })
  }

  done() {
    const { tags } = this.props

    const inserts = _.filter(this.state.tags, item =>
      (item.is_new && item.active) || (tags[item.tag] && !tags[item.tag].active && item.active)
    )

    const deletes = _.filter(this.state.tags, item =>
      tags[item.tag] && tags[item.tag].active && !item.active && !item.is_new
    )

    this.props.onDone({ inserts, deletes })
  }

  render() {
    const { show } = this.props
    const { tags, tagName } = this.state

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
                _.map(tags, item => (
                  <li
                    key={`tag_def_${item.id}`}
                    className={cn({ active: item.active })}
                    title={item.active ? 'Remove tag' : 'Add tag'}
                    onClick={() => this.updateTag(item)}
                  >
                    { item.tag }
                  </li>
                ))
              }

              {
                tagName.length > 0 &&
                <li className="new-item">
                  { tagName }
                </li>
              }
            </ul>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <FormControl
            placeholder="Type tag here"
            onChange={e => this.setState({ tagName: e.target.value })}
            value={tagName}
            maxLength={20}
          />

          <Button
            bsStyle="primary"
            onClick={() => this.addTag()}
            disabled={tagName.length === 0 || tags[tagName.trim()] !== undefined}
          >
            Add Tag
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
