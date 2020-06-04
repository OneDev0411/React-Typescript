import React from 'react'
import cn from 'classnames'
import { Link } from 'react-router'
import { Typography, MenuItem, Box } from '@material-ui/core'

import TrashIcon from 'components/SvgIcons/Trash/TrashIcon'

import { isOnThisUrl } from './helpers'
import SideNavBadge from './SideNavBadge'
import SideNavTooltip from './SideNavTooltip'
import { SideNavItemProps } from './types'

function SideNavItem(props: SideNavItemProps) {
  const {
    isIndex,
    link,
    icon: Icon,
    badge,
    title,
    isSelected,
    tooltip,
    onDelete
  } = props

  // We can control the selected state from outside by using isSelected,
  // If we doesn't pass anything, it will switch to try to detect by checking
  // the url.
  // Note: isSelected is NOT available on `sections` abstraction.
  const isItemSelected = isSelected || isOnThisUrl(link, isIndex)

  return (
    <SideNavTooltip text={tooltip}>
      {/*
      // @ts-ignore component is not accepted for some reason */}
      <MenuItem
        // @ts-ignore
        to={link}
        component={Link}
        activeClassName="is-selected"
        onlyActiveOnIndex={isIndex}
        className={cn('section-item', {
          'is-selected': isItemSelected,
          'is-disabled': !link
        })}
      >
        <Box display="flex" alignItems="center">
          {Icon && (
            <Box mr={1} lineHeight={1} className="section-item__icon">
              <Icon style={{ width: '1em', height: '1em' }} />
            </Box>
          )}
          <Typography variant="body2">{title}</Typography>
          {onDelete && (
            <div
              className="section-item__delete"
              onClick={e => {
                e.stopPropagation()
                e.preventDefault()
                onDelete()
              }}
            >
              <TrashIcon size="small" />
            </div>
          )}
        </Box>
        {typeof badge !== 'undefined' ? <SideNavBadge count={badge} /> : null}
      </MenuItem>
    </SideNavTooltip>
  )
}

export default SideNavItem
