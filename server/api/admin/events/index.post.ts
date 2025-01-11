// server/api/admin/events/index.post.ts

import { Event } from '~/server/models/event.model'
import { useLogger } from '~/composables/useLogger'

export default defineEventHandler(async (event) => {
  const logger = useLogger()

  try {
    const body = await readBody(event)

    // Basic validation
    if (!body.title) {
      throw createError({
        statusCode: 400,
        message: 'Title is required'
      })
    }

    if (!body.startDate || !body.endDate) {
      throw createError({
        statusCode: 400,
        message: 'Start and end dates are required'
      })
    }

    // Create event
    const newEvent = await Event.create({
      ...body,
      // Add organizer once we have authentication
      organizer: '65bf1234abcd1234abcd1234' // Temporary placeholder
    })

    logger.info('Event created successfully', { eventId: newEvent._id })

    return { event: newEvent }
  } catch (error) {
    logger.error('Error creating event:', error)
    throw error
  }
})