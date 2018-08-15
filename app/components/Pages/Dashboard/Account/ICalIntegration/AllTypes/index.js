import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Header } from '../styled'
import RadioButton from '../../../../../../views/components/radio'
import CategoryType from '../CategoryTypes'
import { CategoryTypesContainer } from './styled'
import { getContexts } from '../../../../../../store_actions/deals'

const radioButtonStyle = { display: 'block', marginTop: '2rem' }

const taskTypes = [
  {
    name: 'Closing',
    label: 'Closing'
  },
  {
    name: 'Follow up',
    label: 'Follow up'
  },
  {
    name: 'Inspection',
    label: 'Inspection'
  },
  {
    name: 'Listing appointment',
    label: 'Listing appointment'
  },
  {
    name: 'Open House',
    label: 'Open House'
  },
  {
    name: 'Todo',
    label: 'Todo'
  },
  {
    name: 'Tour',
    label: 'Tour'
  }
]

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
        def => def.data_type === 'date'
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
        <Header>What event types would you like to export to your iCal?</Header>
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
            title="Task Types:"
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
