import React from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'
import _ from 'underscore'
import cn from 'classnames'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
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
      ...{[item.tag]: {
        ...tags[item.tag],
        ...{active: !item.active}
      }}
    }

    this.setState({
      tags: newTags
    })
  }

  addTag() {
    const { tags } = this.state
    const title = this.state.title.trim()

    if (title.length === 0 || tags[title])
      return

    const newTags = {
      ...tags,
      ...{[title]: {
        is_new: true,
        id: title,
        active: true,
        type: 'tag',
        tag: title
      }}
    }

    this.setState({
      tags: newTags,
      title: ''
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
    const { tags, title } = this.state

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
            disabled={title.length === 0 || tags[title.trim()] !== undefined}
          >
            Add Tag
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
