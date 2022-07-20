import { memo, useState } from 'react'

import { Button } from '@material-ui/core'
import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'

import WebsiteList from '../../components/WebsiteList'
import { WebsiteTemplateSelector } from '../../components/WebsiteTemplateSelector'
import {
  PRESENTATION_TEMPLATE_TYPES,
  WEBSITE_TEMPLATE_TYPES
} from '../../constants'

function Website() {
  useTitle('Websites | Rechat')

  const [isOpenTemplateSelector, setIsOpenTemplateSelector] =
    useState<boolean>(false)

  const onOpenTemplateSelector = () => {
    setIsOpenTemplateSelector(true)
  }
  const onCloseTemplateSelector = () => {
    setIsOpenTemplateSelector(false)
  }

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Websites">
        <Button
          onClick={onOpenTemplateSelector}
          variant="outlined"
          color="default"
        >
          Create Website
        </Button>
      </PageLayout.Header>
      <PageLayout.Main>
        <WebsiteList
          title="Website"
          typesBlackList={PRESENTATION_TEMPLATE_TYPES}
        />
        <WebsiteTemplateSelector
          isOpen={isOpenTemplateSelector}
          templateTypes={WEBSITE_TEMPLATE_TYPES}
          onClose={onCloseTemplateSelector}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Website)
