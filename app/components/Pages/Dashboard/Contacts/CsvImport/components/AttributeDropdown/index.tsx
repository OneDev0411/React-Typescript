import { useState } from 'react'

import {
  Box,
  Button,
  ListItem,
  makeStyles,
  TextField,
  Theme
} from '@material-ui/core'

import { BaseDropdown } from '@app/views/components/BaseDropdown'

import { useAttributeLabel } from '../../hooks/use-attribute-label'
import type { AttributeOption, IAttribute } from '../../types'

import { useOptions } from './use-attribute-options'

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
  fields: Record<string, IAttribute>
  column: string
  onSelect: (attribute: AttributeOption) => void
}

export function AttributeDropdown({ fields, column, onSelect }: Props) {
  const classes = useStyles()
  const getAttributeLabel = useAttributeLabel()

  const [searchTerm, setSearchTerm] = useState('')
  const options = useOptions(fields, searchTerm)

  const field = fields[column]

  return (
    <BaseDropdown
      renderDropdownButton={buttonProps => (
        <div {...buttonProps}>{getAttributeLabel(field)}</div>
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
                onClick={() => {
                  close()
                  onSelect(item)
                }}
              >
                {item.label}
              </ListItem>
            ))}
          </Box>

          <Box
            className={classes.footer}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button variant="contained" color="primary" size="small">
              Add custom field
            </Button>
          </Box>
        </Box>
      )}
    />
  )
}
