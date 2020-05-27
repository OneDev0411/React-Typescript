import React from 'react'
import { Chip, Avatar, Theme, makeStyles } from '@material-ui/core'

import Link from 'components/ALink'

import { renderWithMiniContact } from './render-with-mini-contact'

interface Props {
  association: ICRMTaskAssociation
  handleRemove?: (association: ICRMTaskAssociation) => void
  isRemovable?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(0, 1, 1, 0)
  },
  avatar: {
    backgroundColor: theme.palette.grey['400'],
    color: theme.palette.grey['500']
  }
}))

function AssociationItemBase({
  association,
  isRemovable = true,
  handleRemove = association => {}
}: Props) {
  const classes = useStyles()

  if (!association.association_type) {
    return null
  }

  const record = association[association.association_type]
  const { avatar } = record
  const onRemove = () => handleRemove(association)

  return (
    <Chip
      label={
        <Link target="_blank" to={record.url} noStyle>
          {record.title}
        </Link>
      }
      onDelete={isRemovable ? onRemove : undefined}
      avatar={
        <Avatar
          className={classes.avatar}
          src={avatar.image || avatar.placeHolderImage}
        />
      }
      className={classes.root}
    />
  )
}

const AssociationItem = renderWithMiniContact(AssociationItemBase)
export { AssociationItem }
