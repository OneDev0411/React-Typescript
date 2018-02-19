import React from 'react'
import { Modal, Button, FormControl } from 'react-bootstrap'
import _ from 'underscore'
import cn from 'classnames'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newTag: null,
      tags: props.tags
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      _.size(nextProps.tags) !== _.size(this.props.tags) &&
      _.size(this.props.tags) === _.size(this.state.tags)
    ) {
      this.setState({
        tags: nextProps.tags
      })
    }
  }

  handleToggleTag = item => {
    const { tags } = this.state

    const newTags = {
      ...tags,
      [item.tag]: {
        ...tags[item.tag],
        active: !item.active
      }
    }

    this.setState({
      tags: newTags
    })
  }

  handleSubmitNewTag = () => {
    const { tags, newTag } = this.state

    if (newTag == null || tags[newTag]) {
      return false
    }

    const _newTag = newTag.trim()

    const newTags = {
      ...tags,
      [_newTag]: {
        is_new: true,
        id: newTag,
        active: true,
        type: 'tag',
        tag: newTag
      }
    }

    this.setState({
      tags: newTags,
      newTag: null
    })
  }

  handleSubmitChanges = () => {
    const { tags: _tags } = this.state
    const { tags, handleSubmit } = this.props

    const filterNewTags = item =>
      (item.is_new && item.active) ||
      (tags[item.tag] && !tags[item.tag].active && item.active)

    const filterDeletedTags = item =>
      tags[item.tag] && tags[item.tag].active && !item.active && !item.is_new

    const newTags = _.filter(_tags, filterNewTags)

    const removedTags = _.filter(_tags, filterDeletedTags)

    handleSubmit({ newTags, removedTags })
  }

  handleOnChange = event => {
    const newTag = event.target.value.trim()

    this.setState({ newTag })
  }

  handleHideModal = () => {
    this.props.handleClose()
    this.setState({
      newTag: null,
      tags: {}
    })
  }

  render() {
    const { isOpen } = this.props
    const { tags, newTag } = this.state

    return (
      <Modal
        dialogClassName="modal-add-tag"
        show={isOpen}
        onHide={this.handleHideModal}
      >
        <Modal.Body>
          <Modal.Header>
            <Modal.Title>Tags</Modal.Title>
            <Button
              bsStyle="link"
              className="done"
              onClick={this.handleSubmitChanges}
            >
              Done
            </Button>
          </Modal.Header>

          <div className="tags-container">
            <div className="tags">
              {_.map(tags, item => (
                <button
                  key={`tag_${item.id}`}
                  className={cn('c-contact__tag', { active: item.active })}
                  title={item.active ? 'Remove tag' : 'Add tag'}
                  onClick={() => this.handleToggleTag(item)}
                >
                  {item.tag}
                </button>
              ))}

              {newTag && (
                <button className="c-contact__tag--new">{newTag}</button>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <FormControl
            maxLength={20}
            value={newTag || ''}
            placeholder="Enter a new tag"
            onChange={this.handleOnChange}
          />

          <Button
            bsStyle="primary"
            onClick={this.handleSubmitNewTag}
            disabled={newTag == null || tags[newTag] != null}
          >
            Add Tag
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
