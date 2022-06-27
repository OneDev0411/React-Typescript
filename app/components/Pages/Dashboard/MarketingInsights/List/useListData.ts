import { useCallback, useEffect, useReducer } from 'react'

import { useUnsafeActiveBrandId } from '@app/hooks/brand/use-unsafe-active-brand-id'
import { getEmailCampaign } from 'models/email/get-email-campaign'
import { getEmailCampaigns } from 'models/email/get-email-campaigns'

import { InsightActionType, InsightFilterType, InsightState } from './types'
import { useInsightStateReducer, initialState } from './useInsightStateReducer'

export default function useListData(
  filterType: InsightFilterType
): InsightState & {
  reloadList: () => Promise<void>
  reloadItem: (emailCampaignId: UUID) => Promise<void>
} {
  const activeBrandId = useUnsafeActiveBrandId()
  const [state, dispatch] = useReducer(useInsightStateReducer, initialState)

  const reloadList = useCallback<
    ReturnType<typeof useListData>['reloadList']
  >(async () => {
    dispatch({
      type: InsightActionType.FetchListRequest
    })

    try {
      const allEmailCampaigns = await getEmailCampaigns(activeBrandId, {
        emailCampaignAssociations: ['template'],
        emailRecipientsAssociations: [],
        emailCampaignEmailsAssociation: []
      })

      dispatch({
        type: InsightActionType.FetchListSuccess,
        allEmailCampaigns,
        filterType
      })
    } catch (error) {
      console.error(error)
      dispatch({
        type: InsightActionType.FetchListFailure
      })
    }
  }, [activeBrandId, filterType])

  const reloadItem = useCallback<ReturnType<typeof useListData>['reloadItem']>(
    async emailCampaignId => {
      dispatch({
        type: InsightActionType.FetchItemRequest
      })

      try {
        const emailCampaign = await getEmailCampaign(emailCampaignId, {
          emailCampaignAssociations: ['template'],
          emailRecipientsAssociations: [],
          emailCampaignEmailsAssociation: [],
          emailFields: []
        })

        dispatch({
          type: InsightActionType.FetchItemSuccess,
          emailCampaign
        })
      } catch (error) {
        console.error(error)
        dispatch({
          type: InsightActionType.FetchItemFailure
        })
      }
    },
    []
  )

  useEffect(() => {
    reloadList()
  }, [activeBrandId, filterType, reloadList])

  return {
    ...state,
    reloadList,
    reloadItem
  }
}
