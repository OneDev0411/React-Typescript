import classNames from 'classnames'
import { makeStyles, Typography } from '@material-ui/core'

import { withRouter, WithRouterProps } from 'react-router'

import LinkButton from '../LinkButton'

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(1, 2),
      display: 'block',
      borderRadius: 0,
      '&:focus, &:hover': {
        outline: 'none',
        color: theme.palette.primary.main
      }
    },
    selected: {
      '&&, &:focus, &:hover': {
        cursor: 'default',
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        textDecoration: 'none'
      }
    }
  }),
  { name: 'ShowingDetailTabSettingsSubjectListItem' }
)

interface ShowingDetailTabSettingsSubjectListItemProps extends WithRouterProps {
  label: string
  to: string
  selected?: boolean
}

function ShowingDetailTabSettingsSubjectListItem({
  location,
  selected = false,
  label,
  to
}: ShowingDetailTabSettingsSubjectListItemProps) {
  const classes = useStyles()

  return (
    <LinkButton
      className={classNames(classes.root, selected && classes.selected)}
      to={`${location.pathname}?tab=${to}`}
      color="primary"
    >
      <Typography variant="body1">{label}</Typography>
    </LinkButton>
  )
}

export default withRouter(ShowingDetailTabSettingsSubjectListItem)
