import { useEffect, useState } from 'react'

import { Box, Button, TextField } from '@material-ui/core'

import SuperCampaignTemplatePreview from '@app/components/Pages/Dashboard/SuperCampaigns/components/SuperCampaignTemplate/SuperCampaignTemplatePreview'
import { useUnenrollMeFromSuperCampaign } from '@app/hooks/use-unenroll-me-from-super-campaign'
import OverlayDrawer, { OverlayDrawerProps } from 'components/OverlayDrawer'

import SuperCampaignPreviewDrawerFrom from './SuperCampaignPreviewDrawerFrom'
import SuperCampaignPreviewDrawerOptOutButton from './SuperCampaignPreviewDrawerOptOutButton'
import SuperCampaignPreviewDrawerScheduledFor from './SuperCampaignPreviewDrawerScheduledFor'
import SuperCampaignTagsField from './SuperCampaignTagsField'
import { useUpdateMySuperCampaignEnrollment } from './use-update-my-super-campaign-enrollment'

export interface SuperCampaignPreviewDrawerProps extends OverlayDrawerProps {
  superCampaign: ISuperCampaign<'template_instance_and_created_by'>
  onEnroll: (enrollment: ISuperCampaignEnrollment) => void
  onUnenroll: () => void
  hasUnenroll: boolean
  initialSelectedTags?: string[]
}

const DEFAULT_SELECTED_TAGS: string[] = []

function SuperCampaignPreviewDrawer({
  open,
  onClose,
  superCampaign,
  onEnroll,
  onUnenroll,
  hasUnenroll,
  initialSelectedTags
}: SuperCampaignPreviewDrawerProps) {
  const initialTags =
    initialSelectedTags ?? superCampaign.tags ?? DEFAULT_SELECTED_TAGS

  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)

  useEffect(() => {
    if (!open) {
      setSelectedTags(initialTags)
    }
  }, [open, initialTags])

  const { isUpdating, updateMySuperCampaignEnrollment } =
    useUpdateMySuperCampaignEnrollment(superCampaign.id, onEnroll)

  const { isDeleting, unenrollMeFromSuperCampaign } =
    useUnenrollMeFromSuperCampaign(superCampaign.id, onUnenroll)

  const handleSave = async () => {
    await updateMySuperCampaignEnrollment(selectedTags)
    onClose({}, 'closeButtonClick')
  }

  const handleOptOut = async () => {
    await unenrollMeFromSuperCampaign()
    onClose({}, 'closeButtonClick')
  }

  const isWorking = isUpdating || isDeleting

  const hasError = selectedTags.length === 0

  return (
    <OverlayDrawer open={open} onClose={onClose} width="600px">
      <OverlayDrawer.Header
        title="Campaign Preview"
        closeButtonDisabled={isWorking}
      />
      <OverlayDrawer.Body>
        <Box my={3}>
          <SuperCampaignPreviewDrawerFrom />
          <Box my={1}>
            <SuperCampaignTagsField
              value={selectedTags}
              onChange={setSelectedTags}
              disabled={isWorking}
              autoFocus
              error={hasError}
              helperText={hasError ? 'Please select at least a tag' : undefined}
            />
          </Box>
          <TextField
            label="Email Subject"
            data-test="subject"
            value={superCampaign.subject || 'Untitled Campaign'}
            fullWidth
            margin="normal"
            disabled
          />
          {superCampaign.description && (
            <TextField
              label="Campaign Description"
              data-test="description"
              multiline
              value={superCampaign.description}
              fullWidth
              margin="normal"
              disabled
            />
          )}
          <Box my={2}>
            {superCampaign.template_instance && (
              <SuperCampaignTemplatePreview
                template={superCampaign.template_instance}
                readOnly
              />
            )}
          </Box>
        </Box>
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer>
        <SuperCampaignPreviewDrawerScheduledFor time={superCampaign.due_at} />
        <Box mx={1}>
          {hasUnenroll && (
            <SuperCampaignPreviewDrawerOptOutButton
              disabled={isWorking}
              onClick={handleOptOut}
            />
          )}
        </Box>
        <Button
          disabled={isWorking || hasError}
          color="primary"
          variant="contained"
          onClick={handleSave}
        >
          Save
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}

export default SuperCampaignPreviewDrawer
