export function createPairedMlsAreas(
  area: IMLSArea[],
  subAreas: IMLSArea[]
): [number, number][] | null {
  let pairedAreas: Record<number, number> = {}

  if (area.length === 0) {
    return null
  }

  area.forEach(areaItem => {
    pairedAreas = { ...pairedAreas, [areaItem.number]: 0 }
  })

  subAreas.forEach(areaItem => {
    pairedAreas = { ...pairedAreas, [areaItem.parent]: areaItem.number }
  })

  return Object.keys(pairedAreas).map(key => [Number(key), pairedAreas[key]])
}
