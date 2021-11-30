import { useState } from 'react'

import { Button, Grid, Theme, makeStyles, useTheme } from '@material-ui/core'
import matchSorter from 'match-sorter'
import { Control, Controller, useFormContext } from 'react-hook-form'

import { roleName } from 'deals/utils/roles'

import { getDefaultRoles } from './helpers/get-default-roles'
import { RoleSearch } from './RoleSearch'

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
  const [rolesList, setRolesList] = useState(list)

  const roles = watch('roles')
  const defaultRoles = getDefaultRoles(watch('is_lease'))

  const handleSearch = (value: string) => {
    const newList = value
      ? matchSorter(
          list.map(name => ({
            value: name,
            label: roleName(name)
          })),
          value,
          {
            keys: ['label', 'value']
          }
        ).map(item => item.value)
      : list

    setRolesList(newList)
  }

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
      <RoleSearch onChange={handleSearch} />
      <Grid container className={classes.root}>
        <Controller
          name="roles"
          control={control}
          render={({ onChange }) => (
            <>
              {rolesList.map(name => {
                const { label, color } = getRoleProperties(name)
                const disabled = defaultRoles[name] === true

                return (
                  <Grid
                    key={name}
                    container
                    spacing={2}
                    className={classes.row}
                  >
                    <Grid xs={5}>
                      <strong>{roleName(name)}</strong>
                    </Grid>

                    <Grid xs={2}>
                      <Button
                        fullWidth
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
