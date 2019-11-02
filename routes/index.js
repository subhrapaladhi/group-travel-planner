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
        // if(data.plans.length==0){
        //   res.render('dashboard', {
        //     user: req.user,
        //     plans: plansData
        //   })
        // }else{
        //   data.plans.forEach(async(planid,index)=>{
        //     await Plan.findById(planid)
        //         .then((pdata)=>{
        //             plansData.push(pdata)
        //             if(index==data.plans.length-1){
        //               res.render('dashboard', {
        //                 user: req.user,
        //                 plans: plansData
        //               })
        //             }
        //         })
        //   })  
        // }

        Plan.find
      })
      .catch((err)=>{
        console.log(err)
      })

  User.find()
  res.send
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
