import * as React from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'

import { Box, Button } from '@material-ui/core'

import Drawer from 'components/AddOrEditEmailTemplateDrawer'

import List from './List'

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
      <Box p={2} my={2}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setSelectedTemplate(null)
            setIsOpen(true)
          }}
        >
          Create New Template
        </Button>
      </Box>
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
