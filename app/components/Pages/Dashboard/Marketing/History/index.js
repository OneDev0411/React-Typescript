import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import { useInfiniteScroll } from 'hooks/use-infinite-scroll'

import TemplatesList from 'components/TemplatesList'

import { useTemplatesHistory } from '../hooks/use-templates-history'
import EmptyState from './EmptyState'

import Layout from '..'

const PAGE_SIZE = 12

function History() {
  const [limit, setLimit] = useState(PAGE_SIZE)
  const { templates, isLoading, deleteTemplate } = useTemplatesHistory()

  const loadNextPage = () => setLimit(limit => limit + PAGE_SIZE)

  useInfiniteScroll({
    accuracy: 400, // px
    onScrollBottom: loadNextPage
  })

  async function handleDelete(id) {
    await deleteTemplate(id)
  }

  const loadedTemplates = templates.slice(0, limit)

  return (
    <>
      <Helmet>
        <title>All Designs | Marketing | Rechat</title>
      </Helmet>

      <Layout
        render={() => (
          <TemplatesList
            pageSize={PAGE_SIZE}
            type="history"
            items={loadedTemplates}
            isLoading={isLoading}
            onDeleteInstance={handleDelete}
            emptyState={<EmptyState />}
          />
        )}
      />
    </>
  )
}

export default History
