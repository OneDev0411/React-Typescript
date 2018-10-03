import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { SectionTitle } from '../styled'
import RadioButton from '../../../../../../views/components/RadioButton'
import CategoryType from '../CategoryTypes'
import { CategoryTypesContainer } from './styled'
import { getContexts } from '../../../../../../store_actions/deals'

const radioButtonStyle = { display: 'block', marginTop: '2rem' }

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
      this.props.getContexts()
    }
  }

  render() {
    const { onChangeSelectedTypes, onChangeSelectAllTypes } = this.props
    const filteredContexts =
      this.props.contexts &&
      this.props.contexts.filter(context => context.data_type === 'Date')

    const filteredContactsAttributesDefs =
      this.props.contactsAttributesDefs &&
      _.filter(
        this.props.contactsAttributesDefs,
        def => def.data_type === 'date' && def.show
      )
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
      <Fragment>
        <SectionTitle>
          What event types would you like to export to your iCal?
        </SectionTitle>
        <RadioButton
          selected={selectedTypes.length === allTypes.length}
          title="All of my dates from Rechat"
          onClick={() =>
            onChangeSelectAllTypes(
              selectedTypes.length === allTypes.length ? [] : allTypes
            )
          }
          style={radioButtonStyle}
          square
        />
        <CategoryTypesContainer>
          <CategoryType
            title="Event Types:"
            types={taskTypes}
            selectedTypes={selectedTypes}
            onChangeSelectedTypes={onChangeSelectedTypes}
          />
          {filteredContexts && (
            <CategoryType
              title="Deal Critical Dates:"
              types={filteredContexts}
              selectedTypes={selectedTypes}
              onChangeSelectedTypes={onChangeSelectedTypes}
            />
          )}
          {filteredContactsAttributesDefs && (
            <CategoryType
              title="Contact Dates:"
              types={filteredContactsAttributesDefs}
              selectedTypes={selectedTypes}
              onChangeSelectedTypes={onChangeSelectedTypes}
            />
          )}
        </CategoryTypesContainer>
      </Fragment>
    )
  }
}

function mapToProps({ deals, contacts }) {
  return {
    contexts: deals.contexts,
    contactsAttributesDefs: contacts.attributeDefs.byId
  }
}

export default connect(
  mapToProps,
  { getContexts }
)(ICalAllTypes)
