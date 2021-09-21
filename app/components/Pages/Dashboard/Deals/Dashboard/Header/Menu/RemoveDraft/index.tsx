import React from 'react'

import {
  Button,
  Tooltip,
  Theme,
  makeStyles,
  createStyles
} from '@material-ui/core'
import { withRouter, WithRouterProps } from 'react-router'

import { useGetOriginQueryParam } from '../../../../hooks/use-get-origin-query-param'

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
  const originQueryParam = useGetOriginQueryParam()

  return (
    <div className={classes.root}>
      <Tooltip title="You can only see this deal">
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            props.router.push(
              `/dashboard/deals/${props.deal.id}/publish?${originQueryParam}`
            )
          }
        >
          Make visible to admin
        </Button>
      </Tooltip>
    </div>
  )
}

export default withRouter(RemoveDraft)
