export const TabNames: {
  type: IBrandChecklist['checklist_type']
  title: IBrandChecklist['title']
}[] = [
  {
    type: 'Selling',
    title: 'Listing'
  },
  {
    type: 'Offer',
    title: 'Outgoing Contract'
  },
  {
    type: 'Buying',
    title: 'Incoming Contract'
  }
]

export const dealTaskTypeToString: { [key in IDealTaskType]: string } = {
  Form: 'Form',
  GeneralComments: 'General Comments',
  Generic: 'Generic',
  YardSign: 'Yard Sign',
  OpenHouse: 'Open House',
  Media: 'Media',
  Splitter: 'Splitter'
}
