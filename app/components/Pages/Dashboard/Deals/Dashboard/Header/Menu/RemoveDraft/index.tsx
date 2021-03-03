import React from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import {
  Button,
  Tooltip,
  Theme,
  makeStyles,
  createStyles
} from '@material-ui/core'

interface Props {
  deal: IDeal
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column'
    }
  })
)

function RemoveDraft(props: Props & WithRouterProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Tooltip title="You can only see this deal">
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            props.router.push(`/dashboard/deals/${props.deal.id}/publish`)
          }
        >
          Make visible to admin
        </Button>
      </Tooltip>
    </div>
  )
}

export default withRouter(RemoveDraft)
