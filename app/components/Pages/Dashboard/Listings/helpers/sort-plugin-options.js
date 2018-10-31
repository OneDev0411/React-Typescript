export const sortOptions = {
  defaultIndex: { label: 'Price (Low-High)', value: 'price' },
  columns: [
    { label: 'Price (Low-High)', value: 'price' },
    { label: 'Price (High-Low)', value: '-price' },
    { label: 'Distance (Low-High)', value: '-distanceFromCenter' },
    { label: 'Distance (High-Low)', value: 'distanceFromCenter' },
    { label: 'Bedrooms (Low-High)', value: 'beds' },
    { label: 'Bedrooms (High-Low)', value: '-beds' },
    { label: 'Bathrooms (Low-High)', value: 'baths' },
    { label: 'Bathrooms (High-Low)', value: '-baths' },
    { label: 'Sqft (Low-High)', value: 'sqft' },
    { label: 'Sqft (High-Low)', value: '-sqft' },
    { label: 'Lot Size Area (Low-High)', value: 'lotSizeArea' },
    { label: 'Lot Size Area (High-Low)', value: '-lotSizeArea' },
    { label: 'Year Built (Low-High)', value: 'builtYear' },
    { label: 'Year Built (High-Low)', value: '-builtYear' }
  ]
}
