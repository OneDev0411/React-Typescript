import { useState } from 'react'

import { Grid, Typography, Theme, makeStyles } from '@material-ui/core'

import { TriggerEditMode as EditMode } from '../EditMode'

import { Item } from './components/Item'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginTop: theme.spacing(2)
    },
    title: {
      marginBottom: theme.spacing(1.5)
    }
  }),
  {
    name: 'GlobalTriggerItems'
  }
)

interface Props {
  list: Nullable<IGlobalTrigger[]>
}

export function TriggerItems({ list }: Props) {
  const classes = useStyles()

  console.log({ list })

  // const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)

  // const handleShowEditMode = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleCloseEditMode = () => {
  //   setAnchorEl(null)
  // }

  return (
    <div className={classes.container}>
      {/* <Button variant="contained" color="primary" onClick={handleShowEditMode}>
        Item
      </Button> */}
      <Typography variant="subtitle2" className={classes.title}>
        Default Templates
      </Typography>
      <Grid container alignItems="flex-start" className={classes.container}>
        {list?.map(trigger => (
          <Grid key={trigger.event_type} item md={4}>
            <Item trigger={trigger} />
          </Grid>
        ))}
      </Grid>
      {/* <EditMode
        trigger={list ? list[0] : undefined}
        anchor={anchorEl}
        handleClose={handleCloseEditMode}
      /> */}
    </div>
  )
}
