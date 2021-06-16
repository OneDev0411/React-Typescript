import React from 'react'
import { connect } from 'react-redux'

import { selectBrandContexts } from 'reducers/deals/contexts'
import { getContextsByBrand } from 'actions/deals/context'
import { getActiveTeamId } from 'utils/user-teams'
import { Checkbox } from 'components/Checkbox'

import CategoryType from '../CategoryTypes'

import { Section } from '../styled'
import Title from '../Title'
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
      this.props.getContextsByBrand(getActiveTeamId(this.props.user))
    }
  }

  render() {
    const { props } = this
    const {
      onChangeSelectedTypes,
      onChangeSelectAllTypes,
      onSelectOneCategoriesTypes
    } = props

    const filteredContexts = props.contexts
      ? props.contexts
          .filter(context => context.data_type === 'Date')
          .map(context => ({ ...context, name: context.key }))
      : []

    const filteredContactsAttributesDefs = props.contactsAttributesDefs
      ? Object.values(props.contactsAttributesDefs)
          .filter(
            def =>
              def.data_type === 'date' &&
              def.editable &&
              ((def.name != null && def.name.trim().length) ||
                (def.label != null && def.label.trim().length))
          )
          .map(type => ({ ...type, name: type.name || type.label }))
      : []

    const allTypes = [
      ...taskTypes,
      ...filteredContexts,
      ...filteredContactsAttributesDefs
    ].map(type => type.name)

    const selectedTypes = props.selectedTypes.filter(selectedType =>
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
    contexts: selectBrandContexts(deals.contexts, brandId),
    contactsAttributesDefs: contacts.attributeDefs.byId
  }
}

export default connect(mapToProps, { getContextsByBrand })(ICalAllTypes)
