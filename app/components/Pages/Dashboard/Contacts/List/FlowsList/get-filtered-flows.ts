export interface FlowFilter extends IActiveFilter {
  key: string
}

export function getFilteredFlows(
  activeFilters: StringMap<IActiveFilter>
): FlowFilter[] {
  let result: FlowFilter[] = []

  if (Object.keys(activeFilters).length > 0) {
    Object.keys(activeFilters).filter(key => {
      const filter = activeFilters[key]

      if (filter.id && filter.id === 'flow' && filter.values) {
        result.push({
          key,
          ...filter
        })
      }
    })
  }

  return result
}
