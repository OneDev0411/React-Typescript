import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core'
import {
  mdiOpenInNew,
  mdiContentCopy,
  mdiEmailOutline,
  mdiPencilOutline,
  mdiTrashCanOutline,
  mdiPlusCircleOutline
} from '@mdi/js'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { SingleEmailComposeDrawer } from 'components/EmailCompose'
import { addNotification as notify } from 'components/notification'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { normalizeContactsForEmailCompose } from 'models/email/helpers/normalize-contact'
import copy from 'utils/copy-text-to-clipboard'
import { noop } from 'utils/helpers'

import {
  Label,
  Value,
  ViewModeContainer,
  ViewModeActionBar
} from '../../styled'

const useStyles = makeStyles(
  theme => ({
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
  }),
  { name: 'InlineEditFieldViewMode' }
)

ViewMode.propTypes = {
  label: PropTypes.string,
  showAdd: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  style: PropTypes.shape(),
  showEdit: PropTypes.bool,
  isPartner: PropTypes.bool,
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
  isPartner,
  showDelete,
  toggleMode,
  renderBody,
  handleAddNew,
  handleDelete,
  attributeName
}) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false)

  const getEmailRecipient = () => {
    if (!contact) {
      return [
        {
          recipient_type: 'Email',
          email: value
        }
      ]
    }

    if (isPartner) {
      return [
        {
          recipient_type: 'Email',
          email: value,
          contact: {
            partner_email: value,
            display_name: contact.partner_name,
            partner_name: contact.partner_name
          }
        }
      ]
    }

    return normalizeContactsForEmailCompose([contact])
  }

  const handleOpenEmailDrawer = e => {
    e.stopPropagation()
    setIsEmailDrawerOpen(true)
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

    let url = value

    if (!url.match(/^http(s?)?:\/\//i)) {
      url = `http://${url}`
    }

    window.open(url, '_blank')
  }

  const renderActions = () => {
    const actions = []

    if (value && linkableAttribute.includes(attributeName)) {
      actions.push(
        <div
          key={`open-${value}`}
          onClick={handleLink}
          className={classes.action}
        >
          <SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Open</span>
        </div>
      )
    }

    if (value && attributeName === 'email') {
      actions.push(
        <div
          key={`email-${value}`}
          onClick={handleOpenEmailDrawer}
          className={classes.action}
        >
          <SvgIcon path={mdiEmailOutline} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Email</span>
        </div>
      )
    }

    if (value && copyAttribute.includes(attributeName)) {
      actions.push(
        <div
          key={`copy-${value}`}
          onClick={handleCopy}
          className={classes.action}
        >
          <SvgIcon path={mdiContentCopy} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Copy</span>
        </div>
      )
    }

    if (showDelete) {
      actions.push(
        <div
          key={`handleDelete-${value}"`}
          onClick={handleDelete}
          className={classes.action}
        >
          <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Delete</span>
        </div>
      )
    }

    if (showEdit) {
      actions.push(
        <div
          key={`showEdit-${value}`}
          onClick={toggleMode}
          className={classes.action}
        >
          <SvgIcon path={mdiPencilOutline} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Edit</span>
        </div>
      )
    }

    if (showAdd) {
      actions.push(
        <div
          key={`showAdd-${value}`}
          onClick={handleAddNew}
          className={classes.action}
        >
          <SvgIcon path={mdiPlusCircleOutline} size={muiIconSizes.small} />
          <span className={classes.actionLabel}>Add</span>
        </div>
      )
    }

    return actions
  }

  return (
    <>
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
          <div className={classes.actionContainer}>{renderActions()}</div>
        </ViewModeActionBar>
      </ViewModeContainer>
      {value && attributeName === 'email' && isEmailDrawerOpen && (
        <SingleEmailComposeDrawer
          isOpen={isEmailDrawerOpen}
          initialValues={{
            attachments: [],
            to: getEmailRecipient()
          }}
          onClose={() => setIsEmailDrawerOpen(false)}
          onSent={() => setIsEmailDrawerOpen(false)}
        />
      )}
    </>
  )
}
