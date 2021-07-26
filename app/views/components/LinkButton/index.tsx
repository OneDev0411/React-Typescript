import { Button, ButtonProps } from '@material-ui/core'

import withLinkButton, { WithLinkButtonProps } from '../with-link-button'

export type LinkButtonProps = ButtonProps & WithLinkButtonProps

export default withLinkButton<LinkButtonProps>(Button)
