import { alpha, Chip, makeStyles } from '@material-ui/core'
import { mdiClose, mdiContentCopy } from '@mdi/js'
import cn from 'classnames'

import CellContainer, {
  CellAction
} from '@app/views/components/Grid/Table/features/cells/CellContainer'

import { CellProps } from '../../../types'
import AttributeInlineEdit from '../../inline-edit/Attribute'

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
}

const useStyles = makeStyles(
  theme => ({
    attributeText: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      '&.hovered': {
        color: theme.palette.tertiary.dark
      },
      '&.selected': {
        color: theme.palette.primary.main
      },
      '&.rowSelected': {
        color: theme.palette.tertiary.dark
      }
    },
    attributeLabel: {
      ...theme.typography.body3,
      letterSpacing: '0.4px',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500'],
      '&.selected': {
        color: theme.palette.tertiary.dark
      }
    },
    chip: {
      letterSpacing: '0.2px'
    },

    iconButton: {
      color: `${theme.palette.action.disabled} !important`,
      '&:hover': {
        color: `${theme.palette.tertiary.main} !important`
      }
    },

    //---

    attributeEditWidget: {
      boxSizing: 'border-box',
      boxShadow: `
        0px 0.3px 0.5px ${alpha(theme.palette.secondary.dark, 0.1)},
        0px 2px 4px ${alpha(theme.palette.secondary.dark, 0.2)}
      `,
      borderRadius: theme.spacing(0.5),
      border: `1px solid ${theme.palette.primary.main}`,
      background: theme.palette.background.paper,
      position: 'absolute',
      zIndex: 10,
      left: 0,
      top: 0
    },
    attributeEntries: {
      display: 'flex',
      flexDirection: 'column',

      '&.phone_number': {
        minWidth: theme.spacing(42.75)
      },
      '&.email': {
        minWidth: theme.spacing(50)
      }
    },
    attributeEntry: {
      display: 'flex',
      flexDirection: 'row',
      borderBottom: `1px solid ${theme.palette.divider}`,
      justifyContent: 'flex-end',
      gap: theme.spacing(0.5),
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5),
      height: theme.spacing(5),

      '&:first-child': {
        height: theme.spacing(5) - 1
      },
      '&:last-child': {
        height: theme.spacing(5) - 1,
        borderBottomLeftRadius: theme.spacing(0.5),
        borderBottomRightRadius: theme.spacing(0.5),
        borderBottom: 'none'
      },
      '&:only-child': {
        height: theme.spacing(5) - 2
      },
      '&:hover': {
        backgroundColor: theme.palette.grey[50]
      },
      '&.add-new': {
        ...theme.typography.body2,
        color: theme.palette.primary.main,
        letterSpacing: '0.15px',
        lineHeight: `${theme.spacing(3)}px`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: 'none'
      }
    },
    attributeInputContainer: {
      flex: '1 0 auto',
      borderRadius: theme.spacing(0.5)
    },
    attributeTypeSelect: {
      ...theme.typography.body2,
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      flex: '0 0 auto',
      minWidth: theme.spacing(8.25),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end'
    },
    selectLabel: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    attributeActionsContainer: {
      paddingRight: theme.spacing(2),
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end',
      gap: theme.spacing(1),
      color: 'grey',
      minWidth: theme.spacing(10),

      '&.email': {
        minWidth: theme.spacing(14.25)
      }
    },
    textField: {
      ...theme.typography.body2,
      letterSpacing: '0.15px',
      paddingLeft: theme.spacing(2) - 1,
      lineHeight: 'inherit',
      borderRadius: theme.spacing(0.5)
    },
    addAttributeButton: {
      ...theme.typography.body2,
      letterSpacing: '0.15px',
      textAlign: 'right',
      minWidth: theme.spacing(7),
      justifyContent: 'right',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.primary.main,
      display: 'flex',
      alignItems: 'center'
    },
    menu: {
      '& .MuiPaper-root': {
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(0.5),
        minWidth: theme.spacing(20),
        boxShadow: `
          0px 0.3px 0.5px ${alpha(theme.palette.secondary.dark, 0.1)},
          0px 2px 4px ${alpha(theme.palette.secondary.dark, 0.2)}
        `,

        '& .MuiMenu-list': {
          ...theme.typography.body2,
          padding: '4px 0'
        },
        '& .MuiMenuItem-root': {
          ...theme.typography.body2,

          '& .MuiSvgIcon-root': {
            color: theme.palette.text.secondary,
            marginRight: theme.spacing(1.5)
          },
          '&:active': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity
            )
          }
        }
      }
    },
    selectButton: {
      ...theme.typography.body2
    }
  }),
  { name: 'Attribute-cell' }
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
  actions = {}
}: Props) => {
  const classes = useStyles()

  let primaryAttribute: Nullable<string> = null
  let primaryAttributeLabel: Nullable<string> = null
  let count = 0

  //--

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

  if (filteredAttributes.length > 0) {
    if (!primaryAttribute) {
      primaryAttribute = filteredAttributes[0].text
      primaryAttributeLabel = filteredAttributes[0].label || 'Other'
    }

    count = filteredAttributes.length
  }

  const isEmpty = filteredAttributes.length === 0

  //--

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
            hovered: isHovered,
            selected: isSelected,
            rowSelected: isRowSelected
          })}
        >
          {valueFormatter ? valueFormatter(primaryAttribute) : primaryAttribute}
        </div>

        {primaryAttributeLabel && (
          <div
            className={cn(classes.attributeLabel, {
              selected: isSelected
            })}
          >
            {primaryAttributeLabel}
          </div>
        )}

        {countEnabled && count > 1 && (
          <Chip
            className={classes.chip}
            variant="outlined"
            size="small"
            label={`${count - 1} more`}
          />
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
    />
  )

  return (
    <CellContainer
      isSelectable={isSelectable}
      actionsActivated
      actions={attributeActions}
      isEmpty={isEmpty}
      renderCellContent={renderCellContent}
      renderInlineEdit={renderInlineEdit}
    />
  )
}
