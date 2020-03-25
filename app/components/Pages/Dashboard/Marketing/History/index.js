import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import { deleteTemplateInstance } from 'models/instant-marketing/delete-template-instance'
import TemplatesList from 'components/TemplatesList'

import useTemplatesHistory from './useTemplatesHistory'
import EmptyState from './EmptyState'

function History() {
  const [templates, isLoading] = useTemplatesHistory()
  const [deletedTemplates, setDeletedTemplates] = useState([])
  // We are using this for filtering the deleted items
  const finalTemplates = templates.filter(
    template => !deletedTemplates.includes(template.id)
  )

  async function handleDelete(id) {
    await deleteTemplateInstance(id)
    setDeletedTemplates([...deletedTemplates, id])
  }

  return (
    <>
      <Helmet>
        <title>My Designs | Marketing | Rechat</title>
      </Helmet>
      <TemplatesList
        type="history"
        items={finalTemplates}
        isLoading={isLoading}
        onDelete={handleDelete}
        emptyState={<EmptyState />}
      />
    </>
  )
}

export default History
