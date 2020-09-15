import { useEffect } from 'react'

import getCampaings from 'models/insights/emails/get-all-campaigns'
import { getEmailCampaign } from 'models/email/get-email-campaign'

import { InsightActionType, InsightFilterType, InsightState } from './types'
import { useInsightStateReducer } from './useInsightStateReducer'

export default function useListData(
  user: IUser,
  filterType: InsightFilterType
): InsightState & {
  reloadList: () => Promise<void>
  reloadItem: (emailCampaignId: UUID) => Promise<void>
} {
  const [state, dispatch] = useInsightStateReducer()

  const reloadList: ReturnType<typeof useListData>['reloadList'] = async () => {
    dispatch({
      type: InsightActionType.FetchListRequest
    })

    try {
      const allEmailCampaigns = await getCampaings(user)

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
  }

  const reloadItem: ReturnType<
    typeof useListData
  >['reloadItem'] = async emailCampaignId => {
    dispatch({
      type: InsightActionType.FetchItemRequest
    })

    try {
      const emailCampaign = await getEmailCampaign(emailCampaignId, {
        emailCampaignAssociations: [],
        emailCampaignEmailsAssociation: [],
        emailRecipientsAssociations: [],
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
  }

  useEffect(() => {
    reloadList()
  }, [user, filterType])

  return {
    ...state,
    reloadList,
    reloadItem
  }
}
