import React from 'react'
import { Button } from '@material-ui/core'

import DomainManagementList, {
  DomainManagementListProps
} from './DomainManagementList'
import DomainManagementTitle from './DomainManagementTitle'

export interface DomainManagementProps extends DomainManagementListProps {
  websiteTitle?: IWebsite['title']
}

function DomainManagement({
  websiteTitle,
  ...otherProps
}: DomainManagementProps) {
  return (
    <div>
      {websiteTitle && <DomainManagementTitle title={websiteTitle} />}
      <DomainManagementList {...otherProps} />
      <Button variant="contained" color="primary" fullWidth size="large">
        Add New Domain
      </Button>
    </div>
  )
}

export default DomainManagement
