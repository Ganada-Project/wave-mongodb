const User = require('../../../models/user')
var ObjectId = require('mongoose').Types.ObjectId;

exports.me = (req, res) => {
  User.findOne({_id: ObjectId(req.decoded._id)})
    .then(
      user => {
        res.json({ 
          user 
        })
      }
    )
}

/* 
    GET /api/user/list
*/

exports.list = (req, res) => {
  // refuse if not an admin
  if (!req.decoded.admin) {
    return res.status(403).json({
      message: 'you are not an admin'
    })
  }

  User.find({})
    .then(
      users => {
        res.json({ users })
      }
    )
}


/*
    POST /api/user/assign-admin/:username
*/

exports.assignAdmin = (req, res) => {
  // refuse if not an admin
  if (!req.decoded.admin) {
    return res.status(403).json({
      message: 'you are not an admin'
    })
  }

  User.findOneByUsername(req.params.username)
    .then(
      user => user.assignAdmin
    ).then(
      res.json({
        success: true
      })
    )
}
