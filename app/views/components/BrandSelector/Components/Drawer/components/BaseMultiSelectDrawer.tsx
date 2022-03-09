import { useState } from 'react'

import { Button, Checkbox, FormControlLabel } from '@material-ui/core'

import Drawer from '@app/views/components/OverlayDrawer'

import { BaseUserRootBrandSelector } from '../../Base'
import { useStyles } from '../styles'
import { BaseMultiSelectDrawer as BaseMultiSelectDrawerProps } from '../type'

export function BaseMultiSelectDrawer({
  disabled,
  drawerTitle = 'Select Agents',
  saveButtonText,
  brandSelectorProps = {},
  selectedBrands: currentBrands = [],
  onSave,
  ...props
}: BaseMultiSelectDrawerProps) {
  const classes = useStyles()
  const [selectedBrands, setSelectedBrands] = useState<UUID[]>(currentBrands)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const handleClick = async () => {
    setIsSaving(true)

    try {
      await onSave(selectedBrands)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }
  const handleOnNodeClick = (brandId: UUID) => {
    setSelectedBrands(state => {
      if (state.includes(brandId)) {
        return state.filter(id => id !== brandId)
      }

      return [...state, brandId]
    })
  }
  const getButtonLabel = () => {
    if (saveButtonText) {
      return saveButtonText
    }

    if (isSaving) {
      return 'Saving...'
    }

    return 'Save'
  }
  const nodeRenderer = ({ brand }) => {
    const isSelected = selectedBrands.includes(brand.id)

    return (
      <FormControlLabel
        disabled={disabled || isSaving}
        control={<Checkbox size="small" />}
        checked={isSelected}
        onChange={() => handleOnNodeClick(brand.id)}
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
            <BaseUserRootBrandSelector
              {...brandSelectorProps}
              nodeRenderer={nodeRenderer}
            />
          </div>
        </Drawer.Body>
        <Drawer.Footer rowReverse>
          <Button
            variant="contained"
            color="primary"
            disabled={disabled || isSaving || selectedBrands.length === 0}
            onClick={handleClick}
          >
            {getButtonLabel()}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}
