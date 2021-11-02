import { useState } from 'react'

import { Box, Button } from '@material-ui/core'
import { mdiArrowLeft } from '@mdi/js'

import Drawer, { OverlayDrawerProps } from '@app/views/components/OverlayDrawer'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

interface Props extends OverlayDrawerProps {
  isAdding: boolean
  onBack: () => void
  onAdd: (tags: string[]) => Promise<void>
}

export function SelectTagForSelectedAgentDrawer({
  isAdding,
  onAdd,
  ...props
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleClick = async () => {
    try {
      await onAdd(selectedTags)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Drawer {...props}>
        <Drawer.Header title="Add Tag" />
        <Drawer.Body>
          <Box p={2}>ddd</Box>
        </Drawer.Body>
        <Drawer.Footer rowReverse>
          <Button
            variant="contained"
            color="primary"
            disabled={isAdding}
            onClick={handleClick}
          >
            {isAdding ? 'Adding...' : 'Add'}
          </Button>
          <Button
            color="secondary"
            disabled={isAdding}
            onClick={handleClick}
            startIcon={
              <SvgIcon path={mdiArrowLeft} size={muiIconSizes.small} />
            }
          >
            Edit Agents
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}
