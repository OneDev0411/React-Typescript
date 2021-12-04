import { Dispatch, SetStateAction } from 'react'

import { makeStyles } from '@material-ui/core'

import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'
import { useSaveSuperCampaign } from '../../hooks/use-save-super-campaign'

import SuperCampaignDetailHeaderScheduleButton from './SuperCampaignDetailHeaderScheduleButton'
import SuperCampaignDetailHeaderScheduleChip from './SuperCampaignDetailHeaderScheduleChip'

const useStyles = makeStyles(
  theme => ({
    schedule: { marginLeft: theme.spacing(1) }
  }),
  { name: 'SuperCampaignDetailHeaderSchedule' }
)
export interface SuperCampaignDetailHeaderScheduleProps {
  superCampaign: ISuperCampaign<'template_instance'>
  setSuperCampaign: Dispatch<
    SetStateAction<ISuperCampaign<'template_instance'>>
  >
}

function SuperCampaignDetailHeaderSchedule({
  superCampaign,
  setSuperCampaign
}: SuperCampaignDetailHeaderScheduleProps) {
  const classes = useStyles()

  const isExecuted = useIsSuperCampaignReadOnly(superCampaign)

  const { saveSuperCampaign, isSaving } = useSaveSuperCampaign(
    superCampaign,
    setSuperCampaign
  )

  const handleDueAtChange = (dueAt: number) =>
    saveSuperCampaign({ due_at: dueAt })

  return (
    <>
      <SuperCampaignDetailHeaderScheduleChip
        isExecuted={isExecuted}
        dueAt={superCampaign.due_at}
        isSaving={isSaving}
      />
      <SuperCampaignDetailHeaderScheduleButton
        className={classes.schedule}
        isExecuted={isExecuted}
        dueAt={superCampaign.due_at}
        isSaving={isSaving}
        onDueAtChange={handleDueAtChange}
      />
    </>
  )
}

export default SuperCampaignDetailHeaderSchedule
