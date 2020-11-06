import { useCallback, useEffect, useReducer } from 'react'

import { getEmailCampaigns } from 'models/email/get-email-campaigns'
import { getEmailCampaign } from 'models/email/get-email-campaign'

import { InsightActionType, InsightFilterType, InsightState } from './types'
import { useInsightStateReducer, initialState } from './useInsightStateReducer'

export default function useListData(
  user: IUser,
  filterType: InsightFilterType
): InsightState & {
  reloadList: () => Promise<void>
  reloadItem: (emailCampaignId: UUID) => Promise<void>
} {
  const [state, dispatch] = useReducer(useInsightStateReducer, initialState)

  const reloadList = useCallback<
    ReturnType<typeof useListData>['reloadList']
  >(async () => {
    dispatch({
      type: InsightActionType.FetchListRequest
    })

    try {
      const allEmailCampaigns = await getEmailCampaigns(user, {
        emailCampaignAssociations: ['recipients', 'template'],
        emailRecipientsAssociations: ['list'],
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
  }, [user, filterType])

  const reloadItem = useCallback<ReturnType<typeof useListData>['reloadItem']>(
    async emailCampaignId => {
      dispatch({
        type: InsightActionType.FetchItemRequest
      })

      try {
        const emailCampaign = await getEmailCampaign(emailCampaignId, {
          emailCampaignAssociations: ['recipients', 'template'],
          emailRecipientsAssociations: ['list'],
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
  }, [user, filterType, reloadList])

  return {
    ...state,
    reloadList,
    reloadItem
  }
}
