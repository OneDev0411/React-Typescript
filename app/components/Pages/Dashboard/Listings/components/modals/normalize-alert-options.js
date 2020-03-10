export const normalizeAlertOptions = (
  searchOptions,
  drawingPoints,
  alertOptions
) => {
  let points = searchOptions.points
  const {
    mls_areas,
    postal_codes,
    school_districts,
    subdivisions,
    counties
  } = searchOptions

  if (
    drawingPoints.length === 0 &&
    (mls_areas || postal_codes || school_districts || subdivisions || counties)
  ) {
    points = null
  }

  const open_house = searchOptions.open_house || false

  return {
    ...searchOptions,
    ...alertOptions,
    points,
    open_house,
    limit: null
  }
}
