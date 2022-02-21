import { useEffect, useState } from 'react'

import {
  TextField,
  alpha,
  makeStyles,
  Button,
  MenuItem,
  Menu
} from '@material-ui/core'
import { mdiChevronDown } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
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
  { name: 'Attribute-inline-form' }
)

interface Props {
  value: string
  label: string
  type: 'email' | 'phone_number'
  actions: React.ReactNode
  inputPlaceholder: string
}

export default function EntryInlineForm({
  value,
  label,
  type,
  actions,
  inputPlaceholder
}: Props) {
  const classes = useStyles()

  const [fieldAttrText, setFieldAttrText] = useState('')
  const [fieldAttrLabel, setFieldAttrLabel] = useState('')

  useEffect(() => {
    setFieldAttrText(value)
    setFieldAttrLabel(label)
  }, [value, label])

  return (
    <>
      <div className={classes.attributeInputContainer}>
        <TextField
          value={fieldAttrText}
          size="small"
          variant="standard"
          fullWidth
          placeholder={inputPlaceholder}
          onChange={e => setFieldAttrText(e.target.value)}
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
        <AttributeLabelMenu attributeLabel={fieldAttrLabel} />
      </div>

      <div className={cn(classes.attributeActionsContainer, type)}>
        {actions}
      </div>
    </>
  )
}

const AttributeLabelMenu = ({ attributeLabel }) => {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClose = () => setAnchorEl(null)
  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)

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
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
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
