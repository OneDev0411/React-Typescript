import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, List, ListItem, ListItemText } from '@material-ui/core'
import { addNotification } from 'reapop'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { IAppState } from 'reducers'
import { selectDealRoles } from 'reducers/deals/roles'

import { getRootBrand } from 'utils/user-teams'
import { getBrands } from 'models/BrandConsole/Brands'

import Loading from 'partials/Loading'
import { QuickSuggestion } from 'components/EmailRecipientsChipsInput/types'
import { BaseDropdown } from 'components/BaseDropdown'

import { areRecipientsEqual } from './helpers/are-recipients-equal'
import { dealRoleToSuggestion } from './helpers/deal-role-to-suggestion'
import extractMoreQuickSuggestions, {
  MoreQuickSuggestion
} from './helpers/extract-more-quick-suggestions'
import RecipientQuickSuggestions from './components/RecipientQuickSuggestions'

interface StateProps {
  user: IUser
  dealRoles: IDealRole[]
}
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
  const user = useSelector<IAppState, IUser>(({ user }) => user)
  const dealRoles = useSelector<IAppState, IDealRole[]>(
    ({ deals: { roles } }) => selectDealRoles(roles, deal)
  )

  const [brandTreeStatus, setBrandTreeStatus] = useState<
    'empty' | 'fetching' | 'error' | 'fetched'
  >('empty')
  const [brandTree, setBrandTree] = useState<IBrand | null>(null)

  const dispatch = useDispatch()

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

  useEffectOnce(() => {
    fetchBrandTree()
  })

  async function fetchBrandTree() {
    const rootBrand = getRootBrand(user)

    if (!rootBrand) {
      return
    }

    setBrandTreeStatus('fetching')

    try {
      const { data: brandTree } = await getBrands(rootBrand.id, true)

      setBrandTree(brandTree)
      setBrandTreeStatus('fetched')
    } catch (reason) {
      console.error(reason)
      dispatch(
        addNotification({
          status: 'error',
          message: 'Something went wrong when fetching offices information.'
        })
      )
      setBrandTreeStatus('error')
    }
  }

  const visibleMoreQuickSuggestions = useMemo<MoreQuickSuggestion[] | null>(
    () =>
      brandTreeStatus === 'fetched'
        ? extractMoreQuickSuggestions(brandTree!, currentRecipients).filter(
            ({ visible }) => visible
          )
        : null,
    [brandTreeStatus, brandTree, currentRecipients]
  )
  const showMoreQuickSuggestions =
    brandTreeStatus === 'fetching' ||
    brandTreeStatus === 'error' ||
    (visibleMoreQuickSuggestions && visibleMoreQuickSuggestions.length > 0)

  if (!showQuickSuggestions && !showMoreQuickSuggestions) {
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
        onSelect={({ recipient, sendType }) => onSelect(recipient, sendType)}
      />

      {showQuickSuggestions && showMoreQuickSuggestions && ','}

      {showMoreQuickSuggestions && (
        <BaseDropdown
          buttonLabel="More"
          PopperProps={{ keepMounted: true }}
          renderMenu={({ close }) => {
            if (brandTreeStatus === 'error') {
              return (
                <List>
                  <ListItem button>
                    <Box width="8em">
                      <ListItemText
                        primary="No Offices"
                        secondary="Click to retry"
                        secondaryTypographyProps={{ color: 'primary' }}
                        onClick={() => fetchBrandTree()}
                      />
                    </Box>
                  </ListItem>
                </List>
              )
            }

            if (
              brandTreeStatus === 'fetching' ||
              !visibleMoreQuickSuggestions
            ) {
              return (
                <List>
                  <ListItem disabled>
                    <Box width="8em">
                      <Loading />
                    </Box>
                  </ListItem>
                </List>
              )
            }

            return (
              <List>
                {visibleMoreQuickSuggestions.map(
                  (
                    { quickSuggestion: { recipient, text, sendType }, enabled },
                    index
                  ) => (
                    <ListItem
                      key={index}
                      button
                      disabled={!enabled}
                      onClick={() => {
                        onSelect(recipient, sendType)
                        close()
                      }}
                    >
                      <ListItemText
                        primary={
                          text ||
                          (recipient as IDenormalizedEmailRecipientBrandInput).brand.name.trim()
                        }
                      />
                    </ListItem>
                  )
                )}
              </List>
            )
          }}
        />
      )}
    </Box>
  )
}
