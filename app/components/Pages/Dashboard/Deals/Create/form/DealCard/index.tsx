import React from 'react'
import {
  Box,
  Chip,
  Typography,
  Button,
  makeStyles,
  Theme
} from '@material-ui/core'

import { getField } from 'models/Deal/helpers/context'
import { getStatus } from 'models/Deal/helpers/context'

import {
  QuestionSection,
  QuestionTitle,
  QuestionForm
} from 'components/QuestionWizard'

import { goTo } from 'utils/go-to'
import { getStatusColorClass } from 'utils/listing'

import { useCreationContext } from '../../context/use-creation-context'

const useStyles = makeStyles(
  (theme: Theme) => ({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1)
    },
    cardPhoto: {
      maxWidth: '100%',
      borderRadius: theme.shape.borderRadius
    },
    status: {
      width: '12px !important',
      height: '12px !important',
      borderRadius: '100%'
    }
  }),
  {
    name: 'CreateDeal-Card'
  }
)

export function DealCard() {
  const { deal } = useCreationContext()
  const classes = useStyles()

  const openDeal = () => goTo(`/dashboard/deals/${deal!.id}`)

  if (!deal) {
    return null
  }

  const imageUrl =
    getField(deal, 'photo') || '/static/images/deals/group-146.svg'

  const status = getStatus(deal)

  return (
    <QuestionSection>
      <QuestionTitle>Congrats! It's all set.</QuestionTitle>
      <QuestionForm>
        <Box textAlign="center">
          <Typography variant="h6">
            Congratulation!{' '}
            <span role="img" aria-label="congrats">
              🎉
            </span>
          </Typography>

          <Typography variant="subtitle1">
            your deal has been created successfuly
          </Typography>

          <Box my={4} className={classes.card} textAlign="left">
            <img src={imageUrl} alt="" className={classes.cardPhoto} />

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              my={2}
            >
              <Typography variant="subtitle1">{deal.title}</Typography>
              <div>
                <Chip
                  avatar={
                    <span
                      className={classes.status}
                      style={{
                        backgroundColor: getStatusColorClass(status)
                      }}
                    />
                  }
                  label={status}
                />
              </div>
            </Box>
          </Box>

          <Button variant="contained" color="secondary" onClick={openDeal}>
            Open Deal
          </Button>
        </Box>
      </QuestionForm>
    </QuestionSection>
  )
}
