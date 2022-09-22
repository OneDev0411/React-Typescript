import { useTitle } from 'react-use'

import TemplatesList from 'components/TemplatesList'

import Layout from '..'
import { useTemplatesHistory } from '../hooks/use-templates-history'

import EmptyState from './EmptyState'

function History() {
  const { templates, isLoading, deleteTemplate } = useTemplatesHistory()

  async function handleDelete(id) {
    await deleteTemplate(id)
  }

  useTitle('All Designs | Marketing | Rechat')

  return (
    <>
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
