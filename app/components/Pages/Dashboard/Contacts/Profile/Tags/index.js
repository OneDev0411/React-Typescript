import React from 'react'
import { connect } from 'react-redux'

import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import { getContactAttribute } from '../../../../../../models/contacts/helpers/get-contact-attribute'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

import { Section } from '../components/Section'
import TagsOverlay from '../../components/TagsOverlay'
import { TagsList } from './TagsList'

class Tags extends React.Component {
  state = {
    overlayIsOpen: false
  }

  openOverLay = () => this.setState({ overlayIsOpen: true })

  closeOverlay = () => this.setState({ overlayIsOpen: false })

  render() {
    const hasTags = this.props.tags.length > 0

    return (
      <Section
        onEdit={hasTags ? this.openOverLay : undefined}
        title="Tags"
        setting={{
          tooltip: 'Manage Tags',
          href: '/dashboard/account/manage-tags'
        }}
      >
        <div style={{ padding: '0 1.5rem' }}>
          {hasTags ? (
            <TagsList tags={this.props.tags} />
          ) : (
            <ActionButton
              isBlock
              appearance="outline"
              onClick={this.openOverLay}
              size="small"
            >
              Add Tag
            </ActionButton>
          )}
        </div>

        <TagsOverlay
          contact={this.props.contact}
          closeOverlay={this.closeOverlay}
          isOpen={this.state.overlayIsOpen}
          selectedContactsIds={[this.props.contact.id]}
        />
      </Section>
    )
  }
}

const mapStateToProps = (state, props) => {
  const attributeDef = selectDefinitionByName(
    state.contacts.attributeDefs,
    'tag'
  )

  const tags = attributeDef
    ? getContactAttribute(props.contact, attributeDef)
    : []

  return {
    tags
  }
}

export default connect(mapStateToProps)(Tags)
