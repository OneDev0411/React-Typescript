import {
  Box,
  TextField,
  TextFieldProps,
  Button,
  ButtonProps
} from '@material-ui/core'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'
import useIsMobile from 'hooks/use-is-mobile'

interface Props {
  question: string
  value: Nullable<string>
  nextButtonCopy?: string
  nextButtonProps?: ButtonProps
  textFieldProps?: TextFieldProps
  onChange: (value: string) => void
}

export default function ShowingAppointmentTextQuestion({
  question,
  value,
  nextButtonCopy = 'Next',
  nextButtonProps = {},
  textFieldProps = {},
  onChange
}: Props) {
  const isMobile = useIsMobile()

  return (
    <QuestionSection>
      <QuestionTitle style={isMobile ? { maxWidth: 'none' } : undefined}>
        {question}
      </QuestionTitle>
      <QuestionForm
        width={isMobile ? '100%' : '70%'}
        containerProps={isMobile ? { mt: 2 } : { mt: 6 }}
      >
        <TextField
          {...textFieldProps}
          value={value}
          onChange={event => {
            onChange(event.target.value)
          }}
        />
      </QuestionForm>
      <Box py={2} display="flex" justifyContent="flex-end">
        <Button {...nextButtonProps}>{nextButtonCopy}</Button>
      </Box>
    </QuestionSection>
  )
}
