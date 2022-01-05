import { Box, ListItem } from '@material-ui/core'

import { BaseDropdown } from '@app/views/components/BaseDropdown'

import { useAttributeDefs } from '../../hooks/use-attribute-defs'
import type { IAttribute, MappedField } from '../../types'

import { useLabelOptions } from './use-label-options'

interface Props {
  fields: Record<string, MappedField>
  column: string
  onSelect: (label: Nullable<string>) => void
}

export function LabelDropdown({ fields, column, onSelect }: Props) {
  const field = fields[column]

  const { byId } = useAttributeDefs()
  const options = useLabelOptions(field)

  const hasLabel = (attribute: IAttribute) => {
    if (attribute.type === 'attribute_type') {
      return false
    }

    return byId[attribute.attributeDefId].has_label
  }

  if (!field || !hasLabel(field)) {
    return null
  }

  return (
    <BaseDropdown
      renderDropdownButton={buttonProps => (
        <div {...buttonProps}>Select Label</div>
      )}
      renderMenu={({ close }) => (
        <Box>
          {options.map((label, key) => (
            <ListItem
              key={key}
              button
              onClick={() => {
                close()
                onSelect(label)
              }}
            >
              {label}
            </ListItem>
          ))}
        </Box>
      )}
    />
  )
}
