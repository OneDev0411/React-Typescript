import { useEffect, useState } from 'react'

import { Button, TextField, makeStyles } from '@material-ui/core'

import SuperCampaignTemplatePreview from '@app/components/Pages/Dashboard/SuperCampaigns/components/SuperCampaignTemplate/SuperCampaignTemplatePreview'
import { useEnrollMeInSuperCampaign } from '@app/models/super-campaign'
import OverlayDrawer, { OverlayDrawerProps } from 'components/OverlayDrawer'

import SuperCampaignPreviewDrawerDescription from './SuperCampaignPreviewDrawerDescription'
import SuperCampaignPreviewDrawerFrom from './SuperCampaignPreviewDrawerFrom'
import SuperCampaignPreviewDrawerOptOutButton from './SuperCampaignPreviewDrawerOptOutButton'
import SuperCampaignPreviewDrawerScheduledFor from './SuperCampaignPreviewDrawerScheduledFor'
import SuperCampaignTagsField from './SuperCampaignTagsField'
import { useHandleSuperCampaignOptOutAndCopy } from './use-handle-super-campaign-opt-out-and-copy'
import { useLoadExistingTags } from './use-load-existing-tags'
import { useMarketingEmailTemplateEditor } from './use-marketing-email-template-editor'

const useStyles = makeStyles(
  theme => ({
    wrapper: { margin: theme.spacing(3, 0) },
    description: { marginBottom: theme.spacing(4) },
    tags: { margin: theme.spacing(1, 0) },
    optOutButton: { margin: theme.spacing(0, 1) },
    templatePreview: { margin: theme.spacing(2, 0) },
    overlayDrawerBody: { overflowY: 'scroll' }
  }),
  { name: 'SuperCampaignPreviewDrawer' }
)

export interface SuperCampaignPreviewDrawerProps extends OverlayDrawerProps {
  superCampaign: ISuperCampaign<'template_instance' | 'created_by'>
  hasUnenroll: boolean
  initialSelectedTags: Optional<string[]>
}

const DEFAULT_SELECTED_TAGS: string[] = []

function SuperCampaignPreviewDrawer({
  open,
  onClose,
  superCampaign,
  hasUnenroll,
  initialSelectedTags
}: SuperCampaignPreviewDrawerProps) {
  const classes = useStyles()

  const initialTags =
    initialSelectedTags ?? superCampaign.tags ?? DEFAULT_SELECTED_TAGS

  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)

  useEffect(() => {
    if (!open) {
      setSelectedTags(initialTags)
    }
  }, [open, initialTags])

  // Load existing tags because it is needed by useGetSuperCampaignInitialEmailTo
  useLoadExistingTags()

  const { isLoading: isEnrolling, mutateAsync: enrollToSuperCampaign } =
    useEnrollMeInSuperCampaign(
      hasUnenroll
        ? {
            notify: {
              onSuccess: 'Your enrollment has been updated',
              onError: 'Something went wrong while updating the enrollment'
            }
          }
        : undefined
    )

  const handleCopy = () => {
    openEmailTemplateEditor()
  }

  const closeDrawer = () => {
    onClose({}, 'closeButtonClick')
  }

  const { isDeleting, handleOptOut, handleOptOutAndCopy } =
    useHandleSuperCampaignOptOutAndCopy({
      onOptOut: closeDrawer,
      onOptOutAndCopy: handleCopy
    })

  const handleSave = async () => {
    await enrollToSuperCampaign({
      superCampaignId: superCampaign.id,
      tags: selectedTags
    })
    closeDrawer()
  }

  const isWorking = isEnrolling || isDeleting

  const hasError = selectedTags.length === 0

  const {
    marketingEmailTemplateEditor,
    openEmailTemplateEditor,
    isEmailTemplateEditorOpen
  } = useMarketingEmailTemplateEditor(superCampaign, closeDrawer)

  return (
    <>
      <OverlayDrawer
        open={open && !isEmailTemplateEditorOpen}
        onClose={onClose}
        width="600px"
      >
        <OverlayDrawer.Header
          title="Campaign Preview"
          closeButtonDisabled={isWorking}
        />
        <OverlayDrawer.Body className={classes.overlayDrawerBody}>
          <div className={classes.wrapper}>
            {superCampaign.description && (
              <SuperCampaignPreviewDrawerDescription
                className={classes.description}
                description={superCampaign.description}
              />
            )}
            <SuperCampaignPreviewDrawerFrom />
            <div className={classes.tags}>
              <SuperCampaignTagsField
                value={selectedTags}
                onChange={setSelectedTags}
                disabled={isWorking}
                autoFocus
                error={hasError}
                helperText={
                  hasError ? 'Please select at least a tag' : undefined
                }
              />
            </div>
            <TextField
              label="Email Subject"
              data-test="subject"
              value={superCampaign.subject || 'Untitled Campaign'}
              fullWidth
              margin="normal"
              disabled
            />
            {superCampaign.template_instance && (
              <SuperCampaignTemplatePreview
                className={classes.templatePreview}
                template={superCampaign.template_instance}
                readOnly
              />
            )}
          </div>
        </OverlayDrawer.Body>
        <OverlayDrawer.Footer>
          <SuperCampaignPreviewDrawerScheduledFor time={superCampaign.due_at} />
          <div className={classes.optOutButton}>
            {hasUnenroll && (
              <SuperCampaignPreviewDrawerOptOutButton
                disabled={isWorking}
                onOptOut={() => handleOptOut(superCampaign.id)}
                onOptOutAndCopy={() => handleOptOutAndCopy(superCampaign.id)}
              />
            )}
          </div>
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
      {marketingEmailTemplateEditor}
    </>
  )
}

export default SuperCampaignPreviewDrawer
