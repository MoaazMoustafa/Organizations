const express = require('express');
const router = express.Router();
const organizationsController = require('../controllers/organizations');
const { auth } = require('../middleware/auth');

router.get('/',auth, organizationsController.getAllOrganizations);
router.get('/:id', auth, organizationsController.getOrganization);
router.post('/', auth, organizationsController.createOrganization);
router.patch('/:id', auth, organizationsController.updateOrganization);
router.delete('/:id', auth, organizationsController.deleteOrganization);
router.post('/:id/invite', auth, organizationsController.inviteMember);

module.exports = router;
