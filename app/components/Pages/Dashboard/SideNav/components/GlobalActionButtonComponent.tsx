import { Button, Theme, withStyles } from '@material-ui/core'

import { CustomButtonRenderProps } from '@app/views/components/GlobalActionsButton/types'

const CustomButton = withStyles((theme: Theme) => ({
  root: {
    borderRadius: '50px',
    backgroundColor: theme.navbar.button.main,
    '&:hover': {
      backgroundColor: theme.navbar.button.light
    }
  },
  label: {
    color: theme.navbar.button.contrastText
  }
}))(Button)

export function GlobalActionButtonComponent(props: CustomButtonRenderProps) {
  return (
    <CustomButton
      variant="contained"
      color="primary"
      size="small"
      fullWidth
      {...props}
    >
      Create
    </CustomButton>
  )
}
