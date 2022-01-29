import {
  alpha,
  Chip,
  IconButton,
  makeStyles,
  TextField,
  Tooltip
} from '@material-ui/core'
import { mdiClose, mdiContentCopy } from '@mdi/js'
import cn from 'classnames'

import CellContainer, {
  CellAction,
  InlineProps
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
}
interface EntryProps {
  attribute: IContactAttribute
  attributeIndex: number
  attributeCategory?: 'text' | 'date' | 'number'
  actions: Record<string, CellAction>
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

    iconButton: {},
    attributeEditWidget: {
      boxSizing: 'border-box',
      boxShadow: `
        0px 0.3px 0.5px ${alpha(theme.palette.secondary.dark, 0.1)},
        0px 2px 4px ${alpha(theme.palette.secondary.dark, 0.2)}
      `,
      borderRadius: theme.spacing(0.5),
      border: `1px solid ${theme.palette.primary.main}`,
      background: theme.palette.background.paper,
      width: theme.spacing(41),
      position: 'absolute',
      zIndex: 10,
      left: 0,
      top: 0
    },
    attributeEntries: {},
    attributeEntry: {
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5),
      height: theme.spacing(5),
      display: 'flex',
      flexDirection: 'row',
      paddingRight: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:first-child': {
        height: theme.spacing(5) - 1
      },
      '&:hover': {
        backgroundColor: theme.palette.grey[50]
      }
    },
    addNewAttribute: {
      ...theme.typography.body2,

      height: theme.spacing(5),
      lineHeight: `${theme.spacing(3)}px`,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',

      borderBottomLeftRadius: theme.spacing(0.5),
      borderBottomRightRadius: theme.spacing(0.5),

      letterSpacing: '0.15px',
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.grey[50]
      }
    },
    attributeInputContainer: {
      flex: '0 0 auto',
      minWidth: theme.spacing(20.375),
      borderRadius: theme.spacing(0.5)
    },
    attributeTypeSelect: {
      ...theme.typography.body2,
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      flex: `0 0 ${theme.spacing(8.25)}px`,
      maxWidth: theme.spacing(8.25),
      display: 'flex',
      alignItems: 'center'
    },
    attributeActionsContainer: {
      flex: `0 0 ${theme.spacing(12.375)}px`,
      minWidth: theme.spacing(8.25),

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end',
      gap: theme.spacing(1),
      paddingRight: theme.spacing(2),
      color: 'grey'
    },
    textField: {
      ...theme.typography.body2,
      letterSpacing: '0.15px',
      paddingLeft: theme.spacing(2),
      lineHeight: `${theme.spacing(5) - 1}px`,
      borderRadius: theme.spacing(0.5)
    },
    addAttributeButton: {}
  }),
  { name: 'Attribute-cell' }
)

const AttributeCell = ({
  attributes,
  isRowSelected = false,
  countEnabled = false,
  attribute_type,
  attribute_label = 'Main'
}: Props) => {
  const classes = useStyles()

  let attribute
  let attributeLabel
  let count = 0

  //--

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

  const renderAction = (
    title: string,
    index: number,
    { onClick, iconPath }: CellAction
  ) => (
    <Tooltip title={title} placement="bottom" key={index}>
      <IconButton className={classes.iconButton} size="small" onClick={onClick}>
        <SvgIcon path={iconPath} size={muiIconSizes.small} />
      </IconButton>
    </Tooltip>
  )

  const setFieldValue = value => console.log(value)

  const renderEmptyEntry = (value, actions) => (
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

      <div className={classes.attributeTypeSelect}>Main</div>

      <div className={classes.attributeActionsContainer}>{actions}</div>
    </>
  )

  const renderAttributeEntry = ({
    attribute,
    attributeIndex,
    attributeCategory = 'text',
    actions
  }: EntryProps) => {
    const value = attribute[attributeCategory]
    const cellActions = Object.keys(actions).map((name, index) =>
      renderAction(name, index, actions[name])
    )

    return (
      <div className={classes.attributeEntry} key={attributeIndex}>
        {renderEmptyEntry(value, cellActions)}
      </div>
    )
  }

  const AddButton = () => <div className={classes.addAttributeButton}>Add</div>

  const renderInlineEdit = ({ actions }: InlineProps) => (
    <div className={classes.attributeEditWidget}>
      <div className={classes.attributeEntries}>
        {filteredAttributes.length > 0 &&
          filteredAttributes.map((attribute, attributeIndex) =>
            renderAttributeEntry({
              attribute,
              attributeIndex,
              actions
            })
          )}
        {filteredAttributes.length === 0 && (
          <div className={classes.attributeEntry}>
            {renderEmptyEntry(null, AddButton())}
          </div>
        )}
      </div>
      {filteredAttributes.length > 0 && (
        <div className={classes.addNewAttribute}>Add Phone Number</div>
      )}
    </div>
  )

  const actions: Record<string, CellAction> = {
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

  return (
    <CellContainer
      actionsActivated
      renderCellContent={renderCellContent}
      renderInlineEdit={renderInlineEdit}
      actions={actions}
    />
  )
}

export default AttributeCell
