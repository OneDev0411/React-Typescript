import { useState } from 'react'
import { Button, Box, makeStyles } from '@material-ui/core'

import Drawer from 'components/OverlayDrawer'

import TeamTreeView, { Props as TeamTreeViewProps } from '.'

const useStyles = makeStyles(
  () => ({
    drawerBody: {
      minHeight: 200
    }
  }),
  {
    name: 'TeamTreeViewDrawer'
  }
)

interface Props extends TeamTreeViewProps {
  title?: string
  onClose: () => void
  onSelectTeam: (team: IBrand) => Promise<void>
}

export default function TeamTreeViewDrawer({
  title = 'Select a team',
  onClose,
  onSelectTeam,
  ...teamTreeViewProps
}: Props) {
  const classes = useStyles()
  const [selectedTeam, setSelectedTeam] = useState<Nullable<IBrand>>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const handleSelectTreeViewTeam = (team: IBrand) => {
    setSelectedTeam(team)
  }

  const handleSelectTeam = async () => {
    if (!selectedTeam) {
      return
    }

    setIsSaving(true)

    await onSelectTeam(selectedTeam)

    setIsSaving(false)
  }

  const selectButtonCopy = selectedTeam
    ? `Save for "${selectedTeam.name}"`
    : 'Select a team'

  return (
    <Drawer open onClose={onClose}>
      <Drawer.Header title={title} />
      <Drawer.Body className={classes.drawerBody}>
        <TeamTreeView
          {...teamTreeViewProps}
          onSelectTeam={handleSelectTreeViewTeam}
        />
      </Drawer.Body>
      <Drawer.Footer>
        <Box width="100%" display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedTeam || isSaving}
            onClick={handleSelectTeam}
          >
            {selectButtonCopy}
          </Button>
        </Box>
      </Drawer.Footer>
    </Drawer>
  )
}
