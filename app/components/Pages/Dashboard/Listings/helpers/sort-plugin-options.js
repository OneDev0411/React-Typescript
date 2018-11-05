export const sortOptions = {
  defaultIndex: { label: 'Price (Low-High)', value: '-price' },
  columns: [
    { label: 'Price (High-Low)', value: 'price' },
    { label: 'Price (Low-High)', value: '-price' },
    { label: 'Distance (High-Low)', value: 'distanceFromCenter' },
    { label: 'Distance (Low-High)', value: '-distanceFromCenter' },
    { label: 'Bedrooms (High-Low)', value: 'beds' },
    { label: 'Bedrooms (Low-High)', value: '-beds' },
    { label: 'Bathrooms (High-Low)', value: 'baths' },
    { label: 'Bathrooms (Low-High)', value: '-baths' },
    { label: 'Sqft (High-Low)', value: 'sqft' },
    { label: 'Sqft (Low-High)', value: '-sqft' },
    { label: 'Lot Size Area (High-Low)', value: 'lotSizeArea' },
    { label: 'Lot Size Area (Low-High)', value: '-lotSizeArea' },
    { label: 'Year Built (High-Low)', value: 'builtYear' },
    { label: 'Year Built (Low-High)', value: '-builtYear' }
  ]
}
