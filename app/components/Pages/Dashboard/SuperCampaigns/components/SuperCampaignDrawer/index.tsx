import { useRef, useState } from 'react'

import { Box, Button, makeStyles, TextField } from '@material-ui/core'
import { mdiCalendarBlank } from '@mdi/js'
import { Form, Field } from 'react-final-form'

import {
  DateTimeField,
  FormTextField
} from '@app/views/components/final-form-fields'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import OverlayDrawer from 'components/OverlayDrawer'

import SuperCampaignTemplate from '../SuperCampaignTemplate'

import { convertDateToTimestamp, convertTimestampToDate } from './helpers'
import {
  SuperCampaignFormInternalValues,
  SuperCampaignFormValues
} from './types'

const useStyles = makeStyles(
  theme => ({
    templateTitle: { marginBottom: theme.spacing(0.5) },
    description: { minHeight: theme.spacing(11) },
    template: { marginTop: theme.spacing(3) }
  }),
  { name: 'SuperCampaignDrawer' }
)

interface SuperCampaignDrawerProps {
  isOpen: boolean
  onClose: () => void
  formInitialValues: SuperCampaignFormValues
  onConfirm: (formValues: SuperCampaignFormValues) => Promise<void>
  actionButtonsDisabled?: boolean
}

function SuperCampaignDrawer({
  isOpen,
  onClose,
  formInitialValues,
  onConfirm,
  actionButtonsDisabled
}: SuperCampaignDrawerProps) {
  const classes = useStyles()
  const formRef = useRef<HTMLFormElement>(null)

  // https://github.com/final-form/react-final-form/blob/master/docs/faq.md#via-documentgetelementbyid
  const handleSaveClick = () =>
    formRef.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    )

  // It is not possible to have the editor while this drawer is open because of the z-index issue.
  // The editor is on the drawer body so we need to pass keepMounted prop to drawer and use this
  // state to hide the drawer while the editor is open.
  const [shouldHideDrawer, setShouldHideDrawer] = useState(false)

  const hideDrawer = () => setShouldHideDrawer(true)

  const showDrawer = () => setShouldHideDrawer(false)

  const handleConfirm = ({
    due_at,
    ...otherValues
  }: SuperCampaignFormInternalValues) =>
    onConfirm({
      ...otherValues,
      due_at: due_at ? convertDateToTimestamp(due_at) : undefined
    })

  return (
    <>
      <OverlayDrawer
        open={isOpen && !shouldHideDrawer}
        onClose={onClose}
        width="600px"
        keepMounted
      >
        <OverlayDrawer.Header
          title="Enter Campaign Details"
          closeButtonDisabled={actionButtonsDisabled}
        />
        <OverlayDrawer.Body>
          <Box my={3}>
            {isOpen && (
              <Form<SuperCampaignFormInternalValues>
                onSubmit={handleConfirm}
                initialValues={{
                  ...formInitialValues,
                  due_at: formInitialValues.due_at
                    ? convertTimestampToDate(formInitialValues.due_at)
                    : undefined
                }}
              >
                {({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} ref={formRef}>
                    <FormTextField
                      name="subject"
                      label="Email Campaign Subject"
                    />
                    <FormTextField
                      name="description"
                      label="Description"
                      multiline
                      helperText="Only agents who are eligible to participate in this campaign will see this."
                      minRows={3}
                    />
                    <DateTimeField
                      name="due_at"
                      datePickerModifiers={{
                        disabled: {
                          before: new Date()
                        }
                      }}
                    >
                      {({ formattedDate, handleOpen }) => (
                        <TextField
                          value={formattedDate ?? ''}
                          onClick={handleOpen}
                          variant="outlined"
                          label="Schedule"
                          size="small"
                          fullWidth
                          InputProps={{
                            endAdornment: <SvgIcon path={mdiCalendarBlank} />,
                            inputProps: { readOnly: true }
                          }}
                          InputLabelProps={{ shrink: true }}
                          margin="normal"
                        />
                      )}
                    </DateTimeField>
                    <Field<Optional<IMarketingTemplateInstance>>
                      name="template_instance"
                      render={({ input }) =>
                        input.value && (
                          <SuperCampaignTemplate
                            className={classes.template}
                            titleClassName={classes.templateTitle}
                            titleVariant="caption"
                            template={input.value}
                            onTemplateChange={template =>
                              input.onChange({ target: { value: template } })
                            }
                            onEditorOpen={hideDrawer}
                            onEditorClose={showDrawer}
                          />
                        )
                      }
                    />
                  </form>
                )}
              </Form>
            )}
          </Box>
        </OverlayDrawer.Body>
        <OverlayDrawer.Footer rowReverse>
          <Button
            disabled={actionButtonsDisabled}
            color="primary"
            variant="contained"
            onClick={handleSaveClick}
          >
            Save
          </Button>
        </OverlayDrawer.Footer>
      </OverlayDrawer>
    </>
  )
}

export default SuperCampaignDrawer
