import OpenDeal from '../../../utils/open-deal'
import { grey, primary } from '../../../../../../../views/utils/colors'

export default function(rowIndex, { original: deal }) {
  return {
    onClick: () => OpenDeal(deal.id),
    css: `
      cursor: pointer;
      :hover {
        background-color: ${grey.A000}

        a {
          color: ${primary}
        }
      }
    `
  }
}
