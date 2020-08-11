import React, { memo } from 'react'
import {
  Button,
  Popover,
  List,
  ListItem,
  FormControlLabel,
  Checkbox
} from '@material-ui/core'

import { Form, Field } from 'react-final-form'

import { FilterShape } from './type'

interface Props {
  el: HTMLButtonElement | null
  onClose(): void
}

const FilterEventsComponent = ({ el, onClose }: Props) => {
  const open = Boolean(el)
  const id = open ? 'filter-event-popover' : undefined

  // Available filters
  const filters = [
    {
      name: 'celebrationEvents',
      lable: 'Celebrations'
    },
    {
      name: 'dealEvents',
      lable: 'Deal’s Event'
    },
    {
      name: 'holidayEvents',
      lable: 'Holidays'
    }
  ]
  const initialFilters: FilterShape = {
    celebrationEvents: true,
    dealEvents: true,
    holidayEvents: true
  }

  const onSubmit = (values: FilterShape) => {
    console.log(values)
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={el}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <Form
        onSubmit={onSubmit}
        initialValues={initialFilters}
        render={({ handleSubmit, submitting }) => {
          return (
            <form onSubmit={handleSubmit} noValidate>
              <List>
                {filters.map(filter => (
                  <ListItem dense key={filter.name}>
                    <Field
                      name={filter.name}
                      type="checkbox"
                      render={({ input }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={input.checked}
                              onChange={input.onChange}
                            />
                          }
                          label={filter.lable}
                        />
                      )}
                    />
                  </ListItem>
                ))}
                <ListItem dense>
                  <Button
                    type="submit"
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    Apply
                  </Button>
                </ListItem>
              </List>
            </form>
          )
        }}
      />
    </Popover>
  )
}

export const FilterEvents = memo(FilterEventsComponent)
