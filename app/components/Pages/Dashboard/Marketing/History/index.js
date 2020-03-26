import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import { useInfiniteScroll } from 'hooks/use-infinite-scroll'
import { deleteTemplateInstance } from 'models/instant-marketing/delete-template-instance'

import TemplatesList from 'components/TemplatesList'

import useTemplatesHistory from './useTemplatesHistory'
import EmptyState from './EmptyState'

const PAGE_SIZE = 12

function History() {
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [templates, isLoading] = useTemplatesHistory()
  const [deletedTemplates, setDeletedTemplates] = useState([])
  // We are using this for filtering the deleted items
  const finalTemplates = templates
    .filter(template => !deletedTemplates.includes(template.id))
    .slice(0, limit)

  const loadNextPage = () => setLimit(limit => limit + PAGE_SIZE)

  useInfiniteScroll({
    accuracy: 400, // px
    onScrollBottom: loadNextPage
  })

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
        pageSize={PAGE_SIZE}
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
