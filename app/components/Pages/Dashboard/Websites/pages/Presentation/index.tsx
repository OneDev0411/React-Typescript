import { memo, useState } from 'react'

import { Button } from '@material-ui/core'
import { useTitle } from 'react-use'

import PageLayout from 'components/GlobalPageLayout'

import WebsiteList from '../../components/WebsiteList'
import { PRESENTATION_TEMPLATE_TYPES } from '../../constants'

function Presentation() {
  useTitle('Presentation | Rechat')

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
      <PageLayout.Header title="Presentation">
        <Button
          onClick={onOpenTemplateSelector}
          variant="outlined"
          color="default"
        >
          Create Presentation
        </Button>
      </PageLayout.Header>
      <PageLayout.Main>
        <WebsiteList
          title="Presentation"
          typesWhiteList={PRESENTATION_TEMPLATE_TYPES}
          templateSelectorTypes={PRESENTATION_TEMPLATE_TYPES}
          isOpenTemplateSelector={isOpenTemplateSelector}
          onCloseTemplateSelector={onCloseTemplateSelector}
        />
      </PageLayout.Main>
    </PageLayout>
  )
}

export default memo(Presentation)
