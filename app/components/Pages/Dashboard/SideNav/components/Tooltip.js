import { withProps } from 'recompose'
import { Tooltip } from '@material-ui/core'

export const SideNavTooltip = withProps({ placement: 'right' })(Tooltip)
