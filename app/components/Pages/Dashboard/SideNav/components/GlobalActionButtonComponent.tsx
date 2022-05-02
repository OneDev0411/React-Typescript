import { Button, Theme, withStyles } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import { CustomButtonRenderProps } from '@app/views/components/GlobalActionsButton/types'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

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
      startIcon={<SvgIcon path={mdiPlus} />}
      {...props}
    >
      CREATE
    </CustomButton>
  )
}
