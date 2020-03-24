import React from 'react'
import { Helmet } from 'react-helmet'

import TemplatesList from 'components/TemplatesList'

import Layout from '..'

export const MarketingList = () => {
  return (
    <>
      <Helmet>
        <title>Marketing | Rechat</title>
      </Helmet>
      <Layout
        render={({ items, isLoading, types, medium, onDeleteTemplate }) => (
          <TemplatesList
            items={items}
            isLoading={isLoading}
            type={types}
            medium={medium}
            onDelete={onDeleteTemplate}
          />
        )}
      />
    </>
  )
}

export default MarketingList
