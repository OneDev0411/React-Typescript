import React, { useState } from 'react'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import ListingsAndPlacesSearchInput from 'components/ListingsAndPlacesSearchInput'

function ShowingStepProperty() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deal, setDeal] = useState()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [listing, setListing] = useState()

  return (
    <QuestionSection>
      <QuestionTitle>What is the address for the property?</QuestionTitle>
      <QuestionForm>
        <ListingsAndPlacesSearchInput
          onSelect={result => console.log('onSelect', result)}
        />
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepProperty
