import React from 'react'

export interface DomainManagementProps {
  websiteId: IWebsite['id']
  websiteHostnames: IWebsite['hostnames']
}

function DomainManagement({ websiteHostnames }: DomainManagementProps) {
  return (
    <div>
      You current domains:
      <ul>
        {websiteHostnames.map(hostname => (
          <li key={hostname}>{hostname}</li>
        ))}
      </ul>
    </div>
  )
}

export default DomainManagement
