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
  countEnabled?: boolean
  attribute_type?: 'email' | 'phone'
  attribute_label?: string
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
        width: theme.spacing(41)
      },
      '&.email': {
        width: theme.spacing(50)
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
        borderBottomLeftRadius: theme.spacing(0.5),
        borderBottomRightRadius: theme.spacing(0.5)
      },
      '&:hover': {
        backgroundColor: theme.palette.grey[50]
      },
      '&.add-new': {
        ...theme.typography.body2,
        color: theme.palette.primary.main,
        letterSpacing: '0.15px',
        lineHeight: `${theme.spacing(3)}px`,
        height: theme.spacing(5) - 1,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottom: 'none',
        borderBottomLeftRadius: theme.spacing(0.5),
        borderBottomRightRadius: theme.spacing(0.5)
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
      flex: `0 0 ${theme.spacing(8.25)}px`,
      maxWidth: theme.spacing(8.25),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end',
      paddingLeft: theme.spacing(1)
    },
    selectLabel: {
      marginRight: 'auto'
    },
    attributeActionsContainer: {
      flex: '0 0 auto',
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),

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
      lineHeight: `${theme.spacing(5) - 1}px`,
      borderRadius: theme.spacing(0.5)
    },
    addAttributeButton: {
      ...theme.typography.body2,
      lineHeight: `${theme.spacing(3)}px`,
      alignItems: 'center',
      display: 'flex',
      textAlign: 'right',
      letterSpacing: '0.15px',
      color: theme.palette.primary.main
    }
  }),
  { name: 'Attribute-cell' }
)

const AttributeCell = ({
  attributes,
  isRowSelected = false,
  countEnabled = false,
  attribute_type,
  attribute_label = 'Main',
  actions = {}
}: Props) => {
  const classes = useStyles()

  let attribute
  let attributeLabel
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
    if (!attr.is_partner && attr.attribute_type === attribute_type) {
      if (attr.is_primary) {
        attribute = attr.text
        attributeLabel = attr.label || attribute_label
      }

      return true
    }

    return false
  })

  if (filteredAttributes.length > 0) {
    if (!attribute) {
      attribute = filteredAttributes[0].text
      attributeLabel = filteredAttributes[0].label || 'Other'
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
        {attribute && (
          <div
            className={cn(classes.attributeText, {
              hovered: isHovered,
              selected: isSelected,
              rowSelected: isRowSelected
            })}
          >
            {attribute}
          </div>
        )}

        {attributeLabel && (
          <div
            className={cn(classes.attributeLabel, {
              selected: isSelected
            })}
          >
            {attributeLabel}
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
      <Tooltip title={tooltipText} placement="bottom" key={index}>
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
    const EmptyEntry = (value, actions) => (
      <>
        <div className={classes.attributeInputContainer}>
          <TextField
            value={value}
            size="small"
            variant="standard"
            fullWidth
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

        <div className={cn(classes.attributeActionsContainer, attribute_type)}>
          {actions}
        </div>
      </>
    )

    const AttributeEntry = ({
      attribute,
      attributeIndex,
      attributeCategory = 'text'
    }: EntryProps) => {
      const value = attribute[attributeCategory]

      const entryActions: Record<string, CellAction> = omitBy(
        attributeActions,
        (v, k) => k === 'edit'
      )
      const actionButtons = Object.keys(entryActions).map((name, index) =>
        ActionButton(name, index, entryActions[name])
      )

      return (
        <div className={classes.attributeEntry} key={attributeIndex}>
          {EmptyEntry(value, actionButtons)}
        </div>
      )
    }

    const AddButton = () => (
      <div className={classes.addAttributeButton}>Add</div>
    )

    return (
      <div className={cn(classes.attributeEditWidget, attribute_type)}>
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
              {EmptyEntry('', AddButton())}
            </div>
          )}
          {filteredAttributes.length > 0 && (
            <div className={cn(classes.attributeEntry, 'add-new')}>
              Add Phone Number
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <CellContainer
      actionsActivated
      isEmpty={isEmpty}
      renderCellContent={renderCellContent}
      renderInlineEdit={renderInlineEdit}
      actions={attributeActions}
    />
  )
}

export default AttributeCell
