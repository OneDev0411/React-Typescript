import { useRef, useState } from 'react'

import { Box, Button, makeStyles } from '@material-ui/core'
import { Form, Field } from 'react-final-form'

import { FormTextField } from '@app/views/components/final-form-fields'
import FormDateTimeField from '@app/views/components/final-form-fields/FormDateTimeField'
import OverlayDrawer from 'components/OverlayDrawer'

import SuperCampaignTemplate from '../SuperCampaignTemplate'

import { SuperCampaignFormValues } from './types'

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
  const handleConfirm = () =>
    formRef.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    )

  // It is not possible to have the editor while this drawer is open because of the z-index issue.
  // The editor is on the drawer body so we need to pass keepMounted prop to drawer and use this
  // state to hide the drawer while the editor is open.
  const [shouldHideDrawer, setShouldHideDrawer] = useState(false)

  const hideDrawer = () => setShouldHideDrawer(true)

  const showDrawer = () => setShouldHideDrawer(false)

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
              <Form<SuperCampaignFormValues>
                onSubmit={onConfirm}
                initialValues={formInitialValues}
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
                    <FormDateTimeField
                      name="due_at"
                      label="Schedule"
                      mode="timestamp"
                    />
                    <Field
                      name="template_instance"
                      render={({ input }) => (
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
                      )}
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
            onClick={handleConfirm}
          >
            Save
          </Button>
        </OverlayDrawer.Footer>
      </OverlayDrawer>
    </>
  )
}

export default SuperCampaignDrawer
