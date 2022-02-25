import { makeStyles } from '@material-ui/core'

import { useUpdateSuperCampaign } from '@app/models/super-campaign'

import { isSuperCampaignReadOnly } from '../../helpers'

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
}

function SuperCampaignDetailHeaderSchedule({
  className,
  superCampaign
}: SuperCampaignDetailHeaderScheduleProps) {
  const classes = useStyles()

  const isExecuted = isSuperCampaignReadOnly(superCampaign)

  const { mutate, isLoading } = useUpdateSuperCampaign()

  const handleDueAtChange = (dueAt: number) =>
    mutate({
      superCampaign,
      inputData: { due_at: dueAt }
    })

  const handleDueAtRemove = () =>
    mutate({
      superCampaign,
      inputData: { due_at: null }
    })

  return (
    <>
      <SuperCampaignDetailHeaderScheduleChip
        className={className}
        isExecuted={isExecuted}
        dueAt={superCampaign.due_at}
        isSaving={isLoading}
      >
        {!isExecuted && (
          <div className={classes.actions}>
            <SuperCampaignDueAtChangeButton
              dueAt={superCampaign.due_at}
              isSaving={isLoading}
              onDueAtChange={handleDueAtChange}
            />
            {superCampaign.due_at && (
              <SuperCampaignDueAtRemoveButton
                className={classes.removeButton}
                disabled={isLoading}
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
