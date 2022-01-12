import { Dispatch, SetStateAction } from 'react'

import { makeStyles } from '@material-ui/core'

import { isSuperCampaignReadOnly } from '../../helpers'
import { useSaveSuperCampaign } from '../../hooks/use-save-super-campaign'

import SuperCampaignDetailHeaderScheduleChip from './SuperCampaignDetailHeaderScheduleChip'
import SuperCampaignDueAtChangeButton from './SuperCampaignDueAtChangeButton'
import SuperCampaignDueAtRemoveButton from './SuperCampaignDueAtRemoveButton'

const useStyles = makeStyles(
  theme => ({
    actions: {
      display: 'inline-flex',
      alignItems: 'center',
      marginLeft: theme.spacing(3)
    },
    removeButton: { marginLeft: theme.spacing(1) }
  }),
  { name: 'SuperCampaignDetailHeaderSchedule' }
)

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
  const classes = useStyles()

  const isExecuted = isSuperCampaignReadOnly(superCampaign)

  const { saveSuperCampaign, isSaving } = useSaveSuperCampaign(
    superCampaign,
    setSuperCampaign
  )

  const handleDueAtChange = (dueAt: number) =>
    saveSuperCampaign({ due_at: dueAt })

  const handleDueAtRemove = () => saveSuperCampaign({ due_at: undefined })

  return (
    <>
      <SuperCampaignDetailHeaderScheduleChip
        className={className}
        isExecuted={isExecuted}
        dueAt={superCampaign.due_at}
        isSaving={isSaving}
      >
        {!isExecuted && (
          <div className={classes.actions}>
            <SuperCampaignDueAtChangeButton
              dueAt={superCampaign.due_at}
              isSaving={isSaving}
              onDueAtChange={handleDueAtChange}
            />
            {superCampaign.due_at && (
              <SuperCampaignDueAtRemoveButton
                className={classes.removeButton}
                disabled={isSaving}
                onClick={handleDueAtRemove}
              />
            )}
          </div>
        )}
      </SuperCampaignDetailHeaderScheduleChip>
    </>
  )
}

export default SuperCampaignDetailHeaderSchedule
