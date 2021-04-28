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
      <SectionTitle variant="body1">Deals Information</SectionTitle>

      <ItemsContainer>
        <Item disableHover>
          <ItemLabel>MLS#</ItemLabel>
          <div>
            <MlsConnect deal={deal} />
          </div>
        </Item>

        <Item disableHover>
          <ItemLabel>Side</ItemLabel>
          <div>
            <DealSide deal={deal} isBackOffice={isBackOffice} />
          </div>
        </Item>

        <Item disableHover>
          <ItemLabel>Type</ItemLabel>
          <div>
            <PropertyType deal={deal} isBackOffice={isBackOffice} />
          </div>
        </Item>
      </ItemsContainer>
    </>
  )
}
