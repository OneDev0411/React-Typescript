import React from 'react'
import { Typography, Box, Button, Checkbox, Link } from '@material-ui/core'

import { useStyles } from '../../styles'

interface Props {}

export default function BulkActionsMenu() {
  const classes = useStyles()

  return (
    <Box
      display="flex"
      width={1}
      className={classes.bulkActionsMenu}
      border={1}
      p={2}
      borderColor="#d4d4d4"
    >
      <Box flexGrow={1}>
        <Checkbox
          defaultChecked
          value="indeterminate"
          indeterminate
          color="primary"
          inputProps={{ 'aria-label': 'indeterminate checkbox' }}
        />
        <Typography display="inline" className={classes.bold}>
          2 Photos selected
        </Typography>
        {' -  '}
        <Link href="#">Select all 32 photos</Link>
      </Box>
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="row-reverse"
        className={classes.actionButtons}
      >
        <Button
          variant="outlined"
          disableElevation
          className={classes.lowerCaseButton}
        >
          Download 2 Photos
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          disableElevation
          className={classes.lowerCaseButton}
        >
          Delete 2 Photos
        </Button>
      </Box>
    </Box>
  )
}
