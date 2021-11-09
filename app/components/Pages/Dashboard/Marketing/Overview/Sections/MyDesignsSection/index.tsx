import React, { useState } from 'react'

import { Grid, Typography, makeStyles } from '@material-ui/core'

import CardSkeleton from 'components/CardSkeleton'
import TemplateInstanceCard from 'components/TemplateInstanceCard'
import TemplateAction from 'components/TemplatesList/TemplateAction'

import { useTemplatesHistory } from '../../../hooks/use-templates-history'
import LinkSectionAction from '../LinkSectionAction'
import SectionLayout from '../SectionLayout'

const useStyles = makeStyles(
  () => ({
    cardContainer: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'MarketingMyDesignsSection'
  }
)

export default function MyDesignsSection() {
  const classes = useStyles()
  const { templates, isLoading } = useTemplatesHistory()
  const [isTemplateInstanceClicked, setIsTemplateInstanceClicked] =
    useState<boolean>(false)

  const [selectedTemplateInstance, setSelectedTemplateInstance] =
    useState<Nullable<IMarketingTemplateInstance>>(null)

  function handleTemplateInstanceClick(template: IMarketingTemplateInstance) {
    setSelectedTemplateInstance(template)
    setIsTemplateInstanceClicked(true)
  }

  return (
    <>
      <SectionLayout
        title="My Designs"
        actionNode={
          templates.length ? (
            <LinkSectionAction
              title="View all my design"
              url="/dashboard/marketing/designs"
            />
          ) : null
        }
        containerGridProps={{ sm: 6 }}
      >
        <>
          {isLoading && (
            <>
              <Grid item xs sm={6}>
                <CardSkeleton />
              </Grid>
              <Grid item xs sm={6}>
                <CardSkeleton />
              </Grid>
            </>
          )}
          {!isLoading && templates.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary">
                Your past designs will be here.
              </Typography>
            </Grid>
          )}
          {!isLoading &&
            templates?.slice(0, 2).map(template => (
              <Grid
                key={template.id}
                item
                xs={12}
                sm={6}
                className={classes.cardContainer}
              >
                <TemplateInstanceCard
                  templateInstance={template}
                  onClick={() => handleTemplateInstanceClick(template)}
                />
              </Grid>
            ))}
        </>
      </SectionLayout>
      {selectedTemplateInstance && (
        <TemplateAction
          type={selectedTemplateInstance.template.type}
          medium={selectedTemplateInstance.template.medium}
          isEdit
          isTriggered={isTemplateInstanceClicked}
          setTriggered={setIsTemplateInstanceClicked}
          setEditActionTriggered={setIsTemplateInstanceClicked}
          selectedTemplate={selectedTemplateInstance}
        />
      )}
    </>
  )
}
