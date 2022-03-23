import {
  Theme,
  DialogProps,
  Dialog as MUIDialog,
  useTheme,
  useMediaQuery
} from '@material-ui/core'
import cn from 'classnames'

import { appSidenavWidth } from '@app/components/Pages/Dashboard/SideNav/variables'

const EmptyBackdropComponent = () => {
  return <></>
}

export default function InlineDialog({
  children,
  ...props
}: Exclude<
  DialogProps,
  'fullScreen' | 'style' | 'BackdropComponent' | 'scroll'
>) {
  const theme: Theme = useTheme()
  const hasSideNav = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <MUIDialog
      fullScreen
      scroll="paper"
      BackdropComponent={EmptyBackdropComponent}
      classes={{
        root: cn('u-scrollbar', props.classes?.root),
        ...props.classes
      }}
      {...props}
      style={{
        zIndex: theme.zIndex.modal - 1,
        left: hasSideNav ? appSidenavWidth : 0
      }}
    >
      {children}
    </MUIDialog>
  )
}
