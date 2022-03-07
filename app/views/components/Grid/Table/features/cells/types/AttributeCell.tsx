import { Chip, makeStyles } from '@material-ui/core'
import { mdiClose, mdiContentCopy } from '@mdi/js'
import cn from 'classnames'

import { CellProps } from '../../../types'
import AttributeInlineEdit from '../../inline-edit/Attribute'
import { CellContainer, CellAction } from '../CellContainer'

interface Props {
  attributes: IContactAttribute[]
  onSave?: (e: any) => void
  isRowSelected?: boolean
  isSelectable?: boolean
  countEnabled?: boolean
  attributeInputPlaceholder: string
  attributeDescription: string
  attributeType: 'email' | 'phone_number'
  attributeLabel?: string
  actions?: Record<string, CellAction>
  valueFormatter?: (value: string) => string
  width: number | string
}

const useStyles = makeStyles(
  theme => ({
    attributeText: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      lineHeight: `${theme.spacing(3)}px`
    },
    attributeTextHovered: {
      color: theme.palette.tertiary.dark
    },
    attributeTextSelected: {
      color: theme.palette.primary.main
    },
    attributeTextRowSelected: {
      color: theme.palette.tertiary.dark
    },

    attributeLabel: {
      ...theme.typography.body3,
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500']
    },
    attributeLabelSelected: {
      color: theme.palette.tertiary.dark
    }
  }),
  { name: 'AttributeCell' }
)

export const AttributeCell = ({
  attributes,
  isRowSelected = false,
  isSelectable = false,
  countEnabled = false,
  attributeType,
  attributeInputPlaceholder,
  attributeDescription,
  attributeLabel = 'Main',
  valueFormatter,
  actions = {},
  width
}: Props) => {
  const classes = useStyles()

  let primaryAttribute: Nullable<string> = null
  let primaryAttributeLabel: Nullable<string> = null
  let count = 0

  const attributeActions: Record<string, CellAction> = {
    ...actions,
    copy: {
      tooltipText: 'Copy Text',
      onClick: () => console.log('copy!'),
      iconPath: mdiContentCopy
    },
    delete: {
      tooltipText: 'Delete',
      onClick: () => console.log('delete!'),
      iconPath: mdiClose
    }
  }

  const filteredAttributes = attributes.filter(attr => {
    if (!attr.is_partner && attr.attribute_type === attributeType) {
      if (attr.is_primary) {
        primaryAttribute = attr.text
        primaryAttributeLabel = attr.label || attributeLabel
      }

      return true
    }

    return false
  })

  const isEmpty = filteredAttributes.length === 0

  if (filteredAttributes.length > 0) {
    if (!primaryAttribute) {
      primaryAttribute = filteredAttributes[0].text
      primaryAttributeLabel = filteredAttributes[0].label || 'Other'
    }

    count = filteredAttributes.length
  }

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => {
    if (!primaryAttribute) {
      return null
    }

    return (
      <>
        <div
          className={cn(classes.attributeText, {
            [classes.attributeTextHovered]: isHovered,
            [classes.attributeTextSelected]: isSelected,
            [classes.attributeTextRowSelected]: isRowSelected
          })}
        >
          {valueFormatter ? valueFormatter(primaryAttribute) : primaryAttribute}
        </div>

        {primaryAttributeLabel && (
          <div
            className={cn(classes.attributeLabel, {
              [classes.attributeLabelSelected]: isSelected
            })}
          >
            {primaryAttributeLabel}
          </div>
        )}

        {countEnabled && count > 1 && (
          <Chip variant="outlined" size="small" label={`${count - 1} more`} />
        )}
      </>
    )
  }

  const renderInlineEdit = () => (
    <AttributeInlineEdit
      contactAttributes={filteredAttributes}
      attributeType={attributeType}
      attributeActions={attributeActions}
      attributeInputPlaceholder={attributeInputPlaceholder}
      attributeDescription={attributeDescription}
      valueFormatter={valueFormatter}
    />
  )

  return (
    <CellContainer
      isSelectable={isSelectable}
      actionsActivated
      actions={attributeActions}
      isEmpty={isEmpty}
      width={width}
      renderCellContent={renderCellContent}
      renderInlineEdit={renderInlineEdit}
    />
  )
}
