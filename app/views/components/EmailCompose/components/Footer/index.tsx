import React, { useState } from 'react'
import { useFormState, useField /* , Field */ } from 'react-final-form'
import {
  IconButton,
  Theme,
  Typography
  // List,
  // ListItem
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import {
  mdiLayersOutline,
  mdiTrashCanOutline /* , mdiDotsVertical */
} from '@mdi/js'
import classNames from 'classnames'

import ActionButton from 'components/Button/ActionButton'
import DateTimePicker from 'components/DateTimePicker/next'
import { formatDate } from 'components/DateTimePicker/helpers'
import {
  uploadEmailAttachment,
  UploadOrigin
} from 'models/email/upload-email-attachment'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { myDesignIcon } from 'components/SvgIcons/icons'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
// import { BaseDropdown } from 'components/BaseDropdown'
// import EmailNotificationSetting from 'components/EmailNotificationSetting'

import { isFileAttachment } from '../../helpers/is-file-attachment'
import { textForSubmitButton } from './helpers'
import SchedulerButton from './SchedulerButton'
import { EmailAttachmentsDropdown } from '../EmailAttachmentsDropdown'
import { useButtonStyles } from '../../../../../styles/use-button-styles'
import { DropdownToggleButton } from '../../../DropdownToggleButton'
import { FooterBottomDrawer } from './FooterBottomDrawer'
import EmailTemplateSelector from './EmailTemplateSelector'
import { MarketingTemplateSelector } from './MarketingTemplateSelector'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative'
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 2, // To be shown over the drawer when it's animating in
    flex: '0 0 auto'
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    flex: '0 0 auto'
  },
  info: {
    lineHeight: `${theme.spacing(3)}px`,
    textAlign: 'center',
    backgroundColor: theme.palette.info.ultralight,
    color: theme.palette.info.main
  },
  featureList: {
    display: 'flex',
    flexWrap: 'nowrap'
  },
  actionBar: {
    display: 'flex',
    alignItems: 'center',
    '& button': {
      marginLeft: 2
    }
  }
}))

interface Props {
  className?: string
  uploadOrigin: UploadOrigin
  isSubmitDisabled: boolean
  deal?: IDeal
  hasStaticBody?: boolean
  disableMarketingTemplates?: boolean
  uploadAttachment: typeof uploadEmailAttachment
  updateBody: (body: string) => void
  setMarketingTemplate: (template: IMarketingTemplateInstance | null) => void
  onChanged: () => void
  onCancel?: () => void
  onDelete?: (values) => void | Promise<any>
  onClickAddDealAttachments?: () => void
}

export function Footer({
  className,
  uploadOrigin,
  isSubmitDisabled,
  deal,
  hasStaticBody,
  disableMarketingTemplates = false,
  uploadAttachment,
  updateBody,
  setMarketingTemplate,
  onChanged,
  onCancel,
  onDelete,
  onClickAddDealAttachments = () => {}
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
  const [isMcTemplateDrawerOpen, setMcTemplateDrawerOpen] = useState(false)

  const busy = isDeleting || formState.submitting

  const classes = useStyles()

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
    setMcTemplateDrawerOpen(false)
    setMarketingTemplate(template)
  }

  return (
    <div className={classes.root}>
      <FooterBottomDrawer
        isOpen={isEmailTemplateDrawerOpen || isMcTemplateDrawerOpen}
      >
        {isEmailTemplateDrawerOpen && (
          <EmailTemplateSelector onTemplateSelected={selectEmailTemplate} />
        )}
        {isMcTemplateDrawerOpen && !disableMarketingTemplates && (
          <MarketingTemplateSelector
            onTemplateSelected={selectMarketingTemplate}
          />
        )}
      </FooterBottomDrawer>

      <div className={classNames(classes.container, className)}>
        <div className={classes.main}>
          <div className={classes.featureList}>
            <EmailAttachmentsDropdown
              deal={deal}
              onChanged={onChanged}
              uploadAttachment={uploadAttachment}
              uploadOrigin={uploadOrigin}
              initialAttachments={initialAttachments}
              onClickAddDealAttachments={onClickAddDealAttachments}
            />
            {!hasStaticBody && (
              <DropdownToggleButton
                isActive={isEmailTemplateDrawerOpen}
                onClick={() => {
                  setEmailTemplateDrawerOpen(open => !open)
                  setMcTemplateDrawerOpen(false)
                }}
              >
                <SvgIcon path={mdiLayersOutline} rightMargined />
                <span>Templates</span>
              </DropdownToggleButton>
            )}
            {!hasStaticBody && !disableMarketingTemplates && (
              <DropdownToggleButton
                isActive={isMcTemplateDrawerOpen}
                onClick={() => {
                  setMcTemplateDrawerOpen(open => !open)
                  setEmailTemplateDrawerOpen(false)
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
            {/* <BaseDropdown
              renderDropdownButton={buttonProps => (
                <DropdownToggleButton {...buttonProps}>
                  <SvgIcon path={mdiDotsVertical} rightMargined />
                  <Typography variant="body2">More</Typography>
                </DropdownToggleButton>
              )}
              PopperProps={{ keepMounted: true }}
              renderMenu={({ close }) => (
                <List>
                  <ListItem button>
                    <Field
                      name="notifications_enabled"
                      render={({ input }) => (
                        <EmailNotificationSetting
                          checked={input.value}
                          onChange={input.onChange}
                        />
                      )}
                    />
                  </ListItem>
                </List>
              )}
            /> */}
          </div>

          <div className={classes.actionBar}>
            {onCancel && (
              <ActionButton
                appearance="flat"
                onClick={onCancel}
                disabled={busy}
              >
                Cancel
              </ActionButton>
            )}
            <ActionButton
              appearance="secondary"
              data-test="compose-send-email"
              type="submit"
              disabled={busy || isSubmitDisabled}
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
        </div>

        {isScheduled && (
          <Typography variant="caption" className={classes.info}>
            Scheduled to send on <strong>{formatDate(dueAt)}</strong>
          </Typography>
        )}
      </div>
    </div>
  )
}
