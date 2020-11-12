import React from 'react'
import { useField, Form } from 'react-final-form'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

import { MUITextInput } from 'components/Forms/MUITextInput'
import { TextArea } from 'components/Forms/TextArea'

function Field({ name, placeholder }: { name: string; placeholder: string }) {
  const field = useField(name)

  return (
    <MUITextInput
      size="small"
      variant="outlined"
      placeholder={placeholder}
      label={placeholder}
      {...field}
      fullWidth
    />
  )
}

function TextAreaField({
  name,
  label,
  placeholder
}: {
  name: string
  label: string
  placeholder: string
}) {
  const field = useField(name)

  return (
    <TextArea
      labelText={label}
      placeholder={placeholder}
      minHeight={400}
      style={{
        borderRadius: '4px',
        padding: '1rem',
        border: '1px solid rgba(0, 0, 0, 0.23)'
      }}
      {...field}
    />
  )
}

interface Props {
  onSubmit: () => Promise<void>
}

function AgentContactForm({ onSubmit }: Props) {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box py={5} px={3}>
              <Box mb={2}>
                <Field placeholder="Name" name="name" />
              </Box>
              <Box mb={2}>
                <Field placeholder="Email" name="email" />
              </Box>
              <Box mb={2}>
                <Field placeholder="Phone" name="phone" />
              </Box>
              <Box mb={2}>
                <TextAreaField
                  placeholder="I would like more information..."
                  name="message"
                  label="Message"
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Send Message
              </Button>
            </Box>
          </form>
        )
      }}
    />
  )
}

export default AgentContactForm
