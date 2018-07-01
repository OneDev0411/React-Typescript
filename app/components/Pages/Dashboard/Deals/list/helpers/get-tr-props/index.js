import OpenDeal from '../../../utils/open-deal'

export default function(rowIndex, { original: deal }) {
  return {
    onClick: () => OpenDeal(deal.id),
    style: {
      cursor: 'pointer'
    }
  }
}
