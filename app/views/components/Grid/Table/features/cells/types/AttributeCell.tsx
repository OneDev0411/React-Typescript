import {
  alpha,
  Chip,
  IconButton,
  makeStyles,
  TextField,
  Tooltip
} from '@material-ui/core'
import { mdiChevronDown, mdiClose, mdiContentCopy } from '@mdi/js'
import cn from 'classnames'
import { omitBy } from 'lodash'

import CellContainer, {
  CellAction
} from '@app/views/components/Grid/Table/features/cells/CellContainer'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { CellProps } from '../../../types'

interface Props {
  attributes: IContactAttribute[]
  onSave?: (e: any) => void
  isRowSelected?: boolean
  isSelectable?: boolean
  countEnabled?: boolean
  attributeInputPlaceholder?: string
  attributeDescription: string
  attributeType: 'email' | 'phone_number'
  attributeLabel?: string
  actions?: Record<string, CellAction>
}
interface EntryProps {
  attribute: IContactAttribute
  attributeIndex: number
  attributeCategory?: 'text' | 'date' | 'number'
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
      top: 0,

      '&.phone_number': {
        minWidth: theme.spacing(41)
      },
      '&.email': {
        minWidth: theme.spacing(50)
      }
    },
    attributeEntries: {
      display: 'flex',
      flexDirection: 'column'
    },
    attributeEntry: {
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5),
      height: theme.spacing(5),
      display: 'flex',
      flexDirection: 'row',
      borderBottom: `1px solid ${theme.palette.divider}`,
      justifyContent: 'flex-end',

      '&:first-child': {
        height: theme.spacing(5) - 1
      },
      '&:last-child': {
        height: theme.spacing(5) - 1,
        borderBottomLeftRadius: theme.spacing(0.5),
        borderBottomRightRadius: theme.spacing(0.5)
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
      paddingLeft: theme.spacing(2),
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
      paddingLeft: theme.spacing(2),
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
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.primary.main,
      display: 'flex',
      alignItems: 'center'
    }
  }),
  { name: 'Attribute-cell' }
)

const AttributeCell = ({
  attributes,
  isRowSelected = false,
  isSelectable = false,
  countEnabled = false,
  attributeInputPlaceholder,
  attributeDescription,
  attributeType,
  attributeLabel = 'Main',
  actions = {}
}: Props) => {
  const classes = useStyles()

  let primaryAttribute
  let primaryAttributeLabel
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
    return (
      <>
        {!!primaryAttribute && (
          <div
            className={cn(classes.attributeText, {
              hovered: isHovered,
              selected: isSelected,
              rowSelected: isRowSelected
            })}
          >
            {primaryAttribute}
          </div>
        )}

        {!!primaryAttributeLabel && (
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

  const renderInlineEdit = () => {
    const ActionButton = (
      title: string,
      index: number,
      { onClick, iconPath, tooltipText = '' }: CellAction
    ) => (
      <Tooltip title={tooltipText} placement="bottom" key={`${title}-${index}`}>
        <IconButton
          className={classes.iconButton}
          size="small"
          onClick={onClick}
        >
          <SvgIcon path={iconPath} size={muiIconSizes.small} />
        </IconButton>
      </Tooltip>
    )

    const setFieldValue = value => console.log(value)
    const EntryForm = (value, actions) => (
      <>
        <div className={classes.attributeInputContainer}>
          <TextField
            value={value}
            size="small"
            variant="standard"
            fullWidth
            placeholder={attributeInputPlaceholder}
            onChange={e => setFieldValue(e.target.value)}
            style={{
              flexDirection: 'row',
              height: '100%'
            }}
            InputProps={{
              disableUnderline: true,
              className: classes.textField
            }}
          />
        </div>

        <div className={classes.attributeTypeSelect}>
          <div className={classes.selectLabel}>Main</div>
          <SvgIcon path={mdiChevronDown} size={muiIconSizes.small} />
        </div>

        <div className={cn(classes.attributeActionsContainer, attributeType)}>
          {actions}
        </div>
      </>
    )

    const AttributeEntry = ({
      attribute,
      attributeIndex,
      attributeCategory = 'text'
    }: EntryProps) => {
      const entryActions: Record<string, CellAction> = omitBy(
        attributeActions,
        (v, k) => k === 'edit'
      )
      const actionButtons = Object.keys(entryActions).map((name, index) =>
        ActionButton(name, index, entryActions[name])
      )

      return (
        <div className={classes.attributeEntry} key={attributeIndex}>
          {EntryForm(attribute[attributeCategory], actionButtons)}
        </div>
      )
    }

    const AddButton = () => (
      <div className={classes.addAttributeButton}>Add</div>
    )

    return (
      <div className={cn(classes.attributeEditWidget, attributeType)}>
        <div className={classes.attributeEntries}>
          {filteredAttributes.length > 0 &&
            filteredAttributes.map((attribute, attributeIndex) =>
              AttributeEntry({
                attribute,
                attributeIndex
              })
            )}
          {filteredAttributes.length === 0 && (
            <div className={classes.attributeEntry}>
              {EntryForm('', AddButton())}
            </div>
          )}
          {filteredAttributes.length > 0 && (
            <div className={cn(classes.attributeEntry, 'add-new')}>
              Add {attributeDescription}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <CellContainer
      isSelectable={isSelectable}
      actionsActivated
      isEmpty={isEmpty}
      renderCellContent={renderCellContent}
      renderInlineEdit={renderInlineEdit}
      actions={attributeActions}
    />
  )
}

export default AttributeCell
