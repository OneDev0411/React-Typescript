import { useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiInstagram } from '@mdi/js'

import { useGetActiveBrandFacebookPages } from '@app/models/facebook'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import ConnectToInstagramDialog from './ConnectToInstagramDialog'

interface SocialDrawerInstagramButtonProps {
  onClick: () => void
}

function SocialDrawerInstagramButton({
  onClick
}: SocialDrawerInstagramButtonProps) {
  const [isDialogOpen, stIsDialogOpen] = useState<boolean>(false)

  const { data: facebookPages, isLoading } = useGetActiveBrandFacebookPages()
  const hasAnyAccounts = !!facebookPages?.length

  const openDialog = () => stIsDialogOpen(true)

  const closeDialog = () => stIsDialogOpen(false)

  const handleClick = () => {
    if (hasAnyAccounts) {
      onClick()

      return
    }

    openDialog()
  }

  const handleAuthSuccess = () => {
    closeDialog()
    onClick()
  }

  return (
    <>
      <Button
        startIcon={<SvgIcon path={mdiInstagram} size={muiIconSizes.small} />}
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleClick}
        disabled={isLoading}
      >
        Instagram ...
      </Button>
      <ConnectToInstagramDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}

export default SocialDrawerInstagramButton
