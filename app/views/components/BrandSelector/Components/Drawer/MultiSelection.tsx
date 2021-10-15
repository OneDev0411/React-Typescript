import { Typography, Checkbox, FormControlLabel } from '@material-ui/core'
import cn from 'classnames'

import Drawer from '@app/views/components/OverlayDrawer'

import { BaseBrandSelector } from '../Base'

import { useStyles } from './styles'
import { MultiSelectionBrandSelectoeDrawer as Props } from './type'

export function MultiSelectionBrandSelectorDrawer({
  drawerTitle = 'Select Agents',
  brandSelectorProps = {},
  ...props
}: Props) {
  const classes = useStyles()
  const nodeRenderer = ({ brand }) => {
    // const isSelected = false

    return (
      <FormControlLabel
        control={<Checkbox size="small" />}
        label={brand.name}
      />
    )

    // return (
    //   <div
    //     className={cn(classes.multiSelectionRenderer, {
    //       [classes.disabled]: isSelected
    //     })}
    //     // onClick={handleOnClick}
    //   >
    //     <Typography variant="body2">{brand.name}</Typography>
    //   </div>
    // )
  }

  return (
    <>
      <Drawer {...props}>
        <Drawer.Header title={drawerTitle} />
        <Drawer.Body>
          <div className={classes.container}>
            <BaseBrandSelector nodeRenderer={nodeRenderer} />
          </div>
        </Drawer.Body>
        <Drawer.Footer>xxx</Drawer.Footer>
      </Drawer>
    </>
  )
}
