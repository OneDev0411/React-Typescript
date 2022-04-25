import { useState } from 'react'

import { Button, CircularProgress } from '@material-ui/core'
import { mdiInstagram } from '@mdi/js'

import { useGetActiveBrandFacebookPages } from '@app/models/facebook'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import ConnectToInstagramDialog from './ConnectToInstagramDialog'

interface SocialDrawerInstagramButtonProps {
  disabled?: boolean
  onClick: () => void
}

function SocialDrawerInstagramButton({
  disabled = false,
  onClick
}: SocialDrawerInstagramButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const { data: facebookPages, isLoading } = useGetActiveBrandFacebookPages()
  const hasAnyAccounts = !!facebookPages?.length

  const openDialog = () => setIsDialogOpen(true)

  const closeDialog = () => setIsDialogOpen(false)

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
        startIcon={
          isLoading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            <SvgIcon path={mdiInstagram} size={muiIconSizes.small} />
          )
        }
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleClick}
        disabled={isLoading || disabled}
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
