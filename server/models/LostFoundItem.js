import mongoose from 'mongoose';

export const CATEGORIES = [
  'ID & Cards',
  'Electronics',
  'Keys & Wallets',
  'Bottles & Tumblers',
  'Bags & Apparel',
  'Books & Stationery',
  'Others'
];

export const STATUSES = [
  'Reported',
  'Turned In to Office',
  'Claimed'
];

const contactInfoSchema = new mongoose.Schema(
  {
    founderName: {
      type: String,
      required: [true, 'Founder name is required'],
      trim: true
    },
    contactChannel: {
      type: String,
      required: [true, 'Contact channel/email/phone is required'],
      trim: true
    }
  },
  { _id: false }
);

const claimRecordSchema = new mongoose.Schema(
  {
    claimantName: {
      type: String,
      trim: true
    },
    studentId: {
      type: String,
      trim: true
    },
    claimDate: {
      type: Date,
      default: Date.now
    },
    verificationNotes: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const lostFoundItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid category'
      }
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    locationFound: {
      type: String,
      required: [true, 'Location found is required'],
      trim: true
    },
    dateFound: {
      type: Date,
      required: [true, 'Date found is required'],
      default: Date.now
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: '{VALUE} is not a valid status'
      },
      default: 'Reported'
    },
    custodyLocation: {
      type: String,
      trim: true,
      default: 'With Finder'
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    itemType: {
      type: String,
      enum: ['FOUND', 'LOST'],
      default: 'FOUND'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    deviceDetails: {
      brand: { type: String, trim: true, default: '' },
      model: { type: String, trim: true, default: '' },
      color: { type: String, trim: true, default: '' },
      serialNumberPartial: { type: String, trim: true, default: '' }
    },
    contactInfo: {
      type: contactInfoSchema,
      required: [true, 'Contact information is required']
    },
    claimRecord: {
      type: claimRecordSchema,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Helpful text or index support
lostFoundItemSchema.index({ title: 'text', description: 'text', locationFound: 'text' });

const LostFoundItem = mongoose.model('LostFoundItem', lostFoundItemSchema);

export default LostFoundItem;
