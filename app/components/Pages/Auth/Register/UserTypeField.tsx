import React from 'react'
import { Field } from 'react-final-form'
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@material-ui/core'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      maxWidth: '400px',
      marginBottom: theme.spacing(3)
    },
    group: {
      alignItems: 'center',

      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row'
      }
    },
    controlLabel: {
      width: '100%',
      margin: theme.spacing(0, 0, 1.5),
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1, 1, 0, 0),
      backgroundColor: theme.palette.grey['200'],
      [theme.breakpoints.up(300)]: {
        width: 280
      },
      [theme.breakpoints.up('sm')]: {
        marginBottom: 0,
        marginRight: theme.spacing(2),
        width: `calc(50% - ${theme.spacing(1)}px)`,
        '&:last-child': {
          marginRight: 0
        }
      }
    }
  })
)

export function UserTypeField() {
  const classes = useStyles()

  return (
    <Field
      name="user_type"
      render={({ input }) => {
        return (
          <FormControl
            variant="filled"
            color="secondary"
            classes={{ root: classes.container }}
          >
            <RadioGroup
              aria-label="user-type"
              name="user_type"
              value={input.value}
              onChange={input.onChange}
              classes={{ root: classes.group }}
            >
              <FormControlLabel
                value="Agent"
                control={<Radio />}
                label="I'm a Professional"
                classes={{ root: classes.controlLabel }}
              />
              <FormControlLabel
                value="Client"
                control={<Radio />}
                label="I'm a Buyer/Seller"
                classes={{ root: classes.controlLabel }}
              />
            </RadioGroup>
          </FormControl>
        )
      }}
    />
  )
}
