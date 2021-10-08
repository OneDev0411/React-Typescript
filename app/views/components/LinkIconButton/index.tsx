import { IconButton, IconButtonProps } from '@material-ui/core'

import withLinkButton, { MakeWithLinkButtonProps } from '../with-link-button'

export type LinkIconButtonProps = MakeWithLinkButtonProps<IconButtonProps>

export default withLinkButton<IconButtonProps>(IconButton)
