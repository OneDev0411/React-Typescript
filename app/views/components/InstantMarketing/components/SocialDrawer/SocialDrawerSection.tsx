import {
  Button,
  ButtonProps,
  Grid,
  TextField,
  TextFieldProps
} from '@material-ui/core'

interface SocialDrawerSectionProps {
  className?: string
  textFieldProps: Omit<
    TextFieldProps,
    'variant' | 'size' | 'InputLabelProps' | 'fullWidth'
  >
  buttonProps: Omit<ButtonProps, 'size' | 'variant' | 'color' | 'fullWidth'>
}

function SocialDrawerSection({
  className,
  textFieldProps,
  buttonProps
}: SocialDrawerSectionProps) {
  return (
    <Grid className={className} container spacing={2}>
      <Grid item sm={10}>
        <TextField
          {...textFieldProps}
          variant="outlined"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Grid>
      <Grid item sm={2}>
        <Button {...buttonProps} variant="outlined" color="primary" fullWidth />
      </Grid>
    </Grid>
  )
}

export default SocialDrawerSection
