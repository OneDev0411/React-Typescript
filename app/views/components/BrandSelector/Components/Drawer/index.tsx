import { Theme, makeStyles } from '@material-ui/core'

import Drawer, { OverlayDrawerProps } from '@app/views/components/OverlayDrawer'

import { BaseBrandSelectorProps } from '../Base'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(2)
    }
  }),
  { name: 'BrandSelectorDrawer' }
)

export type ButtonRenderer = { onOpen: () => void }

interface Props extends OverlayDrawerProps {
  drawerTitle?: string
  brandSelectorProps?: BaseBrandSelectorProps
}

export function BrandSelectorDrawer({
  drawerTitle = 'Select Agents',
  brandSelectorProps = {},
  ...props
}: Props) {
  const classes = useStyles()

  return (
    <>
      <Drawer {...props}>
        <Drawer.Header title={drawerTitle} />
        <Drawer.Body>
          <div className={classes.container}>sdfsd</div>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
