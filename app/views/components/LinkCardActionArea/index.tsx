import { CardActionArea, CardActionAreaProps } from '@material-ui/core'

import withLinkButton, { MakeWithLinkButtonProps } from '../with-link-button'

export type LinkCardActionAreaProps =
  MakeWithLinkButtonProps<CardActionAreaProps>

export default withLinkButton<CardActionAreaProps>(CardActionArea)
