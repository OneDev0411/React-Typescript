import React from 'react'
import { connect } from 'react-redux'

import { getContactAttribute } from '../../../../../../models/contacts/helpers/get-contact-attribute'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
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
    return (
      <Section onEdit={this.openOverLay} title="Tags">
        {this.props.tags.length > 0 ? (
          <TagsList tags={this.props.tags} />
        ) : (
          <div
            style={{
              textAlign: 'center',
              marginBottom: '1em'
            }}
          >
            <ActionButton inverse onClick={this.openOverLay}>
              Add new property
            </ActionButton>
          </div>
        )}

        <TagsOverlay
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
