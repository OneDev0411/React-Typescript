import * as React from 'react'
import { connect } from 'react-redux'

import { Box } from '@material-ui/core'

import { isEqual } from 'lodash'

import { IAppState } from 'reducers/index'
import { getActiveTeam } from 'utils/user-teams'

import { RecipientSuggestion } from '../RecipientSuggestion'

interface Props {
  user: IUser
  currentRecipients: IDenormalizedEmailRecipientInput[]
  onSelect: (recipient: IDenormalizedEmailRecipientInput) => void
}

export const RecipientSuggestions = connect(({ user }: IAppState) => ({
  user
}))(function RecipientSuggestions({
  user,
  onSelect,
  currentRecipients
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
    suggestion =>
      !currentRecipients.find(someRecipient =>
        isEqual(someRecipient, suggestion)
      )
  )

  return unusedSuggestions.length > 0 ? (
    <Box py={1} flexGrow={0} flexShrink={0} flexBasis="100%">
      <Box display="inline-block" color="text.secondary" mr={1}>
        Suggestions
      </Box>
      {unusedSuggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <RecipientSuggestion recipient={suggestion} onSelect={onSelect} />
          <>{index < unusedSuggestions.length - 1 ? ', ' : ''}</>
        </React.Fragment>
      ))}
    </Box>
  ) : null
})
