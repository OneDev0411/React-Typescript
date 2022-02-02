import { useSelector } from 'react-redux'

import { selectUserId } from '@app/selectors/user'

import SuperCampaignListColumnBase from './SuperCampaignListColumnBase'

interface SuperCampaignAgentListColumnCreatedByProps {
  user: IUser
}

function SuperCampaignAgentListColumnCreatedBy({
  user
}: SuperCampaignAgentListColumnCreatedByProps) {
  const currentUserId = useSelector(selectUserId)

  return (
    <SuperCampaignListColumnBase label="Created by">
      {user.id === currentUserId ? 'You' : user.display_name}
    </SuperCampaignListColumnBase>
  )
}

export default SuperCampaignAgentListColumnCreatedBy
