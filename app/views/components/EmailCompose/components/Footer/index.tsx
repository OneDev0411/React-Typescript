import React, { useState } from 'react'
import { useFormState, useField } from 'react-final-form'
import { IconButton } from '@material-ui/core'
import { mdiLayersOutline, mdiTrashCanOutline } from '@mdi/js'

import ActionButton from 'components/Button/ActionButton'
import DateTimePicker from 'components/DateTimePicker/next'
import { formatDate } from 'components/DateTimePicker/helpers'
import { uploadEmailAttachment } from 'models/email/upload-email-attachment'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { myDesignIcon } from 'components/SvgIcons/icons'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { isFileAttachment } from '../../helpers/is-file-attachment'
import { FooterContainer, FooterInnerContainer } from './styled'
import { textForSubmitButton } from './helpers'
import SchedulerButton from './SchedulerButton'
import { EmailAttachmentsDropdown } from '../EmailAttachmentsDropdown'
import { useButtonStyles } from '../../../../../styles/use-button-styles'
import { DropdownToggleButton } from '../../../DropdownToggleButton'
import { FooterBottomDrawer } from './FooterBottomDrawer'
import EmailTemplateSelector from './EmailTemplateSelector'
import { MarketingTemplateSelector } from './MarketingTemplateSelector'

interface Props {
  isSubmitDisabled: boolean
  deal?: IDeal
  onChanged: () => void
  hasStaticBody?: boolean
  updateBody: (body: string) => void
  setMarketingTemplate: (template: IBrandEmailTemplate | null) => void
  onCancel?: () => void
  onDelete?: (values) => void | Promise<any>
  onClickAddDealAttachments?: () => void
  className?: string
  uploadAttachment: typeof uploadEmailAttachment
}

export function Footer({
  onDelete,
  updateBody,
  setMarketingTemplate,
  hasStaticBody,
  onClickAddDealAttachments = () => {},
  ...props
}: Props) {
  const formState = useFormState()
  const dueAtField = useField('due_at')
  const subjectField = useField('subject')

  const dueAt = dueAtField.input.value
  const isScheduled = !!dueAt

  const buttonClasses = useButtonStyles()
  const [isDeleting, setDeleting] = useState(false)
  const [isEmailTemplateDrawerOpen, setEmailTemplateDrawerOpen] = useState(
    false
  )
  const [isMCTemplateDrawerOpen, setMCTemplateDrawerOpen] = useState(false)

  const busy = isDeleting || formState.submitting

  const initialAttachments: IFile[] = (
    formState.initialValues.attachments || []
  ).filter(isFileAttachment)

  const selectEmailTemplate = (template: IBrandEmailTemplate) => {
    setEmailTemplateDrawerOpen(false)
    setMarketingTemplate(null)
    subjectField.input.onChange(template.subject)
    updateBody(template.body)
  }
  const selectMarketingTemplate = (template: IMarketingTemplateInstance) => {
    setMCTemplateDrawerOpen(false)
    setMarketingTemplate(template)
  }

  return (
    <FooterContainer>
      <FooterBottomDrawer
        isOpen={isEmailTemplateDrawerOpen || isMCTemplateDrawerOpen}
      >
        {isEmailTemplateDrawerOpen && (
          <EmailTemplateSelector onTemplateSelected={selectEmailTemplate} />
        )}
        {isMCTemplateDrawerOpen && (
          <MarketingTemplateSelector
            onTemplateSelected={selectMarketingTemplate}
          />
        )}
      </FooterBottomDrawer>
      <FooterInnerContainer className={props.className}>
        <div className="features-list">
          <EmailAttachmentsDropdown
            deal={props.deal}
            onChanged={props.onChanged}
            uploadAttachment={props.uploadAttachment}
            initialAttachments={initialAttachments}
            onClickAddDealAttachments={onClickAddDealAttachments}
          />
          {!hasStaticBody && (
            <DropdownToggleButton
              isActive={isEmailTemplateDrawerOpen}
              onClick={() => {
                setEmailTemplateDrawerOpen(open => !open)
                setMCTemplateDrawerOpen(open => false)
              }}
            >
              <SvgIcon path={mdiLayersOutline} rightMargined />
              <span>Templates</span>
            </DropdownToggleButton>
          )}
          {!hasStaticBody && (
            <DropdownToggleButton
              isActive={isMCTemplateDrawerOpen}
              onClick={() => {
                setMCTemplateDrawerOpen(open => !open)
                setEmailTemplateDrawerOpen(open => false)
              }}
            >
              <SvgIcon
                path={myDesignIcon}
                rightMargined
                size={muiIconSizes.small}
              />
              <span>My Designs</span>
            </DropdownToggleButton>
          )}
        </div>

        <div className="action-bar">
          {isScheduled && (
            <span className="scheduled-on">Send on {formatDate(dueAt)}</span>
          )}
          {props.onCancel && (
            <ActionButton
              appearance="flat"
              onClick={props.onCancel}
              disabled={busy}
            >
              Cancel
            </ActionButton>
          )}
          <ActionButton
            appearance="secondary"
            data-test="compose-send-email"
            type="submit"
            disabled={busy || props.isSubmitDisabled}
            leftRounded
          >
            {textForSubmitButton({
              isSubmitting: formState.submitting,
              isDateSet: isScheduled
            })}
          </ActionButton>
          <DateTimePicker
            popUpButton={buttonProps => (
              <SchedulerButton
                onOpen={buttonProps.toggleOpen}
                isScheduled={isScheduled}
              />
            )}
            disabledDays={{
              before: new Date()
            }}
            popUpPosition="top-right"
            saveButtonText="Schedule"
            initialSelectedDate={dueAt}
            onDone={dueAtField.input.onChange}
          />

          {onDelete && (
            <IconButton
              onClick={async () => {
                setDeleting(true)

                try {
                  await onDelete(formState.values)
                } finally {
                  setDeleting(false)
                }
              }}
              disabled={busy}
              className={buttonClasses.danger}
            >
              <SvgIcon path={mdiTrashCanOutline} />
            </IconButton>
          )}
        </div>
      </FooterInnerContainer>
    </FooterContainer>
  )
}
