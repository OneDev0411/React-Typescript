import { Helmet } from 'react-helmet'

import TemplatesList from 'components/TemplatesList'

import { useTemplatesHistory } from '../hooks/use-templates-history'
import EmptyState from './EmptyState'

import Layout from '..'

function History() {
  const { templates, isLoading, deleteTemplate } = useTemplatesHistory()

  async function handleDelete(id) {
    await deleteTemplate(id)
  }

  return (
    <>
      <Helmet>
        <title>All Designs | Marketing | Rechat</title>
      </Helmet>

      <Layout
        render={() => (
          <TemplatesList
            type="history"
            items={templates}
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
