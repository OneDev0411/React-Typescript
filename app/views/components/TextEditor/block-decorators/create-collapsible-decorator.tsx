import { useCallback, useState } from 'react'
import * as React from 'react'
import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'

interface Options {
  defaultCollapsed?: boolean
  /**
   * tooltip for toggle button
   */
  tooltip?: string
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      toggleButton: {
        padding: theme.spacing(0, 0.75),
        lineHeight: 0,
        fontFamily: 'Times',
        fontSize: '1.8rem',
        letterSpacing: '-1.5px',
        textIndent: '-3.5px',
        display: 'inline-block',
        height: '0.87rem',
        backgroundColor: theme.palette.grey['200'],
        '&:hover': {
          backgroundColor: theme.palette.grey['300']
        },
        color: theme.palette.grey['800'],
        borderRadius: theme.shape.borderRadius * 2,
        cursor: 'pointer'
      }
    }),
  { name: 'Collapsible' }
)

export const createCollapsibleDecorator = <P extends {}>({
  defaultCollapsed,
  tooltip = 'Show trimmed content'
}: Options) => (Component: React.ComponentType<P>) => {
  return function CollapsibleBlock(props: P) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed)
    const classes = useStyles()

    const toggle = useCallback(() => setCollapsed(collapsed => !collapsed), [])

    return collapsed ? (
      <Tooltip title={tooltip}>
        <span onClick={toggle} className={classes.toggleButton}>
          ...
        </span>
      </Tooltip>
    ) : (
      <Component toggle={toggle} {...props} />
    )
  }
}
