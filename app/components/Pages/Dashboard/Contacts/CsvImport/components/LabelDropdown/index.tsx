import { Box, ListItem } from '@material-ui/core'

import { BaseDropdown } from '@app/views/components/BaseDropdown'

import { useAttributeDefs } from '../../hooks/use-attribute-defs'
import type { IAttribute, MappedField } from '../../types'
import { DropdownButton } from '../DropdownButton'

import { useLabelOptions } from './use-label-options'

interface Props {
  fields: Record<string, Nullable<MappedField>>
  column: string
  onSelect: (label: string) => void
  onRemove: () => void
}

export function LabelDropdown({ fields, column, onSelect, onRemove }: Props) {
  const field = fields[column]

  const { byId } = useAttributeDefs()
  const options = useLabelOptions(field)

  const hasLabel = (attribute: IAttribute) => {
    if (attribute.type === 'attribute_type') {
      return false
    }

    return byId[attribute.attribute_def].has_label
  }

  if (!field || !hasLabel(field) || options.length === 0) {
    return null
  }

  return (
    <BaseDropdown
      renderDropdownButton={buttonProps => (
        <DropdownButton
          buttonProps={buttonProps}
          label={field.label ?? 'Select a label'}
          hasValue={!!field?.label}
          onRemove={onRemove}
        />
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
