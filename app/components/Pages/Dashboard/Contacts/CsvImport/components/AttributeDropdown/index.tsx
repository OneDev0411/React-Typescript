import { useState } from 'react'

import { Box, ListItem, makeStyles, TextField, Theme } from '@material-ui/core'

import { BaseDropdown } from '@app/views/components/BaseDropdown'

import { useOptions } from '../../hooks/attribute-options/use-attribute-options'
import { useAttributeLabel } from '../../hooks/use-attribute-label'
import type { AttributeOption, MappedField } from '../../types'
import { DropdownButton } from '../DropdownButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    menuContainer: {
      height: '400px',
      width: '400px',
      overflow: 'hidden'
    },
    header: {
      padding: theme.spacing(1),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    footer: {
      padding: theme.spacing(1),
      borderTop: `1px solid ${theme.palette.divider}`
    },
    body: {
      overflow: 'scroll'
    }
  }),
  {
    name: 'ImportCsv-AttributeDropdown'
  }
)

interface Props {
  fields: Record<string, Nullable<MappedField>>
  column: string
  onSelect: (attribute: AttributeOption) => void
  onRemove: () => void
}

export function AttributeDropdown({
  fields,
  column,
  onSelect,
  onRemove
}: Props) {
  const classes = useStyles()

  const getAttributeLabel = useAttributeLabel()

  const [searchTerm, setSearchTerm] = useState('')
  const options: AttributeOption[] = useOptions(fields, searchTerm)

  const field = fields[column]

  return (
    <>
      <BaseDropdown
        renderDropdownButton={buttonProps => (
          <div>
            <DropdownButton
              buttonProps={buttonProps}
              label={getAttributeLabel(field) || 'Select an attribute'}
              hasValue={!!field}
              onRemove={onRemove}
            />
          </div>
        )}
        renderMenu={({ close }) => (
          <Box
            display="flex"
            flexDirection="column"
            className={classes.menuContainer}
          >
            <Box className={classes.header}>
              <TextField
                fullWidth
                defaultValue={searchTerm}
                size="small"
                placeholder="Search a property title..."
                variant="outlined"
                onChange={e => setSearchTerm(e.target.value)}
              />
            </Box>

            <Box className={classes.body} flexGrow={1}>
              {options.map((item, key) => (
                <ListItem
                  key={key}
                  button
                  disabled={item.disabled}
                  onClick={() => {
                    close()
                    onSelect(item)
                  }}
                >
                  {item.label}
                </ListItem>
              ))}
            </Box>
          </Box>
        )}
      />
    </>
  )
}
