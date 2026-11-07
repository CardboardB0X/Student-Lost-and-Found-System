import mongoose from 'mongoose';
import LostFoundItem from '../models/LostFoundItem.js';

// Helper to safely escape special regex characters
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @desc    Get all lost and found items (with category, status, search, itemType filtering)
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res, next) => {
  try {
    const { category, status, search, itemType } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (itemType && ['FOUND', 'LOST'].includes(itemType.toUpperCase())) {
      filter.itemType = itemType.toUpperCase();
    }

    if (search && search.trim() !== '') {
      const sanitized = escapeRegex(search.trim());
      const searchRegex = new RegExp(sanitized, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { locationFound: searchRegex },
        { custodyLocation: searchRegex },
        { 'deviceDetails.brand': searchRegex },
        { 'deviceDetails.model': searchRegex }
      ];
    }

    const items = await LostFoundItem.find(filter)
      .populate('createdBy', 'name studentId email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }

    const item = await LostFoundItem.findById(id).populate('createdBy', 'name studentId email role');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost and found item not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }
    next(error);
  }
};

// @desc    Discover matching items (if item is LOST, finds matching FOUND items; vice versa)
// @route   GET /api/items/:id/matches
// @access  Public
export const getItemMatches = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid item ID' });
    }

    const target = await LostFoundItem.findById(id);
    if (!target) {
      return res.status(404).json({ success: false, message: 'Target item not found' });
    }

    // Look for opposite item type
    const oppositeType = target.itemType === 'LOST' ? 'FOUND' : 'LOST';

    // Build smart match query: same category + words from title or location
    const titleWords = target.title
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .map(escapeRegex);

    const matchQuery = {
      _id: { $ne: target._id },
      itemType: oppositeType,
      status: { $ne: 'Claimed' },
      category: target.category
    };

    if (titleWords.length > 0) {
      const keywordRegexes = titleWords.map((w) => new RegExp(w, 'i'));
      matchQuery.$or = [
        { title: { $in: keywordRegexes } },
        { description: { $in: keywordRegexes } },
        { locationFound: new RegExp(escapeRegex(target.locationFound.slice(0, 8)), 'i') }
      ];
    }

    const matches = await LostFoundItem.find(matchQuery)
      .limit(6)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user personal items (reported by user or claimed by user's studentId)
// @route   GET /api/items/my/activity
// @access  Private
export const getMyActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const studentId = req.user.studentId;

    const reportedItems = await LostFoundItem.find({
      $or: [
        { createdBy: userId },
        { 'contactInfo.contactChannel': { $regex: req.user.email, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    const claimedItems = await LostFoundItem.find({
      'claimRecord.studentId': { $regex: `^${escapeRegex(studentId)}$`, $options: 'i' }
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        reported: reportedItems,
        claimed: claimedItems
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lost/found item
// @route   POST /api/items
// @access  Public / Authenticated
export const createItem = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      locationFound,
      dateFound,
      status,
      custodyLocation,
      itemType,
      deviceDetails,
      imageUrl,
      contactInfo,
      claimRecord
    } = req.body;

    // Normalize dateFound if provided
    let parsedDate = Date.now();
    if (dateFound) {
      const d = new Date(dateFound);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    const newItem = await LostFoundItem.create({
      title,
      category,
      description,
      locationFound,
      dateFound: parsedDate,
      status: status || 'Reported',
      custodyLocation: custodyLocation || (itemType === 'LOST' ? 'Misplaced by Owner' : 'With Finder'),
      itemType: itemType === 'LOST' ? 'LOST' : 'FOUND',
      deviceDetails: deviceDetails || {},
      imageUrl: imageUrl || '',
      createdBy: req.user?._id || null,
      contactInfo: contactInfo || {
        founderName: req.user?.name || 'Anonymous',
        contactChannel: req.user?.email || 'N/A'
      },
      claimRecord: claimRecord || null
    });

    return res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid format for field: ${error.path}`
      });
    }
    next(error);
  }
};

// @desc    Update lost/found item or claim record
// @route   PUT /api/items/:id
// @access  Public / Authenticated
export const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }

    const existingItem = await LostFoundItem.findById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Lost and found item not found'
      });
    }

    const updateData = { ...req.body };

    if (updateData.dateFound) {
      const d = new Date(updateData.dateFound);
      if (!isNaN(d.getTime())) {
        updateData.dateFound = d;
      }
    }

    const updatedItem = await LostFoundItem.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid format for field: ${error.path}`
      });
    }
    next(error);
  }
};

// @desc    Delete lost/found item
// @route   DELETE /api/items/:id
// @access  Public / Authenticated
export const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID format'
      });
    }

    const item = await LostFoundItem.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost and found item not found'
      });
    }

    // If user is authenticated and not staff/admin, verify they own the item
    if (req.user && req.user.role === 'STUDENT' && item.createdBy) {
      if (item.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are only authorized to delete items you created.'
        });
      }
    }

    await LostFoundItem.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
