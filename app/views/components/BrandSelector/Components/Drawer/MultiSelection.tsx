import { useState } from 'react'

import { Box, Button, Checkbox, FormControlLabel } from '@material-ui/core'

import Drawer from '@app/views/components/OverlayDrawer'

import { BaseBrandSelector } from '../Base'

import { useStyles } from './styles'
import { MultiSelectionBrandSelectoeDrawer as Props } from './type'

export function MultiSelectionBrandSelectorDrawer({
  drawerTitle = 'Select Agents',
  brandSelectorProps = {},
  selectedBrands: currentBrands = [],
  onSave,
  ...props
}: Props) {
  const classes = useStyles()
  const [selectedBrands, setSelectedBrands] = useState<UUID[]>(currentBrands)

  const handleClick = () => {
    onSave(selectedBrands)
  }
  const handleOnClick = (brandId: UUID) => {
    setSelectedBrands(state => {
      if (state.includes(brandId)) {
        return state.filter(id => id !== brandId)
      }

      return [...state, brandId]
    })
  }
  const nodeRenderer = ({ brand }) => {
    const isSelected = selectedBrands.includes(brand.id)

    return (
      <FormControlLabel
        control={<Checkbox size="small" />}
        checked={isSelected}
        onChange={() => handleOnClick(brand.id)}
        label={brand.name}
      />
    )
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
        <Drawer.Footer>
          <Box width="100%" display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleClick}>
              Save
            </Button>
          </Box>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}
