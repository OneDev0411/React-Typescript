import { connect } from 'react-redux'
import { addNotification } from 'reapop'
import { Box, Button, Grid, Theme } from '@material-ui/core'
import { Field, Form } from 'react-final-form'
import * as React from 'react'
import styled, { ThemeProps } from 'styled-components'

import { IAppState } from 'reducers'
import editUser from 'actions/user/edit'
import { uploadEmailSignatureAttachment } from 'models/user/upload-email-signature-attachment'

import { TextEditor } from '../TextEditor'

interface Props {
  user: IUser
  editUser: (updates: IUserInput) => (dispatch) => Promise<any>
  addNotification: typeof addNotification
  onSaved?: () => void
  showActions?: boolean
  formId?: string
}

const StyledTextEditor = styled(TextEditor)`
  border: 1px solid ${(props: ThemeProps<Theme>) => props.theme.palette.divider};
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 1, 1, 1)};
`

function EditEmailSignature({
  user,
  onSaved = () => {},
  editUser,
  addNotification,
  showActions = true,
  formId
}: Props) {
  const submit = async (values: { signature: string }) => {
    try {
      await editUser({ email_signature: values.signature || '' })
      addNotification({
        message: 'Email signature has been saved',
        status: 'success'
      })
      onSaved()
    } catch (e) {
      console.error(e)
      addNotification({
        message: 'Could not save email signature',
        status: 'error'
      })
    }
  }

  const uploadImage = async file => {
    const response = await uploadEmailSignatureAttachment(file)
    const uploadedFile: IFile = response.body.data

    return uploadedFile.url
  }

  return (
    <Form
      initialValues={{ signature: user.email_signature }}
      onSubmit={submit}
      render={({ handleSubmit, submitting }) => (
        <form id={formId} onSubmit={handleSubmit} noValidate>
          <Box mb={2}>
            <Field
              name="signature"
              render={({ input }) => (
                <StyledTextEditor
                  autofocus
                  input={input}
                  enableImage
                  uploadImage={uploadImage}
                />
              )}
            />
          </Box>

          {showActions && (
            <Grid container justify="flex-end">
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={submitting}
              >
                Save
              </Button>
            </Grid>
          )}
        </form>
      )}
    />
  )
}

export default connect(
  ({ user }: IAppState) => ({ user }),
  { editUser, addNotification }
)(EditEmailSignature)
