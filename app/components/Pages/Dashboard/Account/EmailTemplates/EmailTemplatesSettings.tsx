import * as React from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'

import Drawer from 'components/AddOrEditEmailTemplateDrawer'

import CtaBar from '../components/CtaBar'
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

      <CtaBar
        label="Create new email template"
        description=""
        onClick={() => {
          setSelectedTemplate(null)
          setIsOpen(true)
        }}
      />

      <List
        onItemClick={(template: IBrandEmailTemplate) => {
          setSelectedTemplate(template)
          setIsOpen(true)
        }}
      />

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        emailTemplate={selectedTemplate}
      />
    </>
  )
}

export default EmailTemplatesSettings
