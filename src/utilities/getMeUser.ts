import type { Admin, User } from '../payload-types'
import { cookies } from 'next/headers'
import { getClientSideURL, getServerSideURL } from './getURL'
import { redirect } from 'next/navigation'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  token: string
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')
  const baseUrl = getServerSideURL() || getClientSideURL()

  if (!token) {
    if (nullUserRedirect) {
      redirect(nullUserRedirect)
    }
    throw new Error('payload-token cookie is missing')
  }

  const fetchMe = async <T>(collection: 'users' | 'admins') => {
    const req = await fetch(`${baseUrl}/api/${collection}/me`, {
      cache: 'no-store',
      credentials: 'include',
      headers: {
        Authorization: `JWT ${token}`,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    })

    if (!req.ok) return null

    const result = (await req.json()) as { user?: T }
    return result?.user ?? null
  }

  let user = await fetchMe<User>('users')

  if (!user) {
    const admin = await fetchMe<Admin>('admins')
    if (admin) {
      // Map admin shape to the User type so downstream consumers can still render basic info
      user = {
        id: admin.id,
        email: admin.email,
        updatedAt: admin.updatedAt,
        createdAt: admin.createdAt,
        name: admin.email,
        isAdmin: true,
      }
    }
  }

  if (validUserRedirect && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && !user) {
    redirect(nullUserRedirect)
  }

  if (!user) {
    throw new Error('Failed to fetch user or admin from /me endpoints')
  }

  return {
    token,
    user,
  }
}
