const getCount = async (query) => {
  const [countResult] = await query.clone().clearSelect().clearOrder().count()

  return Number.parseInt(countResult.count, 10)
}

export default getCount
