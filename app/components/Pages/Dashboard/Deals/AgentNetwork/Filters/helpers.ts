export const itemToChip = (item: IMLSArea) => ({
  label: `${item.title} #${item.number}`
})
export const itemToSuggestion = (item: IMLSArea) => ({
  title: `${item.title} #${item.number}`
})
