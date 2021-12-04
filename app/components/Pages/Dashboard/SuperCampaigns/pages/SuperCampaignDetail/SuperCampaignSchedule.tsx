import { Dispatch, SetStateAction } from 'react'

import { makeStyles } from '@material-ui/core'

import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'
import { useSaveSuperCampaign } from '../../hooks/use-save-super-campaign'

import SuperCampaignScheduleButton from './SuperCampaignScheduleButton'
import SuperCampaignScheduleChip from './SuperCampaignScheduleChip'

const useStyles = makeStyles(
  theme => ({
    schedule: { marginLeft: theme.spacing(1) }
  }),
  { name: 'SuperCampaignSchedule' }
)
export interface SuperCampaignScheduleProps {
  superCampaign: ISuperCampaign<'template_instance'>
  setSuperCampaign: Dispatch<
    SetStateAction<ISuperCampaign<'template_instance'>>
  >
}

function SuperCampaignSchedule({
  superCampaign,
  setSuperCampaign
}: SuperCampaignScheduleProps) {
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
      <SuperCampaignScheduleChip
        isExecuted={isExecuted}
        dueAt={superCampaign.due_at}
        isSaving={isSaving}
      />
      <SuperCampaignScheduleButton
        className={classes.schedule}
        isExecuted={isExecuted}
        dueAt={superCampaign.due_at}
        isSaving={isSaving}
        onDueAtChange={handleDueAtChange}
      />
    </>
  )
}

export default SuperCampaignSchedule
