import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import { mdiLightningBolt } from '@mdi/js'

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

interface ButtonProps {
  type: string
  onClick: (event: React.MouseEvent) => void
  'aria-describedby': string
  className: string
}
interface Props {
  id?: string
  isOpen: boolean
  onClick: (event: React.MouseEvent) => void
  render?: (props?: ButtonProps) => JSX.Element
}

export function AddToFlowButton({ id = '', isOpen, render, onClick }: Props) {
  const classes = useStyles()

  const buttonProps: ButtonProps = {
    type: 'button',
    onClick,
    'aria-describedby': id,
    className: isOpen ? classes.isOpen : classes.isClose
  }

  if (render) {
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
