// utilities/getProjects.ts
import type { Project } from '@/payload-types'
import config from '@payload-config'
import { getPayload, type Where } from 'payload'

export async function getProjects(limit = 10, page = 1, userId?: string) {
  const payload = await getPayload({ config })

  const where: Where | undefined = userId
    ? {
        'fileDetails.createdBy': {
          equals: userId,
        },
      }
    : undefined

  return payload.find({
    collection: 'projects',
    limit,
    page,
    depth: 2,
    where,
  })
}
