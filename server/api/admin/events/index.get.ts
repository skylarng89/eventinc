import { Event } from '~/server/models/event.model'
import { useLogger } from '~/composables/useLogger'

export default defineEventHandler(async (event) => {
  const logger = useLogger()
  const query = getQuery(event)

  try {
    // Build filter conditions
    const filter: any = {}

    // Add status filter
    if (query.status && query.status !== 'all') {
      filter.status = query.status
    }

    // Add type filter
    if (query.type && query.type !== 'all') {
      filter.type = query.type
    }

    // Add search filter
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ]
    }

    // Fetch events with pagination
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10

    const events = await Event.find(filter)
      .sort({ startDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const total = await Event.countDocuments(filter)

    logger.info('Events fetched successfully', { 
      count: events.length,
      total,
      page,
      filter 
    })

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    logger.error('Error fetching events:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch events'
    })
  }
})

// server/api/admin/events/[id]/status.patch.ts

export default defineEventHandler(async (event) => {
  const logger = useLogger()
  const eventId = event.context.params?.id

  if (!eventId) {
    throw createError({
      statusCode: 400,
      message: 'Event ID is required'
    })
  }

  try {
    const body = await readBody(event)
    
    if (!body.status) {
      throw createError({
        statusCode: 400,
        message: 'Status is required'
      })
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { status: body.status },
      { new: true }
    )

    if (!updatedEvent) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }

    logger.info('Event status updated', { 
      eventId, 
      status: body.status 
    })

    return { event: updatedEvent }
  } catch (error) {
    logger.error('Error updating event status:', error)
    throw error
  }
})