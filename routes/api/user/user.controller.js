const User = require('../../../models/user')
const ObjectId = require('mongoose').Types.ObjectId;

exports.me = (req, res) => {
  
  User.findOne({
      'auth.username': req.decoded.username
    })
    .then(
      user => {
        res.json({
          user
        })
      }
    )
}

exports.updateFCM = async(req, res) => {
  const { fcm_token } = req.body;

  try {
    // GET USER BY USERNAME
    let user = await User.findOne({
      'auth.username': req.decoded.username
    })
    user.auth.fcm_token = fcm_token;
    user.save();

    res.status(200).json({
      'message': 'fcm_token updated successfully'
    });

  } catch (err) {
    res.status(406).json({
      'message': err.message
    });
  }

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
        res.json({
          users
        })
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