import * as React from 'react'
import { connect } from 'react-redux'
import { Box } from '@material-ui/core'

import { IAppState } from 'reducers'
import { getBrandByType } from 'utils/user-teams'
import { selectDealRoles } from 'reducers/deals/roles'

import { RecipientQuickSuggestion } from './RecipientQuickSuggestion'
import { recipientToString } from '../EmailRecipientsChipsInput/helpers/recipient-to-string'
import { areRecipientsEqual } from './helpers/are-recipients-equal'
import { dealRoleToSuggestion } from './helpers/deal-role-to-suggestion'
import { QuickSuggestion } from '../EmailRecipientsChipsInput/types'

interface StateProps {
  user: IUser
  dealRoles: IDealRole[]
}
interface OwnProps {
  deal?: IDeal
  currentRecipients?: IDenormalizedEmailRecipientInput[]
  /**
   * Callback to be called when a quick suggestion in selected.
   * The selected suggestion may have a forced
   * {@link IEmailRecipientSendType send type}. Right now the type is
   * forced to `Bcc` for some suggestions like "All contacts" and "All Agents"
   * @param recipient: the recipient associated with this quick suggestion
   * @param sendType: the {@link IEmailRecipientSendType send type} associated
   * with this suggestion. It can be undefined and in this case, the recipient
   * is to be added to the currently (or lastly) focused input.
   */
  onSelect: (
    recipient: IDenormalizedEmailRecipientInput,
    sendType: IEmailRecipientSendType | undefined
  ) => void
}
type Props = OwnProps & StateProps

export const EmailRecipientQuickSuggestions = connect<StateProps, OwnProps>(
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
    <Box
      pb={1}
      pt={0.5}
      flexGrow={0}
      flexShrink={0}
      flexBasis="100%"
      lineHeight={1.5}
    >
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
