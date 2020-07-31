import React from 'react'
import { Modal } from 'react-bootstrap'
import { mdiCheck } from '@mdi/js'
import { makeStyles } from '@material-ui/styles'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    checkIcon: {
      margin: theme.spacing(3, 0, 0, 1)
    },
    bellIcon: {
      height: '5rem',
      margin: theme.spacing(2, 0, 0, 1)
    }
  }),
  { name: 'SuccessModal' }
)

const Icon = ({ type }) => {
  const classes = useStyles()

  switch (type) {
    case 'SAVED_ALERT':
      return (
        <img
          alt="bell"
          className={classes.bellIcon}
          src="/static/images/dashboard/mls/alert-bell-saved.svg"
        />
      )
    default:
      return (
        <SvgIcon path={mdiCheck} className={classes.checkIcon} size="6rem" />
      )
  }
}

const SuccessModal = ({ isActive, type, text }) => (
  <Modal dialogClassName="c-success-modal" show={isActive}>
    <div className="c-success-modal__body">
      <span className="c-success-modal__icon">
        <Icon type={type} />
      </span>
      <div style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>{text}</div>
    </div>
  </Modal>
)

export default SuccessModal
