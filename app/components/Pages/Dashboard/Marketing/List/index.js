import React from 'react'
import { Helmet } from 'react-helmet'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import TemplatesList from 'components/TemplatesList'

import Layout from '..'

function isGenerationThumbnails(brandTemplates) {
  return brandTemplates.some(brandTemplate => {
    if (
      !brandTemplate.is_thumbnail_ready ||
      !brandTemplate.thumbnail ||
      !brandTemplate.thumbnail.preview_url
    ) {
      return true
    }

    return false
  })
}

export const MarketingList = () => {
  return (
    <>
      <Helmet>
        <title>Marketing | Rechat</title>
      </Helmet>
      <Layout
        render={({ items, isLoading, types, medium, onDeleteTemplate }) => {
          return (
            <>
              {isGenerationThumbnails(items) && (
                <Box mt={1.5}>
                  <Alert severity="info">
                    <Box>
                      Some of the previews shown below may not be ready or
                      slightly outdated. We are working in the background to
                      update them. This usually takes a few minutes.
                    </Box>
                  </Alert>
                </Box>
              )}
              <TemplatesList
                items={items}
                isLoading={isLoading}
                type={types}
                medium={medium}
                onDelete={onDeleteTemplate}
              />
            </>
          )
        }}
      />
    </>
  )
}

export default MarketingList
