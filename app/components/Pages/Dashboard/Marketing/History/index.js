import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import { deleteTemplateInstance } from 'models/instant-marketing/delete-template-instance'
import TemplatesList from 'components/TemplatesList'

import { Header } from '../components/PageHeader'
import useTemplatesHistory from './useTemplatesHistory'
import EmptyState from './EmptyState'

function History(props) {
  const [templates, isLoading] = useTemplatesHistory()
  const [deletedTemplates, setDeletedTemplates] = useState([])
  // We are using this for filtering the deleted items
  const finalTemplates = templates.filter(
    template => !deletedTemplates.includes(template.id)
  )

  function handleDelete(id) {
    return deleteTemplateInstance(id).then(() => {
      setDeletedTemplates([...deletedTemplates, id])
    })
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>My Designs | Marketing | Rechat</title>
      </Helmet>
      <Header
        title="My Designs"
        style={{ padding: '0 1.5rem' }}
        isSideMenuOpen={props.isSideMenuOpen}
        toggleSideMenu={props.toggleSideMenu}
      />
      <TemplatesList
        type="history"
        items={finalTemplates}
        isLoading={isLoading}
        onDelete={handleDelete}
        emptyState={<EmptyState />}
      />
    </React.Fragment>
  )
}

export default History
