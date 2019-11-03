import * as React from 'react'
import { connect } from 'react-redux'
import { Box } from '@material-ui/core'

import { IAppState } from 'reducers'
import { getBrandByType } from 'utils/user-teams'
import { selectDealRoles } from 'reducers/deals/roles'

import { RecipientQuickSuggestion } from '../RecipientQuickSuggestion'
import { recipientToString } from '../helpers/recipient-to-string'
import { areRecipientsEqual } from '../helpers/are-recipients-equal'
import { dealRoleToSuggestion } from '../helpers/deal-role-to-suggestion'
import { QuickSuggestion } from '../types'

interface StateProps {
  user: IUser
  dealRoles: IDealRole[]
}
interface OwnProps extends StateProps {
  deal?: IDeal
  currentRecipients?: IDenormalizedEmailRecipientInput[]
  onSelect: (
    recipient: IDenormalizedEmailRecipientInput,
    sendType?: IEmailRecipientSendType
  ) => void
}
type Props = OwnProps & StateProps

export const RecipientQuickSuggestions = connect<StateProps, OwnProps>(
  ({ user, deals }: IAppState, props: OwnProps) => ({
    user,
    dealRoles: selectDealRoles(deals.roles, props.deal)
  })
)(function RecipientSuggestions({
  user,
  onSelect,
  dealRoles,
  currentRecipients = []
}: Props) {
  const firstValidBrand = getBrandByType(user, 'Brokerage')

  const suggestions: QuickSuggestion[] = [
    ...dealRoles.filter(hasEmail).map(dealRoleToSuggestion),
    {
      recipient: {
        recipient_type: 'AllContacts'
      },
      sendType: 'BCC'
    }
  ]

  if (firstValidBrand) {
    suggestions.push({
      recipient: {
        recipient_type: 'Brand',
        brand: firstValidBrand
      },
      sendType: 'BCC'
    })
  }

  const unusedSuggestions = suggestions.filter(
    suggestion =>
      !currentRecipients.find(areRecipientsEqual(suggestion.recipient))
  )

  return unusedSuggestions.length > 0 ? (
    <Box py={1} flexGrow={0} flexShrink={0} flexBasis="100%" lineHeight={1.5}>
      <Box display="inline-block" color="text.secondary" mr={1}>
        Suggestions
      </Box>
      {unusedSuggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <RecipientQuickSuggestion
            recipient={suggestion.recipient}
            onSelect={() => onSelect(suggestion.recipient, suggestion.sendType)}
          >
            {suggestion.text || recipientToString(suggestion.recipient)}
          </RecipientQuickSuggestion>
          <>{index < unusedSuggestions.length - 1 ? ', ' : ''}</>
        </React.Fragment>
      ))}
    </Box>
  ) : null
})

function hasEmail(dealRole: IDealRole): boolean {
  return !!dealRole.email
}
