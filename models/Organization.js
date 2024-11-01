const mongoose = require('mongoose');

const organizationMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  accessLevel: {
    default: 'member',
    type: String,
    required: true,
  },
});

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    organization_members: [organizationMemberSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  
  { timestamps: true },
);

module.exports = mongoose.model('Organization', OrganizationSchema);
