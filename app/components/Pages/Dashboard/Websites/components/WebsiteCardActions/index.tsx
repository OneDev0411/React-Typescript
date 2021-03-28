import React, { ReactNode } from 'react'
import cn from 'classnames'

import { Button } from '@material-ui/core'

import { useIconStyles } from 'views/../styles/use-icon-styles'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'
import SiteLinkIcon from 'components/SvgIcons/SiteLink/SiteLinkIcon'

import useStyles from './styles'

interface WebsiteCardActionsProps {
  className?: string
  link: string
  onEdit: () => void
  onDelete: () => void
  children: ReactNode
}

function WebsiteCardActions({
  className,
  link,
  onEdit,
  onDelete,
  children
}: WebsiteCardActionsProps) {
  const iconClasses = useIconStyles()
  const classes = useStyles()

  return (
    <div className={cn(classes.root, className)}>
      <div>
        <Button
          color="primary"
          variant="contained"
          size="small"
          className={cn(classes.button, classes.linkButton)}
          href={link}
          target="_blank"
        >
          <SiteLinkIcon
            fillColor="#fff"
            className={cn(iconClasses.small, iconClasses.rightMargin)}
          />
          Go To Site
        </Button>

        <Button
          color="secondary"
          variant="contained"
          size="small"
          className={classes.transparentButton}
          onClick={onEdit}
          type="button"
        >
          <EditIcon
            fill="#fff"
            className={cn(iconClasses.small, iconClasses.rightMargin)}
          />
          Edit
        </Button>
      </div>

      {children}
    </div>
  )
}

export default WebsiteCardActions
