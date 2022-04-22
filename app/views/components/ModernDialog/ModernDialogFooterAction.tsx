import { Button, ButtonProps } from '@material-ui/core'

interface ModernDialogFooterActionProps {
  buttonProps: ButtonProps
  renderButton?: (props: ButtonProps) => JSX.Element
}

function ModernDialogFooterAction({
  buttonProps,
  renderButton
}: ModernDialogFooterActionProps) {
  if (renderButton) {
    return renderButton(buttonProps)
  }

  return <Button {...buttonProps} />
}

export default ModernDialogFooterAction
