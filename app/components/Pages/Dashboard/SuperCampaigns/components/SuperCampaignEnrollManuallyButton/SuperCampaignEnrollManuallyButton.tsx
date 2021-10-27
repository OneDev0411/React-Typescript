import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import useSafeState from '@app/hooks/use-safe-state'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { SuperCampaignEnrollmentInput } from '../../types'

interface SuperCampaignEnrollManuallyButtonProps {
  superCampaignId: UUID
  onEnroll: (data: SuperCampaignEnrollmentInput) => Promise<void>
}

function SuperCampaignEnrollManuallyButton({
  superCampaignId,
  onEnroll
}: SuperCampaignEnrollManuallyButtonProps) {
  const [isSaving, setIsSaving] = useSafeState(false)

  // TODO: Implement the required logic and use this function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEnroll = async (data: SuperCampaignEnrollmentInput) => {
    setIsSaving(true)
    await onEnroll(data)
    setIsSaving(false)
  }

  return (
    <Button
      color="primary"
      startIcon={<SvgIcon path={mdiPlus} size={muiIconSizes.small} />}
      size="small"
      onClick={() => console.log('Not Implemented')}
      disabled={isSaving}
    >
      Enroll Participants Manually
    </Button>
  )
}

export default SuperCampaignEnrollManuallyButton
