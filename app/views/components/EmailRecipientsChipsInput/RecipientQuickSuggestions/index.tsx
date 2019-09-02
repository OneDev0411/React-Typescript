import * as React from 'react'
import { connect } from 'react-redux'

import { Box } from '@material-ui/core'

import { curry, isEqual } from 'lodash'

import { IAppState } from 'reducers/index'
import { getActiveTeam } from 'utils/user-teams'

import { RecipientQuickSuggestion } from '../RecipientQuickSuggestion'

interface Props {
  user: IUser
  currentRecipients?: IDenormalizedEmailRecipientInput[]
  onSelect: (recipient: IDenormalizedEmailRecipientInput) => void
}

export const RecipientQuickSuggestions = connect(({ user }: IAppState) => ({
  user
}))(function RecipientSuggestions({
  user,
  onSelect,
  currentRecipients = []
}: Props) {
  const activeTeam = getActiveTeam(user)

  const suggestions: IDenormalizedEmailRecipientInput[] = [
    {
      recipient_type: 'AllContacts'
    }
  ]

  if (
    activeTeam &&
    (activeTeam.brand.brand_type === 'Brokerage' ||
      activeTeam.brand.brand_type === 'Office')
  ) {
    suggestions.push({
      recipient_type: 'Brand',
      brand: activeTeam.brand
    })
  }

  const unusedSuggestions = suggestions.filter(
    suggestion => !currentRecipients.find(areRecipientsEqual(suggestion))
  )

  return unusedSuggestions.length > 0 ? (
    <Box py={1} flexGrow={0} flexShrink={0} flexBasis="100%">
      <Box display="inline-block" color="text.secondary" mr={1}>
        Suggestions
      </Box>
      {unusedSuggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <RecipientQuickSuggestion
            recipient={suggestion}
            onSelect={onSelect}
          />
          <>{index < unusedSuggestions.length - 1 ? ', ' : ''}</>
        </React.Fragment>
      ))}
    </Box>
  ) : null
})

const areRecipientsEqual = curry(
  (
    recipient1: IDenormalizedEmailRecipientInput,
    recipient2: IDenormalizedEmailRecipientInput
  ) => {
    if (recipient1.recipient_type !== recipient2.recipient_type) {
      return false
    }

    if (recipient1.recipient_type === 'Brand') {
      return (
        recipient1.brand.id ===
        (recipient2 as IDenormalizedEmailRecipientBrandInput).brand.id
      )
    }

    return isEqual(recipient1, recipient2)
  }
)
