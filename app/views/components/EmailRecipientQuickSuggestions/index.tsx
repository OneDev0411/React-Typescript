import React, { useContext } from 'react'

import { Box } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { QuickSuggestion } from 'components/EmailRecipientsChipsInput/types'
import { getContactsCount } from 'models/contacts/get-contacts-count'
// import Loading from 'partials/Loading'
import { IAppState } from 'reducers'
import { selectDealRoles } from 'reducers/deals/roles'

import ConfirmationModalContext from '../ConfirmationModal/context'

import { BrandSelector } from './components/BrandSelector'
import RecipientQuickSuggestions from './components/RecipientQuickSuggestions'
import { areRecipientsEqual } from './helpers/are-recipients-equal'
import { dealRoleToSuggestion } from './helpers/deal-role-to-suggestion'

interface Props {
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

export function EmailRecipientQuickSuggestions({
  deal,
  currentRecipients = [],
  onSelect
}: Props) {
  const { dealRoles, contactsInfo } = useSelector<
    IAppState,
    { dealRoles: IDealRole[]; contactsInfo: any }
  >(({ deals: { roles }, contacts }) => ({
    dealRoles: selectDealRoles(roles, deal),
    contactsInfo: contacts.list
  }))

  const confirmationModal = useContext(ConfirmationModalContext)

  const quickSuggestions: QuickSuggestion[] = [
    ...dealRoles.filter(({ email }) => !!email).map(dealRoleToSuggestion),
    {
      recipient: {
        recipient_type: 'AllContacts'
      },
      sendType: 'BCC'
    }
  ]
  const unusedQuickSuggestions = quickSuggestions.filter(
    suggestion =>
      !currentRecipients.find(areRecipientsEqual(suggestion.recipient))
  )
  const showQuickSuggestions = unusedQuickSuggestions.length > 0

  const handleSelectSuggestion = async (recipient, sendType) => {
    const isSendingToAllContacts = recipient?.recipient_type === 'AllContacts'

    if (isSendingToAllContacts) {
      let allContactsCount = contactsInfo.info?.total ?? 0
      let hasFilter =
        (contactsInfo.info?.filter || []).length > 0 ||
        contactsInfo.info?.searchInputValue

      if (hasFilter || allContactsCount === 0) {
        allContactsCount = await getContactsCount([], false)
      }

      if (allContactsCount > 1) {
        return confirmationModal.setConfirmationModal({
          message: 'Send to all your contacts?',
          // eslint-disable-next-line max-len
          description: `You are about to send this email to ${allContactsCount} of your contacts. Are you sure?`,
          cancelLabel: 'No',
          confirmLabel: `Yes, add all my ${allContactsCount} contacts as recipients`,
          onConfirm: () => {
            onSelect(recipient, sendType)
          }
        })
      }
    }

    onSelect(recipient, sendType)
  }

  if (!showQuickSuggestions) {
    return null
  }

  return (
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

      <RecipientQuickSuggestions
        quickSuggestions={unusedQuickSuggestions}
        onSelect={({ recipient, sendType }) =>
          handleSelectSuggestion(recipient, sendType)
        }
      />

      <Box ml={1} display="inline-block">
        <BrandSelector />
      </Box>
    </Box>
  )
}
