import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'

import DomainManagementList, {
  DomainManagementListProps
} from './DomainManagementList'
import DomainManagementNewDomain, {
  DomainManagementNewDomainProps
} from './DomainManagementNewDomain'

export type DomainManagementProps = Omit<
  DomainManagementListProps,
  'onNewDomainClick' | 'className'
> &
  Pick<DomainManagementNewDomainProps, 'onDomainAdd'>

const useStyles = makeStyles(
  {
    fadeIn: {
      opacity: 0,
      animation: '$fadeIn 0.3s ease',
      animationFillMode: 'forwards'
    },
    '@keyframes fadeIn': { '100%': { opacity: 1 } }
  },
  { name: 'DomainManagement' }
)

function DomainManagement({
  websiteId,
  onDomainAdd,
  ...otherProps
}: DomainManagementProps) {
  const classes = useStyles()
  const [isNewDomainOpen, setIsNewDomainOpen] = useState(false)

  const openNewDomainForm = () => setIsNewDomainOpen(true)
  const closeNewDomainForm = () => setIsNewDomainOpen(false)

  return (
    <div>
      {isNewDomainOpen ? (
        <DomainManagementNewDomain
          className={classes.fadeIn}
          websiteId={websiteId}
          onBack={closeNewDomainForm}
          onDomainAdd={onDomainAdd}
        />
      ) : (
        <DomainManagementList
          {...otherProps}
          websiteId={websiteId}
          className={classes.fadeIn}
          onNewDomainClick={openNewDomainForm}
        />
      )}
    </div>
  )
}

export default DomainManagement
