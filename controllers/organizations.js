const createError = require('http-errors');
const Organization = require('../models/Organization');
const User = require('../models/User');
const OrganizationSchema = require('../validation/organizations');

exports.getAllOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.find();
    return res.status(200).json(organizations);
  } catch (err) {
    next(err);
  }
};

exports.getOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return next(createError(404, 'Organization not found'));
    }
    return res.status(200).json(organization);
  } catch (err) {
    next(err);
  }
};

exports.createOrganization = async (req, res, next) => {
  try {
    const { error, value } = OrganizationSchema.validate(req.body);
    if (error) return res.status(422).send(error.details);
    const organization = await Organization.create({ ...req.body, userId: req.user._id });
    return res.status(201).json({ organization_id: organization._id });
  } catch (err) {
    next(err);
  }
};


exports.updateOrganization = async (req, res, next) => {
  try {
    const { error, value } = OrganizationSchema.validate(req.body);
    if (error) return res.status(422).send(error.details);
    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    if (organization.userId.toString() !== req.user._id.toString()) {
      return next(createError(403, 'You do not have permission to update this organization'));
    }
    return res.status(200).json(organization);
  } catch (err) {
    next(err);
  }
};

exports.deleteOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return next(createError(404, 'Organization not found'));
    }

    if (organization.userId.toString() !== req.user._id.toString()) {
      return next(createError(403, 'You do not have permission to delete this organization'));
    }

    await organization.delete();
    return res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.inviteMember = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.user_email });
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    const member = {
      email: user.email,
      name: user.name,
    };

    const organization = await Organization.findByIdAndUpdate(req.params.id, {
      $push: {
        organization_members: member
      }
    }, {
      new: true,
    });

    if (!organization) {
      return next(createError(404, 'Organization not found'));
    }
    return res.status(200).json({ message: 'Member invited successfully' });
  } catch (err) {
    next(err);
  }
};