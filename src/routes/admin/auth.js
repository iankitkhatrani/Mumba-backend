const express = require('express');
const router = express.Router();
const mainCtrl = require('../../controller/adminController');
const { OK_STATUS, BAD_REQUEST } = require('../../../config');
const logger = require('../../../logger');

/**
 * @api {post} /admin/signup-admin
 * @apiName  register admin
 * @apiGroup  Admin
 * @apiHeader {String}  x-access-token Admin's unique access-key
 * @apiSuccess (Success 200) {Array} badges Array of badges document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */

router.post('/signup-admin', async (req, res) => {
  res.json(await mainCtrl.registerAdmin(req.body));
});

/**
 * @api {post} /admin/login
 * @apiName  login for admin
 * @apiGroup  Admin
 * @apiHeader {String}  x-access-token Admin's unique access-key
 * @apiSuccess (Success 200) {Array} badges Array of badges document
 * @apiError (Error 4xx) {String} message Validation or error message.
 */
router.post('/login', async (req, res) => {
  try {
    // res.json(await mainCtrl.adminLogin(req.body));
    let data = {}
    console.log('req.body => ', req.body);
    if(req.body.logintype == "Admin"){
      data = await mainCtrl.adminLogin(req.body);
      res.status(OK_STATUS).json(data);
    }else if(req.body.logintype == "Agent"){
      data = await mainCtrl.AgentLogin(req.body);
      data.data.name = "Agent"
      res.status(OK_STATUS).json(data);
    }else if(req.body.logintype == "Shop"){
      data = await mainCtrl.ShopLogin(req.body);
      data.data.name = "Shop"
      res.status(OK_STATUS).json(data);
    }else{
      res.status(BAD_REQUEST).json({ status: 0, message: 'Something went wrong' });
       
    }
     logger.info('data => ', data);
    
  } catch (err) {
    logger.error('admin/auth.js login error => ', err);
    res.status(BAD_REQUEST).json({ status: 0, message: 'Something went wrong' });
  }
});

module.exports = router;
