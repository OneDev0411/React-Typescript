export const TabNames: {
  type: IBrandChecklist['checklist_type']
  title: IBrandChecklist['title']
}[] = [
  {
    type: 'Selling',
    title: 'Listing'
  },
  {
    type: 'Buying',
    title: 'Contract'
  },
  {
    type: 'Offer',
    title: 'Offer'
  }
]

export const dealTaskTypeToString: { [key in IDealTaskType]: string } = {
  Form: 'Form',
  GeneralComments: 'General Comments',
  Generic: 'Generic',
  YardSign: 'Yard Sign',
  OpenHouse: 'Open House',
  Media: 'Media'
}
