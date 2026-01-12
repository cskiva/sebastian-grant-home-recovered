import getProductionUrl from '@/utilities/getProductionUrl'

export const USER = `
  id
  email
  firstName
  lastName
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gql = async (query: string): Promise<any> => {
  const productionUrl = getProductionUrl()

  try {
    const res = await fetch(`${productionUrl}/api/graphql`, {
      body: JSON.stringify({
        query,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { data, errors } = await res.json()

    if (errors) {
      throw new Error(errors[0].message)
    }

    if (res.ok && data) {
      return data
    }
  } catch (e: unknown) {
    throw new Error(e as string)
  }
}
