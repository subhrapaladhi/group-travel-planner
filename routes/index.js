const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Plan = require('../models/Plan');
const User = require('../models/User');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
  User.findById(req.user._id)
      .then(async(data)=>{
        let plansData = new Array();
        plansData = await Plan.find().where('_id').in(data.plans).exec();
        console.log(plansData)
        res.render('dashboard', {
          user: req.user,
          plans: plansData
        })
      })
      .catch((err)=>{
        console.log(err)
      })
});

router.get('/newplan', ensureAuthenticated,(req, res)=>{
  res.render('createnew', {
    user: req.user
  })                         
})

router.post('/newplan', ensureAuthenticated, (req, res)=>{
  console.log('req.body======',req.body)
  new Plan(req.body)
      .save()
      .then((plan)=>{
        console.log('plan=====',plan)
        let userData = req.user;
        userData.plans.push(plan._id)
        User.findByIdAndUpdate(req.user._id, userData, {new: true})
            .then((data)=>{
              res.redirect('/dashboard');
            })
            .catch((err)=>{
              console.log(err)
            })
      })
})

router.get('/showDetails/:id',ensureAuthenticated,(req, res)=>{
  Plan.findById(req.params.id)
      .then((data)=>{
        res.render('showdetails', {
          user: req.user,
          planData: data
        }) 
      })
})

router.post('/showDetails/:id',ensureAuthenticated,(req,res)=>{
  console.log(req.body)
  Plan.findByIdAndUpdate(req.params.id,req.body,{new: true})
      .then((data)=>{
        console.log('showdeatils data====',data);
        res.redirect('/dashboard')
      })

})

router.get('/joinplan',ensureAuthenticated,(req,res)=>{
  res.render('joinplan');
})

router.post('/joinplan',ensureAuthenticated,(req,res)=>{
  req.user.plans.push(req.body.key);
  User.findByIdAndUpdate(req.user._id, req.user,{new: true})
      .then((data)=>{
        console.log(data);
        res.redirect('/dashboard')
      })
      .catch((err)=>{
        console.log(err)
      })
})

module.exports = router;
