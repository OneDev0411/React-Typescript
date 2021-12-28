import { Dispatch, SetStateAction } from 'react'

import { isSuperCampaignReadOnly } from '../../helpers'
import { useSaveSuperCampaign } from '../../hooks/use-save-super-campaign'

import SuperCampaignDetailHeaderScheduleButton from './SuperCampaignDetailHeaderScheduleButton'
import SuperCampaignDetailHeaderScheduleChip from './SuperCampaignDetailHeaderScheduleChip'

export interface SuperCampaignDetailHeaderScheduleProps {
  className: string
  superCampaign: ISuperCampaign<'template_instance'>
  setSuperCampaign: Dispatch<
    SetStateAction<ISuperCampaign<'template_instance'>>
  >
}

function SuperCampaignDetailHeaderSchedule({
  className,
  superCampaign,
  setSuperCampaign
}: SuperCampaignDetailHeaderScheduleProps) {
  const isExecuted = isSuperCampaignReadOnly(superCampaign)

  const { saveSuperCampaign, isSaving } = useSaveSuperCampaign(
    superCampaign,
    setSuperCampaign
  )

  const handleDueAtChange = (dueAt: number) =>
    saveSuperCampaign({ due_at: dueAt })

  return (
    <>
      <SuperCampaignDetailHeaderScheduleChip
        className={className}
        isExecuted={isExecuted}
        dueAt={superCampaign.due_at}
        isSaving={isSaving}
      />
      <SuperCampaignDetailHeaderScheduleButton
        className={className}
        isExecuted={isExecuted}
        dueAt={superCampaign.due_at}
        isSaving={isSaving}
        onDueAtChange={handleDueAtChange}
      />
    </>
  )
}

export default SuperCampaignDetailHeaderSchedule
