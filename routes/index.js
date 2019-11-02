const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Plan = require('../models/Plan');
const User = require('../models/User');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
  res.render('dashboard', {
    user: req.user,
    plans: new Array()
  })
});

router.get('/newplan', ensureAuthenticated,(req, res)=>{
  let temp = new Array();
  res.render('createnew', {
    user: req.user,              // create newplan.ejs to render form for a new plan
  })                         
})

router.post('/newplan', ensureAuthenticated, (req, res)=>{
  req.body["members"]=[req.user._id]
  console.log('req.user====', req.user)
  new Plan(req.body)
      .save()
      .then((plan)=>{
        console.log('plan ==== ', plan)
        let userData = req.user;
        userData.plans.push(plan._id)
        User.findByIdAndUpdate(req.user._id, userData, {new: true})
            .then((data)=>{
              console.log('data===',data)
            })
            .catch((err)=>{
              console.log(err)
            })
      })
  res.redirect('/dashboard')
})

module.exports = router;
