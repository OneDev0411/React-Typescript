import { useState } from 'react'

import { Button } from '@material-ui/core'

import useNotify from '@app/hooks/use-notify'

import MakeVisibleToAdmin from '../../../../Create/MakeVisibleToAdmin'

interface Props {
  deal: IDeal
}

export function MakeVisible({ deal }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const notify = useNotify()

  const onCancel = () => {
    setIsDialogOpen(false)
  }

  const onComplete = () => {
    setIsDialogOpen(false)

    notify({
      status: 'success',
      message:
        'Your deal is now live, please make sure you notify your office to review any checklist item you have completed.'
    })
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        onClick={() => setIsDialogOpen(true)}
      >
        Make Visible To Office
      </Button>

      {isDialogOpen && (
        <MakeVisibleToAdmin
          dealId={deal.id}
          onCancel={onCancel}
          onComplete={onComplete}
        />
      )}
    </>
  )
}
