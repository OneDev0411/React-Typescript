import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { getContexts } from 'actions/deals'
import { getActiveTeamId } from 'utils/user-teams'
import { Checkbox } from 'components/Checkbox'

import CategoryType from '../CategoryTypes'

import { Section, Title } from '../styled'
import { CategoryTypesContainer } from './styled'

const defaultTaskTypes = [
  'Call',
  'In-Person Meeting',
  'Text',
  'Chat',
  'Mail',
  'Email',
  'Open House',
  'Tour',
  'Other'
]

function getItems(items) {
  return items.map(item => ({ label: item, name: item }))
}

const taskTypes = getItems(defaultTaskTypes)

class ICalAllTypes extends React.Component {
  componentDidMount() {
    if (!this.props.contexts) {
      this.props.getContexts(getActiveTeamId(this.props.user))
    }
  }

  render() {
    const {
      onChangeSelectedTypes,
      onChangeSelectAllTypes,
      onSelectOneCategoriesTypes
    } = this.props
    const filteredContexts =
      this.props.contexts &&
      this.props.contexts
        .filter(context => context.data_type === 'Date')
        .map(context => ({ ...context, name: context.key }))

    const filteredContactsAttributesDefs =
      this.props.contactsAttributesDefs &&
      _.chain(this.props.contactsAttributesDefs)
        .filter(def => def.data_type === 'date' && def.editable)
        .map(type => ({ ...type, name: type.name || type.label }))
        .value()
    const allTypes = taskTypes
      .map(type => type.name)
      .concat(
        filteredContactsAttributesDefs
          ? filteredContactsAttributesDefs.map(type => type.name)
          : [],
        filteredContexts ? filteredContexts.map(type => type.name) : []
      )

    const selectedTypes = this.props.selectedTypes.filter(selectedType =>
      allTypes.includes(selectedType)
    )

    return (
      <Section>
        <Title>
          What event types would you like to export to your calendar?
        </Title>
        <Checkbox
          checked={selectedTypes.length === allTypes.length}
          onChange={() =>
            onChangeSelectAllTypes(
              selectedTypes.length === allTypes.length ? [] : allTypes
            )
          }
          containerStyle={{ display: 'flex', marginBottom: '2rem' }}
        >
          All of my dates from Rechat
        </Checkbox>
        <CategoryTypesContainer>
          <CategoryType
            title="Event Types:"
            types={taskTypes}
            selectedTypes={selectedTypes}
            onChangeSelectedTypes={onChangeSelectedTypes}
            onSelectOneCategoriesTypes={onSelectOneCategoriesTypes}
          />
          {filteredContexts && (
            <CategoryType
              title="Deal Critical Dates:"
              types={filteredContexts}
              selectedTypes={selectedTypes}
              onChangeSelectedTypes={onChangeSelectedTypes}
              onSelectOneCategoriesTypes={onSelectOneCategoriesTypes}
            />
          )}
          {filteredContactsAttributesDefs && (
            <CategoryType
              title="Contact Dates:"
              types={filteredContactsAttributesDefs}
              selectedTypes={selectedTypes}
              onChangeSelectedTypes={onChangeSelectedTypes}
              onSelectOneCategoriesTypes={onSelectOneCategoriesTypes}
            />
          )}
        </CategoryTypesContainer>
      </Section>
    )
  }
}

function mapToProps({ deals, contacts, user }) {
  const brandId = getActiveTeamId(user)

  return {
    user,
    contexts: deals.contexts[brandId],
    contactsAttributesDefs: contacts.attributeDefs.byId
  }
}

export default connect(
  mapToProps,
  { getContexts }
)(ICalAllTypes)
