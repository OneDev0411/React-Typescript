import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import {
  addAttributes,
  getContactsTags,
  deleteAttributes
} from '../../../../../../store_actions/contacts'
import TagsModal from './TagsModal'

class Tags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      isOpenModal: false
    }

    this.handleSubmitChanges = this.handleSubmitChanges.bind(this)
  }

  async handleSubmitChanges({ newTags = [], removedTags = [] }) {
    const {
      contactId,
      addAttributes,
      getContactsTags,
      deleteAttributes
    } = this.props

    if (newTags.length === 0 && removedTags.length === 0) {
      return this.setState({
        isOpenModal: false
      })
    }

    this.setState({
      isOpenModal: false,
      saving: true
    })

    // insert new tags
    if (newTags.length > 0) {
      const attributes = _.map(newTags, item => ({
        id: undefined,
        type: 'tag',
        tag: item.tag
      }))

      await addAttributes(contactId, attributes)
    }

    if (removedTags.length > 0) {
      const attributesIds = removedTags.map(({ id }) => id)

      await deleteAttributes({ contactId, attributesIds })
    }

    await getContactsTags()

    this.setState({
      saving: false
    })
  }

  handelOpenModal = () => this.setState({ isOpenModal: true })

  handleCloseModal = () => this.setState({ isOpenModal: false })

  render() {
    const { tags } = this.props
    const { isOpenModal, saving } = this.state

    return (
      <div className="c-contact-profile-card tags">
        <h3 className="c-contact-profile-card__title">Tags</h3>
        <div className="c-contact-profile-card__body">
          {saving ? (
            <span style={{ color: '#2196f3' }}>
              <i className="fa fa-spin fa-spinner" />
              {'  '}
              Saving ...
            </span>
          ) : (
            <div className="tags">
              {_.chain(tags)
                .filter(item => item.active)
                .map(item => (
                  <button
                    key={`tag_${item.id}`}
                    className="c-contact__tag active"
                    onClick={() =>
                      this.handleSubmitChanges({ removedTags: [item] })
                    }
                  >
                    {item.tag}
                  </button>
                ))
                .value()}
              <button
                className="c-contact__tag--new"
                onClick={this.handelOpenModal}
              >
                +
              </button>
            </div>
          )}
        </div>

        <TagsModal
          tags={tags}
          isOpen={isOpenModal}
          handleClose={this.handleCloseModal}
          handleSubmit={this.handleSubmitChanges}
        />
      </div>
    )
  }
}

export default connect(null, {
  getContactsTags,
  deleteAttributes,
  addAttributes
})(Tags)
