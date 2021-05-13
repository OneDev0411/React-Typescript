import { DealSide } from './Side'
import { PropertyType } from './PropertyType'
import { MlsConnect } from './MlsConnect'

import {
  ItemsContainer,
  SectionTitle,
  Item,
  ItemLabel
} from '../Factsheet/styled'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export function DealProperties({ deal, isBackOffice }: Props) {
  return (
    <>
      <SectionTitle variant="body1">Details</SectionTitle>

      <ItemsContainer>
        <Item disableHover={!deal.listing}>
          <ItemLabel>MLS#</ItemLabel>
          <MlsConnect deal={deal} />
        </Item>

        <Item disableHover={!isBackOffice}>
          <ItemLabel>Side</ItemLabel>
          <DealSide deal={deal} isBackOffice={isBackOffice} />
        </Item>

        <Item disableHover={!isBackOffice}>
          <ItemLabel>Type</ItemLabel>
          <PropertyType deal={deal} isBackOffice={isBackOffice} />
        </Item>
      </ItemsContainer>
    </>
  )
}
