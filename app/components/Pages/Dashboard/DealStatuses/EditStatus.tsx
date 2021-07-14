import { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'
import { useActiveTeamId } from 'hooks/use-active-team-id'

interface Props {
  status: IDealStatus | undefined
  onClose: () => void
}

export function EditStatus({ status, onClose }: Props) {
  const [isSaving, setIsSaving] = useState(false)

  const teamId = useActiveTeamId()
  const { propertyTypes } = useBrandPropertyTypes(teamId)

  const handleSave = () => {
    setIsSaving(true)
  }

  return (
    <Dialog open={!!status} fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div>
            Update <strong>{status?.label}</strong>
          </div>
          <IconButton onClick={onClose}>
            <SvgIcon path={mdiClose} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>TBD</DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
