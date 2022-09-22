import * as React from 'react'
import { useState } from 'react'

import { useTitle } from 'react-use'

import Drawer from 'components/AddOrEditEmailTemplateDrawer'

import CtaBar from '../components/CtaBar'

import List from './List'

function EmailTemplatesSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] =
    useState<Nullable<IBrandEmailTemplate>>(null)

  useTitle('Email Templates | Settings | Rechat')

  return (
    <>
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
