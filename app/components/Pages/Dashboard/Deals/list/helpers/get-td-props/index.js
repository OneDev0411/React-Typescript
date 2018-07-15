export default function(rowIndex, { column }) {
  if (column.id === 'address') {
    return {
      hoverStyle: `
        text-decoration: underline
      `
    }
  }

  return {}
}
