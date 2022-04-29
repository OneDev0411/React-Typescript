import { Button, ButtonProps } from '@material-ui/core'

interface ConfirmationDialogFooterActionProps {
  buttonProps: ButtonProps
  renderButton?: (props: ButtonProps) => JSX.Element
}

function ConfirmationDialogFooterAction({
  buttonProps,
  renderButton
}: ConfirmationDialogFooterActionProps) {
  if (renderButton) {
    return renderButton(buttonProps)
  }

  return <Button {...buttonProps} />
}

export default ConfirmationDialogFooterAction
