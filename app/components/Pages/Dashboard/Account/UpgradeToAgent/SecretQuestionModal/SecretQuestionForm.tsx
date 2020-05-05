import React from 'react'
import { Form, Field } from 'react-final-form'
import { Button, Box, Typography, makeStyles, Theme } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { MUITextInput } from 'components/Forms/MUITextInput'

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    width: theme.spacing(47)
  },
  submitBtn: {
    marginLeft: theme.spacing(1)
  }
}))

interface Props {
  agent: IAgent | null
  onCancel: () => void
  onConfirm: ({ secret }: FormValues) => Promise<any>
}

interface FormValues {
  secret: string
}

export function SecretQuestionForm(props: Props) {
  const classes = useStyles()

  const validate = ({ secret }: FormValues) => {
    secret = secret && secret.trim()

    if (!secret) {
      return { secret: 'Required!' }
    }

    return {}
  }

  return (
    <>
      <Box mb={3}>
        <Typography variant="h4">Agent Verification</Typography>
        <Box mb={1} />
        <Typography>
          Enter the complete mobile number or email address.
        </Typography>
      </Box>

      <Form
        onSubmit={props.onConfirm}
        validate={validate}
        render={({ handleSubmit, form }) => {
          const { submitError, submitting } = form.getState()

          return (
            <form onSubmit={handleSubmit} style={{ height: '100%' }}>
              <Box
                height="100%"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <div>
                  <Box textAlign="left" mb={2}>
                    <Typography
                      variant="body2"
                      display="block"
                      color="textSecondary"
                    >
                      Hint:
                    </Typography>
                    {props.agent &&
                      props.agent.secret_questions.map((question, index) => (
                        <Typography
                          key={index}
                          display="block"
                          variant="subtitle1"
                        >
                          {question}
                        </Typography>
                      ))}
                  </Box>
                  <Field
                    component={MUITextInput}
                    id="secret"
                    label="Enter full phone or email shown above"
                    name="secret"
                    variant="filled"
                    classes={{ root: classes.input }}
                  />
                  {submitError && !submitting && (
                    <Box mt={3}>
                      <Alert severity="error">{submitError}</Alert>
                    </Box>
                  )}
                </div>

                <Box display="flex" justifyContent="flex-end">
                  <Button
                    type="button"
                    disabled={submitting}
                    onClick={props.onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    disabled={submitting}
                    classes={{ root: classes.submitBtn }}
                  >
                    {submitting ? 'Checking...' : 'Confirm'}
                  </Button>
                </Box>
              </Box>
            </form>
          )
        }}
      />
    </>
  )
}
