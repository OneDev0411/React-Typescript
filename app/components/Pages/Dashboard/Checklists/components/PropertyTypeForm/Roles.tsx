import {
  Button,
  Box,
  Grid,
  Theme,
  makeStyles,
  useTheme
} from '@material-ui/core'
import { Control, Controller, useFormContext } from 'react-hook-form'

import { getDefaultRoles } from './helpers/get-default-roles'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      paddingLeft: theme.spacing(1.5)
    },
    row: {
      alignItems: 'center',
      marginBottom: theme.spacing(2)
    }
  }),
  {
    name: 'PropertyTypeForm-Roles'
  }
)

interface Props {
  control: Control
  list: string[]
}

export function Roles({ list, control }: Props) {
  const classes = useStyles()
  const theme = useTheme<Theme>()
  const { watch } = useFormContext()

  const roles = watch('roles')
  const defaultRoles = getDefaultRoles(watch('is_lease'))

  const getNextState = (name: string) => {
    const role = roles?.[name]

    let nextType: boolean | undefined

    if (role === undefined) {
      nextType = true
    } else if (role === true) {
      nextType = false
    } else if (role === false) {
      nextType = undefined
    }

    return nextType
  }

  const getRoleProperties = (name: string) => {
    const role = roles?.[name]

    if (role === true) {
      return {
        label: 'Required',
        color: theme.palette.error.main
      }
    }

    if (role === false) {
      return {
        label: 'Optional',
        color: theme.palette.info.main
      }
    }

    return {
      label: 'Not Applicable',
      color: theme.palette.common.black
    }
  }

  return (
    <>
      <Box pl={0.5} my={3}>
        Roles
      </Box>
      <Grid container className={classes.root}>
        <Controller
          name="roles"
          control={control}
          render={({ onChange }) => (
            <>
              {list.map(name => {
                const { label, color } = getRoleProperties(name)
                const disabled = defaultRoles[name] === true

                return (
                  <Grid
                    key={name}
                    container
                    spacing={2}
                    className={classes.row}
                  >
                    <Grid xs={4}>
                      <strong>{name}</strong>
                    </Grid>

                    <Grid xs={4}>
                      <Button
                        style={{
                          color: disabled ? 'gray' : color
                        }}
                        disabled={disabled}
                        size="small"
                        onClick={() =>
                          onChange({
                            ...roles,
                            [name]: getNextState(name)
                          })
                        }
                      >
                        {label}
                      </Button>
                    </Grid>
                  </Grid>
                )
              })}
            </>
          )}
        />
      </Grid>
    </>
  )
}
