import React, { Fragment } from 'react'
import { Header } from '../styled'
import RadioButton from '../../../../../../views/components/radio'
import CategoryType from '../CategoryTypes'
import { CategoryTypesContainer } from './styled'

const radioButtonStyle = { display: 'block', marginTop: '2rem' }

const taskTypes = [
  'Call',
  'Message',
  'Todo',
  'Closing',
  'Inspection',
  'Tour',
  'Listing appointment',
  'Follow up',
  'Open House'
]

const DealCriticalDates = [
  'List Date',
  'Expiration Date',
  'Contract Date',
  'Inspection Date',
  'Option Period',
  'Financing Due',
  'Title Due',
  'T47 Due',
  'Closing Date',
  'Possession Date',
  'Lease Executed',
  'Lease Application Date',
  'Lease Begin',
  'Lease End'
]

const ContactDates = ['Birthday', 'Important Date']

const allTypes = taskTypes.concat(DealCriticalDates, ContactDates)

const ICalAllTypes = ({
  selectedTypes,
  onChangeSelectedTypes,
  onChangeSelectAllTypes
}) => (
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
      <CategoryType
        title="Deal Critical Dates:"
        types={DealCriticalDates}
        selectedTypes={selectedTypes}
        onChangeSelectedTypes={onChangeSelectedTypes}
      />
      <CategoryType
        title="Contact Dates:"
        types={ContactDates}
        selectedTypes={selectedTypes}
        onChangeSelectedTypes={onChangeSelectedTypes}
      />
    </CategoryTypesContainer>
  </Fragment>
)

export default ICalAllTypes
