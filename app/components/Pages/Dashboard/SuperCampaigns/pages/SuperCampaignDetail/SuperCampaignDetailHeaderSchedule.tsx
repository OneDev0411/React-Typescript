import { Dispatch, SetStateAction } from 'react'

import { Button, makeStyles } from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { isSuperCampaignReadOnly } from '../../helpers'
import { useSaveSuperCampaign } from '../../hooks/use-save-super-campaign'

import SuperCampaignDetailHeaderScheduleButton from './SuperCampaignDetailHeaderScheduleButton'
import SuperCampaignDetailHeaderScheduleChip from './SuperCampaignDetailHeaderScheduleChip'

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
            <SuperCampaignDetailHeaderScheduleButton
              dueAt={superCampaign.due_at}
              isSaving={isSaving}
              onDueAtChange={handleDueAtChange}
            />
            {superCampaign.due_at && (
              <Button
                className={classes.removeButton}
                color="secondary"
                size="small"
                startIcon={
                  <SvgIcon path={mdiClose} size={muiIconSizes.small} />
                }
                disabled={isSaving}
                onClick={handleDueAtRemove}
              >
                Remove
              </Button>
            )}
          </div>
        )}
      </SuperCampaignDetailHeaderScheduleChip>
    </>
  )
}

export default SuperCampaignDetailHeaderSchedule
