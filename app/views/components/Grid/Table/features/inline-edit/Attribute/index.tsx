import { useState } from 'react'

import {
  alpha,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  makeStyles,
  Menu
} from '@material-ui/core'
import { mdiChevronDown } from '@mdi/js'
import cn from 'classnames'
import { omitBy } from 'lodash'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { CellAction } from '../../cells/CellContainer'

const useStyles = makeStyles(
  theme => ({
    iconButton: {
      color: `${theme.palette.action.disabled} !important`,
      '&:hover': {
        color: `${theme.palette.tertiary.main} !important`
      }
    },
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
  { name: 'Attribute-inline-edit' }
)

const AttributeTypeMenu = () => {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        className={classes.selectButton}
        onClick={handleClick}
        endIcon={<SvgIcon path={mdiChevronDown} size={muiIconSizes.small} />}
      >
        Main
      </Button>
      <Menu
        id="demo-customized-menu"
        className={classes.menu}
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          Personal
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Work
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Other
        </MenuItem>
      </Menu>
    </>
  )
}

interface Props {
  contactAttributes: IContactAttribute[]
  attributeType: 'email' | 'phone_number'
  attributeActions: Record<string, CellAction>
  attributeInputPlaceholder: string
  attributeDescription: string
}

export default function AttributeInlineEdit({
  contactAttributes,
  attributeType,
  attributeActions,
  attributeInputPlaceholder,
  attributeDescription
}: Props) {
  const classes = useStyles()

  const [inAddMode, setInAddMode] = useState(false)

  const ActionButton = (
    title: string,
    index: number,
    { onClick, iconPath, tooltipText = '' }: CellAction
  ) => (
    <Tooltip title={tooltipText} placement="bottom" key={`${title}-${index}`}>
      <IconButton className={classes.iconButton} size="small" onClick={onClick}>
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
        <AttributeTypeMenu />
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
  }) => {
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

  const AddAttribute = () => {
    const toggleAddMode = () => setInAddMode(prevMode => !prevMode)

    const AddButton = () => (
      <div className={classes.addAttributeButton} onClick={toggleAddMode}>
        Add
      </div>
    )
    const showEntryForm = contactAttributes.length === 0 || inAddMode

    if (showEntryForm) {
      return (
        <div className={classes.attributeEntry}>
          {EntryForm('', AddButton())}
        </div>
      )
    }

    if (!showEntryForm && contactAttributes.length > 0) {
      return (
        <div
          className={cn(classes.attributeEntry, 'add-new')}
          onClick={toggleAddMode}
        >
          Add {attributeDescription}
        </div>
      )
    }
  }

  return (
    <div className={classes.attributeEditWidget}>
      <div className={cn(classes.attributeEntries, attributeType)}>
        {contactAttributes.length > 0 &&
          contactAttributes.map((attribute, attributeIndex) =>
            AttributeEntry({
              attribute,
              attributeIndex
            })
          )}
        {AddAttribute()}
      </div>
    </div>
  )
}
