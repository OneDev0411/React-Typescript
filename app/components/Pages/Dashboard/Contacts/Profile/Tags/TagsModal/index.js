import React, { Component } from 'react'
import _ from 'underscore'
import cn from 'classnames'
import { Modal, Button, FormControl } from 'react-bootstrap'

export default class extends Component {
  state = {
    newTag: null,
    tags: this.props.tags
  }

  componentWillReceiveProps(nextProps) {
    const nextActiveTags = _.filter(nextProps.tags, tag => tag.active)
    const previousActiveTags = _.filter(this.props.tags, tag => tag.active)

    if (nextActiveTags.length !== previousActiveTags.length) {
      this.setState({
        tags: nextProps.tags
      })
    }
  }

  handleToggleTag = tag => {
    const { tags } = this.state

    const newTags = {
      ...tags,
      [tag.text]: {
        ...tags[tag.text],
        active: !tag.active
      }
    }

    this.setState({
      tags: newTags
    })
  }

  handleSubmitNewTag = () => {
    let { tags, newTag } = this.state

    newTag = newTag.trim()

    if (!newTag || tags[newTag]) {
      return false
    }

    const newTags = {
      ...tags,
      [newTag]: {
        is_new: true,
        active: true,
        text: newTag
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
      (tags[item.text] && !tags[item.text].active && item.active)

    const filterDeletedTags = item =>
      tags[item.text] && tags[item.text].active && !item.active && !item.is_new

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

    if (!isOpen) {
      return null
    }

    return (
      <Modal
        show={isOpen}
        onHide={this.handleHideModal}
        dialogClassName="modal-add-tag"
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
              {Object.values(tags).map((tag, index) => (
                <button
                  key={`tag_${index}_${tag.text}`}
                  onClick={() => this.handleToggleTag(tag)}
                  title={tag.active ? 'Remove tag' : 'Add tag'}
                  className={cn('c-contact__tag', { active: tag.active })}
                >
                  {tag.text}
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
