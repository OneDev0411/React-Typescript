import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Box, IconButton } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import CloseIcon from 'components/SvgIcons/Close/CloseIcon'
import TemplatesList from 'components/TemplatesList'

import Layout from '..'

function isGenerationThumbnails(brandTemplates) {
  return brandTemplates.some(brandTemplate => {
    if (brandTemplate.thumbnail_requested_at) {
      return true
    }

    if (!brandTemplate.thumbnail && !brandTemplate.thumbnail.preview_url) {
      return true
    }

    return false
  })
}

export const MarketingList = () => {
  const [
    showGeneratingThumbnailsAlert,
    setShowGeneratingThumbnailsAlert
  ] = useState(false)

  return (
    <>
      <Helmet>
        <title>Marketing | Rechat</title>
      </Helmet>
      <Layout
        render={({ items, isLoading, types, medium, onDeleteTemplate }) => {
          setShowGeneratingThumbnailsAlert(isGenerationThumbnails(items))

          return (
            <>
              {showGeneratingThumbnailsAlert && (
                <Box mt={1.5}>
                  <Alert
                    severity="info"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        onClick={() => setShowGeneratingThumbnailsAlert(false)}
                      >
                        <CloseIcon size="small" />
                      </IconButton>
                    }
                  >
                    <Box>
                      Some template preview images might be outdated or not
                      ready. They will be here in a few minutes.
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
