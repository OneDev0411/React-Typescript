import * as React from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'

import { Box } from '@material-ui/core'

import Drawer from 'components/AddOrEditEmailTemplateDrawer'

import List from './List'
import Header from './Header'

function EmailTemplatesSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [
    selectedTemplate,
    setSelectedTemplate
  ] = useState<IBrandEmailTemplate | null>(null)

  return (
    <>
      <Helmet>
        <title>Email Templates | Settings | Rechat</title>
      </Helmet>
      <Header
        handleCreateTemplate={() => {
          setSelectedTemplate(null)
          setIsOpen(true)
        }}
      />
      <Box p={3} pt={0}>
        <List
          onItemClick={(template: IBrandEmailTemplate) => {
            setSelectedTemplate(template)
            setIsOpen(true)
          }}
        />
      </Box>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        emailTemplate={selectedTemplate}
      />
    </>
  )
}

export default EmailTemplatesSettings
