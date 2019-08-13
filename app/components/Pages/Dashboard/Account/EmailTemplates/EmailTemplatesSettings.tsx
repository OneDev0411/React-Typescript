import * as React from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'

import List from './List'
import Header from './Header'
import Drawer from 'components/AddOrEditEmailTemplateDrawer'

function EmailTemplatesSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(undefined)

  return (
    <>
      <Helmet>
        <title>Email Templates | Settings | Rechat</title>
      </Helmet>
      <Header handleCreateTemplate={() => setIsOpen(true)} />
      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        <List
          handleOnClickRow={
            template => {
              setSelectedTemplate(template)
              setIsOpen(true)
            }}
        />
      </div>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        emailTemplate={selectedTemplate}
      />
    </>
  )
}

export default EmailTemplatesSettings
