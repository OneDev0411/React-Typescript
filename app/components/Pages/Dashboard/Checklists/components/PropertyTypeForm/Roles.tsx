import { useEffect, useState } from 'react'

import { Button, Grid, Theme, makeStyles, useTheme } from '@material-ui/core'
import matchSorter from 'match-sorter'
import { Control, Controller, useFormContext } from 'react-hook-form'

import { useDealsRolesContext } from '@app/contexts/deals-roles-definitions/use-deals-roles-context'

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
}

export function Roles({ control }: Props) {
  const classes = useStyles()
  const theme = useTheme<Theme>()
  const { watch } = useFormContext()
  const { dealRolesList } = useDealsRolesContext()
  const [rolesList, setRolesList] =
    useState<IDealRoleDefinition[]>(dealRolesList)

  const roles = watch('roles')
  const isLease = watch('is_lease')
  const defaultRoles = getDefaultRoles(isLease)

  useEffect(() => {
    setRolesList(
      dealRolesList.filter(role =>
        role.transaction_type.includes(isLease ? 'Lease' : 'Sale')
      )
    )
  }, [isLease, dealRolesList])

  const handleSearch = (value: string) => {
    const newList = value
      ? matchSorter(rolesList, value, {
          keys: ['role', 'title']
        })
      : dealRolesList

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
              {rolesList.map(definition => {
                const { label, color } = getRoleProperties(definition.role)
                const disabled = defaultRoles[definition.role] === true

                return (
                  <Grid
                    key={definition.role}
                    container
                    spacing={2}
                    className={classes.row}
                  >
                    <Grid xs={5}>
                      <strong>{definition.title}</strong>
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
                            [definition.role]: getNextState(definition.role)
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
