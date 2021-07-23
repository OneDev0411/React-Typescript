type UseListingsIsLeafBrand = (brand: IBrand) => boolean

function useListingsIsLeafBrand(brands: IBrand[]): UseListingsIsLeafBrand {
  const parents = brands.reduce<Record<UUID, true>>(
    (parentsId, brand) =>
      brand.parent?.id ? { ...parentsId, [brand.parent.id]: true } : parentsId,
    {}
  )

  return (brand: IBrand) => !parents[brand.id]
}

export default useListingsIsLeafBrand
