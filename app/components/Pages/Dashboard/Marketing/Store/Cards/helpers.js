export const getMQWidth = (base, props) => {
  const w = props.isSideMenuOpen ? base + 10.2578125 : base

  return `${w}em`
}
