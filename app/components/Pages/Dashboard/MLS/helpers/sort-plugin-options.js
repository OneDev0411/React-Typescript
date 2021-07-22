export const sortOptions = {
  defaultSort: { label: 'Price (Low-High)', value: 'price', ascending: false },
  columns: [
    { label: 'Price (High-Low)', value: 'price', ascending: false },
    { label: 'Price (Low-High)', value: 'price', ascending: true },
    { label: 'Bedrooms (High-Low)', value: 'beds', ascending: false },
    { label: 'Bedrooms (Low-High)', value: 'beds', ascending: true },
    { label: 'Bathrooms (High-Low)', value: 'baths', ascending: false },
    { label: 'Bathrooms (Low-High)', value: 'baths', ascending: true },
    { label: 'Sqft (High-Low)', value: 'sqft', ascending: false },
    { label: 'Sqft (Low-High)', value: 'sqft', ascending: true },
    {
      label: 'Lot Size Area (High-Low)',
      value: 'lotSizeArea',
      ascending: false
    },
    {
      label: 'Lot Size Area (Low-High)',
      value: 'lotSizeArea',
      ascending: true
    },
    { label: 'Year Built (High-Low)', value: 'builtYear', ascending: false },
    { label: 'Year Built (Low-High)', value: 'builtYear', ascending: true }
  ]
}
