import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'

import {
  addAttributes,
  deleteAttributes,
  getContactsTags as getExistingTags
} from '../../../../../../store_actions/contacts'
import { getContactTags } from '../../../../../../models/contacts/helpers/get-contact-tags'
import { selectTags } from '../../../../../../reducers/contacts/tags'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import TagsOverlay from '../../components/TagsOverlay'

class Tags extends React.Component {
  state = {
    loading: false,
    overlayIsOpen: false
  }

  componentDidMount() {
    this.fetchTags()
  }

  fetchTags = async () => {
    const { existingTags, getExistingTags } = this.props

    if (existingTags.length === 0 && !this.state.loading) {
      this.setState({
        loading: 'Loading'
      })

      await getExistingTags()

      this.setState({
        loading: false
      })
    }
  }

  handleSubmitChanges = async ({ newTags = [], removedTags = [] }) => {
    const {
      contact,
      attribute_def,
      addAttributes,
      getExistingTags,
      deleteAttributes
    } = this.props

    this.setState({
      loading: 'Saving'
    })

    // insert new tags
    if (newTags.length > 0) {
      const attributes = newTags.map(({ text }) => ({
        text,
        attribute_def: attribute_def.id
      }))

      await addAttributes(contact.id, attributes)
    }

    if (removedTags.length > 0) {
      const attributesIds = removedTags.map(({ id }) => id)

      await deleteAttributes(contact.id, attributesIds)
    }

    await getExistingTags()

    this.setState({
      loading: false
    })
  }

  openOverLay = () => this.setState({ overlayIsOpen: true })

  closeOverlay = () => this.setState({ overlayIsOpen: false })
  render() {
    const { tags, contact } = this.props
    const { overlayIsOpen, loading } = this.state

    return (
      <div className="c-contact-profile-card tags">
        <h3 className="c-contact-profile-card__title">Tags</h3>
        <div className="c-contact-profile-card__body">
          {loading ? (
            <span style={{ color: '#2196f3' }}>
              <i className="fa fa-spin fa-spinner" />
              {`   ${loading}...`}
            </span>
          ) : (
            <div className="tags">
              {_.chain(tags)
                .filter(tag => tag.active)
                .map(tag => (
                  <button
                    key={`tag_${tag.id}`}
                    className="c-contact__tag active"
                    onClick={() =>
                      this.handleSubmitChanges({ removedTags: [tag] })
                    }
                  >
                    {tag.text}
                  </button>
                ))
                .value()}
              <button
                className="c-contact__tag--new"
                onClick={this.openOverLay}
              >
                +
              </button>
            </div>
          )}
        </div>
        <TagsOverlay
          selectedContactsIds={[contact.id]}
          isOpen={overlayIsOpen}
          closeOverlay={this.closeOverlay}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ contacts }, { contact }) => {
  const existingTags = selectTags(contacts.tags)
  const attribute_def = selectDefinitionByName(contacts.attributeDefs, 'tag')
  const tags = getContactTags(contact, attribute_def, existingTags)

  return { tags, existingTags, attribute_def }
}

export default connect(
  mapStateToProps,
  {
    addAttributes,
    getExistingTags,
    deleteAttributes
  }
)(Tags)
