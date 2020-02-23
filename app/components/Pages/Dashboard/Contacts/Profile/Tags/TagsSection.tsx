import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'

import { IAppState } from 'reducers'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'

import { Section } from '../components/Section'
import TagsOverlay from '../../components/TagsOverlay'

import TagsList from './TagsList'

interface Props {
  contact: INormalizedContact
  tags: IContactAttributeWithDef[]
}

function Tags(props: Props) {
  const hasTags = props.tags.length > 0
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <Section
      onEdit={hasTags ? () => setIsDrawerOpen(true) : undefined}
      title="Tags"
      setting={{
        tooltip: 'Manage Tags',
        href: '/dashboard/account/manage-tags'
      }}
    >
      <div style={{ padding: '0 1.5rem' }}>
        {hasTags ? (
          <TagsList tags={props.tags} />
        ) : (
          <Button variant="outlined" onClick={() => setIsDrawerOpen(true)}>
            Add Tag
          </Button>
        )}
      </div>

      {/*
      // @ts-ignore js component */}
      <TagsOverlay
        contact={props.contact}
        closeOverlay={() => setIsDrawerOpen(false)}
        isOpen={isDrawerOpen}
        selectedContactsIds={[props.contact.id]}
      />
    </Section>
  )
}

const mapStateToProps = (
  state: IAppState,
  props: { contact: INormalizedContact }
) => {
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
