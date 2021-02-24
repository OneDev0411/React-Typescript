import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Grid,
  Typography,
  Button,
  Box,
  Theme,
  makeStyles
} from '@material-ui/core'

import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'

import CardSkeleton from 'components/CardSkeleton'
import TemplateAction from 'components/TemplatesList/TemplateAction'
import MarketingTemplateCard from 'components/MarketingTemplateCard'

import { useTemplates } from '../../../hooks/use-templates'
import SectionLayout from '../SectionLayout'
import LinkSectionAction from '../LinkSectionAction'

const BRANDING_TEMPLATE_TYPES: IMarketingTemplateType[] = ['Brand', 'NewAgent']
const SOCIAL_TEMPLATE_MEDIUMS: IMarketingTemplateMedium[] = [
  'Social',
  'FacebookCover',
  'LinkedInCover',
  'InstagramStory'
]

const useStyles = makeStyles(
  (theme: Theme) => ({
    templateCardContainer: {
      cursor: 'pointer'
    },
    shareButton: {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.secondary.main}`
    }
  }),
  {
    name: 'MarketingOverviewSomethingToShareSection'
  }
)

export default function SomethingToShareSection() {
  const classes = useStyles()
  const user = useSelector(selectUser)
  const activeBrand = getActiveTeamId(user)
  const [selectedTemplate, setSelectedTemplate] = useState<
    Nullable<IBrandMarketingTemplate>
  >(null)
  const [isTemplateClicked, setIsTemplateClicked] = useState<boolean>(false)

  const { templates, isLoading } = useTemplates(
    activeBrand,
    SOCIAL_TEMPLATE_MEDIUMS,
    BRANDING_TEMPLATE_TYPES
  )

  const handleSelectTemplate = (template: IBrandMarketingTemplate) => {
    if (isTemplateClicked) {
      return
    }

    setSelectedTemplate(template)
    setIsTemplateClicked(true)
  }

  return (
    <>
      <SectionLayout
        title="Something To Share Now"
        actionNode={
          <LinkSectionAction
            title="View all brand templates"
            url={`/dashboard/marketing/${BRANDING_TEMPLATE_TYPES.join(',')}`}
          />
        }
      >
        <>
          {isLoading && (
            <>
              <Grid item xs sm={3}>
                <CardSkeleton />
              </Grid>
              <Grid item xs sm={3}>
                <CardSkeleton />
              </Grid>
              <Grid item xs sm={3}>
                <CardSkeleton />
              </Grid>
              <Grid item xs sm={3}>
                <CardSkeleton />
              </Grid>
            </>
          )}
          {!isLoading && templates.length === 0 && (
            <Typography variant="h6">No designs to show</Typography>
          )}
          {!isLoading &&
            templates.slice(0, 4).map(template => (
              <Grid
                key={template.id}
                className={classes.templateCardContainer}
                item
                xs
                sm={3}
              >
                <MarketingTemplateCard
                  template={template}
                  actions={
                    <Grid container item>
                      <Box p={2} width="100%">
                        <Button
                          fullWidth
                          variant="contained"
                          className={classes.shareButton}
                          onClick={() => handleSelectTemplate(template)}
                        >
                          {isTemplateClicked ? 'Loading' : 'Share'}
                        </Button>
                      </Box>
                    </Grid>
                  }
                />
              </Grid>
            ))}
        </>
      </SectionLayout>
      {selectedTemplate && (
        <TemplateAction
          type={selectedTemplate.template.type}
          medium={selectedTemplate.template.medium}
          isTriggered={isTemplateClicked}
          setTriggered={setIsTemplateClicked}
          setEditActionTriggered={setIsTemplateClicked}
          selectedTemplate={selectedTemplate}
        />
      )}
    </>
  )
}
