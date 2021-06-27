import { mdiLightningBolt } from '@mdi/js'
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    isOpen: {
      pointerEvents: 'none'
    },
    isClose: {
      pointerEvents: 'initial'
    }
  })
)

interface Props {
  id?: string
  isOpen: boolean
  onClick: () => void
  render?: (props?: any) => boolean
}

export function AddToFlowButton({
  id = '',
  isOpen,
  render = () => false,
  onClick
}: Props) {
  const classes = useStyles()

  const buttonProps = {
    type: 'button',
    onClick,
    'aria-describedby': id,
    className: isOpen ? classes.isOpen : classes.isClose
  }

  if (render()) {
    return render(buttonProps)
  }

  return (
    <Button
      aria-describedby={id}
      className={isOpen ? classes.isOpen : classes.isClose}
      startIcon={<SvgIcon path={mdiLightningBolt} />}
      onClick={onClick}
      disableRipple
      variant="text"
      type="button"
    >
      Add to Flow
    </Button>
  )
}

export default AddToFlowButton
