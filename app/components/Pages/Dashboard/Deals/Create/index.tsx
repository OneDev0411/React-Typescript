import React, { useState } from 'react'
import { Box, makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'

import Deal from 'models/Deal'

import { QuestionWizard } from 'components/QuestionWizard'

import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'

import { DealType } from './form/DealType'
import { DealSide } from './form/DealSide'
import { DealPropertyType } from './form/DealPropertyType'
import { DealAgent } from './form/DealAgent'
import { DealAddress } from './form/DealAddress'

const useStyles = makeStyles(
  () => ({
    root: {
      width: '80%',
      margin: '15% auto'
    }
  }),
  {
    name: 'CreateDeal'
  }
)

export default function CreateDeal() {
  const classes = useStyles()
  const [deal, setDeal] = useState<IDeal | null>(null)
  const [dealType, setDealType] = useState<string>('')
  const [dealSide, setDealSide] = useState<Nullable<'Buying' | 'Selling'>>(null)

  const user = useSelector<IAppState, IUser>(state => selectUser(state))

  const createDraftDeal = async (propertyType: string) => {
    if (deal || !dealSide) {
      return
    }

    const data = await Deal.create(user, {
      property_type: propertyType,
      deal_type: dealSide,
      is_draft: false
    })

    console.log(data)

    setDeal(data)
  }

  return (
    <Box className={classes.root}>
      <QuestionWizard defaultStep={0}>
        <DealType onChange={setDealType} />
        <DealSide onChange={setDealSide} />

        {dealSide === 'Buying' && (
          <DealAgent type="primary" title="Enter buyer agent’s information" />
        )}

        {dealSide === 'Buying' && (
          <DealAgent
            type="co-agent"
            title="Got it! Enter buyer co-agent’s information"
          />
        )}

        <DealAgent type="primary" title="Enter listing agent’s information" />
        <DealAgent
          type="co-agent"
          title="Got it! Enter listing co-agent’s information"
        />

        <DealAddress />
        <DealPropertyType onChange={createDraftDeal} />
      </QuestionWizard>
    </Box>
  )
}
