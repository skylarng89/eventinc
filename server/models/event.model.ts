import mongoose from 'mongoose'

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled'
}

export enum EventType {
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  WEBINAR = 'webinar',
  NETWORKING = 'networking',
  OTHER = 'other'
}

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(EventType),
    default: EventType.OTHER
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.DRAFT
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  location: {
    type: {
      type: String,
      enum: ['virtual', 'physical', 'hybrid'],
      required: true
    },
    address: String,
    city: String,
    country: String,
    virtualLink: String
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid'],
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  image: {
    url: String,
    alt: String
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationDeadline: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  meta: {
    registeredCount: {
      type: Number,
      default: 0
    },
    waitlistCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Create slug from title
eventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
  next()
})

// Add index for better search performance
eventSchema.index({ title: 'text', description: 'text' })

export const Event = mongoose.model('Event', eventSchema)