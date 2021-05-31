import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Box, makeStyles } from '@material-ui/core'

import {
  mdiOpenInNew,
  mdiContentCopy,
  mdiEmailOutline,
  mdiPencilOutline,
  mdiTrashCanOutline,
  mdiPlusCircleOutline
} from '@mdi/js'

import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'

import { addNotification as notify } from 'components/notification'
import SendEmailButton from 'components/SendEmailButton'

import copy from 'utils/copy-text-to-clipboard'

import { noop } from 'utils/helpers'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import {
  Label,
  Value,
  ViewModeContainer,
  ViewModeActionBar
} from '../../styled'

const useStyles = makeStyles(theme => ({
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background.paper,
    padding: theme.spacing(0.5),
    borderRadius: `${theme.shape.borderRadius}px`,
    boxShadow:
      '0px 0px 8px rgba(0, 0, 0, 0.25), 0px 16px 16px -8px rgba(0, 0, 0, 0.25)'
  },
  action: {
    padding: theme.spacing(0, 2),
    background: theme.palette.background.paper,
    borderRadius: `${theme.shape.borderRadius}px`,
    textAlign: 'center',
    color: theme.palette.grey[800],
    '& svg': {
      color: theme.palette.grey[800],
      margin: 'auto'
    },
    '&:hover': {
      background: theme.palette.action.hover,
      textDecoration: 'none'
    }
  },
  actionLabel: {
    display: 'block',
    color: theme.palette.grey[800],
    ...theme.typography.caption
  }
}))

ViewMode.propTypes = {
  label: PropTypes.string,
  showAdd: PropTypes.bool,
  value: PropTypes.string,
  style: PropTypes.shape(),
  showEdit: PropTypes.bool,
  contact: PropTypes.shape(),
  showDelete: PropTypes.bool,
  renderBody: PropTypes.func,
  handleAddNew: PropTypes.func,
  handleDelete: PropTypes.func,
  attributeName: PropTypes.string,
  toggleMode: PropTypes.func.isRequired
}

ViewMode.defaultProps = {
  handleAddNew: noop,
  label: 'Label',
  renderBody: noop,
  showAdd: false,
  showEdit: true,
  showDelete: true,
  style: {},
  value: '-'
}

const linkableAttribute = ['website', 'facebook', 'instagram', 'linkedin']
const copyAttribute = [
  ...linkableAttribute,
  'email',
  'first_name',
  'middle_name',
  'last_name',
  'nickname',
  'job_title',
  'company',
  'marketing_name'
]

export function ViewMode({
  label,
  style,
  value,
  contact,
  showAdd,
  showEdit,
  showDelete,
  toggleMode,
  renderBody,
  handleAddNew,
  handleDelete,
  attributeName
}) {
  const dispatch = useDispatch()
  const classes = useStyles()

  const getEmailRecipient = () => {
    console.log({ value, attributeName, contact })

    if (!contact || contact.email !== value) {
      return [
        {
          recipient_type: 'Email',
          email: value
        }
      ]
    }

    return normalizeContactsForEmailCompose([contact])
  }

  const handleCopy = e => {
    e.stopPropagation()

    copy(value)
    dispatch(
      notify({
        message: 'Copied',
        status: 'success'
      })
    )
  }

  const handleLink = e => {
    e.stopPropagation()

    window.open(value, '_blank')
  }

  const renderActions = () => {
    const actions = []

    if (value && linkableAttribute.includes(attributeName)) {
      actions.push(
        <Box key="open" onClick={handleLink} className={classes.action}>
          <SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Open</span>
        </Box>
      )
    }

    if (value && attributeName === 'email') {
      actions.push(
        <SendEmailButton
          recipients={getEmailRecipient()}
          render={({ onClick }) => (
            <Box
              key="email"
              onClick={e => {
                e.stopPropagation()
                onClick()
              }}
              className={classes.action}
            >
              <SvgIcon path={mdiEmailOutline} size={muiIconSizes.small} />
              <span className={classes.actionLabel}>Email</span>
            </Box>
          )}
        />
      )
    }

    if (value && copyAttribute.includes(attributeName)) {
      actions.push(
        <Box key="copy" onClick={handleCopy} className={classes.action}>
          <SvgIcon path={mdiContentCopy} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Copy</span>
        </Box>
      )
    }

    if (showDelete) {
      actions.push(
        <Box
          key="handleDelete"
          onClick={handleDelete}
          className={classes.action}
        >
          <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Delete</span>
        </Box>
      )
    }

    if (showEdit) {
      actions.push(
        <Box key="showEdit" onClick={toggleMode} className={classes.action}>
          <SvgIcon path={mdiPencilOutline} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Edit</span>
        </Box>
      )
    }

    if (showAdd) {
      actions.push(
        <Box key="showEdit" onClick={handleAddNew} className={classes.action}>
          <SvgIcon path={mdiPlusCircleOutline} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Add</span>
        </Box>
      )
    }

    return actions
  }

  return (
    <ViewModeContainer onClick={toggleMode} style={style}>
      {renderBody() == null ? (
        <React.Fragment>
          <Label>{label}</Label>
          <Value>{value}</Value>
        </React.Fragment>
      ) : (
        renderBody({ label, value, toggleMode })
      )}
      <ViewModeActionBar className="action-bar">
        <Box className={classes.actionContainer}>{renderActions()}</Box>
      </ViewModeActionBar>
    </ViewModeContainer>
  )
}
