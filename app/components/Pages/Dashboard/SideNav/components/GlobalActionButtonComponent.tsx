import { Button, Theme, withStyles } from '@material-ui/core'
import { mdiChevronDown } from '@mdi/js'

import { CustomButtonRenderProps } from '@app/views/components/GlobalActionsButton/types'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const CustomButton = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.navbar.button.main,
    height: theme.spacing(4),
    width: '100%',

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
      endIcon={<SvgIcon path={mdiChevronDown} size={muiIconSizes.small} />}
      {...props}
    >
      Create
    </CustomButton>
  )
}
