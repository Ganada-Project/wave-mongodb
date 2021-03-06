const jwt = require('jsonwebtoken')
const User = require('../../../models/user')
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const crypto = require('crypto');

exports.register = async(req, res) => {
  const { username, password, fcm_token, name, phone, address, age, gender, profile_img_url, height, weight, foot, waist, base64, body_points } = req.body
  let newUser = null;
  
  const upload = (user) => {
    if (user) {
      throw new Error('username exists')
    } else {
      const image = new Promise((resolve, reject) => {
        const d = new Date();
        d.setUTCHours(d.getUTCHours());
        const picKey = d.getFullYear() + '_'
          + d.getMonth() + '_'
          + d.getDate() + '_'
          + crypto.randomBytes(20).toString('hex') + '.jpg';
        const image_url = `https://s3.ap-northeast-2.amazonaws.com/wave-bucket-seoul/${picKey}`;
        let buf = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        s3.putObject({
          Bucket: 'wave-bucket-seoul',
          Key: picKey,
          Body: buf,
          ACL: 'public-read'
        }, function (err, response) {
          if (err) reject(err);
          else {
            // console.log("1", image_url);
            return resolve(image_url);
          }
        });
      });

      return image;
      
    }
  }
  const create = (picUrl) => {
    return User.create(username, password, fcm_token, name, phone, address, age, gender, profile_img_url, height, weight, foot, waist, picUrl, body_points)
  }
  
  const respond = (user) => {
    const secret = req.app.get('jwt-secret')
    // console.log(user._id);
    jwt.sign(
      {
        _id: user._id,
        username: username,
        // admin: isAdmin
      },
      secret,
      {
        // expiresIn: '7d',
        issuer: 'ganadaproject@gmail.com',
        subject: 'userInfo'
      }, (err, token) => {
        if (err) reject(err)
        res.json({
          message: 'registered successfully',
          token: token,
          // admin: isAdmin ? true : false
        })
      })
  }

  // run when there is an error (username exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message
    })
  }

  // check username duplication

  try {
    let user = await User.findOneByUsername(username);
    let image_url = await upload(user);
    let created_user = await create(image_url);
    await respond(created_user);
  } catch (err) {
    res.status(409).json({
      message: err.message
    })
  }
  // User.findOneByUsername(username)
  //   .then(upload)
  //   .then(create)
  //   .then(respond)
  //   .catch(onError)
}

/*
    POST /api/auth/login
    {
        username,
        password
    }
*/

exports.login = (req, res) => {
  const { username, password } = req.body
  const secret = req.app.get('jwt-secret')

  const check = (user) => {
    if (!user) {
      // user does not exist
      throw new Error('login failed')
    } else {
      // user exists, check the password
      if (user.verify(password)) {
        // create a promise that generates jwt asynchronously
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: user._id,
              username: username,
              // admin: isAdmin
            },
            secret,
            {
              // expiresIn: '7d',
              issuer: 'ganadaproject@gmail.com',
              subject: 'userInfo'
            }, (err, token) => {
              if (err) reject(err)
              resolve(token)
            })
        })
        return p
      } else {
        throw new Error('login failed')
      }
    }
  }

  // respond the token 
  const respond = (token) => {
    res.json({
      message: 'logged in successfully',
      token
    })
  }

  // error occured
  const onError = (error) => {
    res.status(403).json({
      message: error.message
    })
  }

  // find the user
  User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)

}

/*
    GET /api/auth/check
*/

exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded
  })
}

exports.phoneNumberCheck = async(req, res) => {
  try {
    let user = await User.findOneByPhone(req.query.phone);
    if (user) {
      res.status(200).json({
        overlap: true
      })
    } else {
      res.status(200).json({
        overlap: false
      })
    }
  } catch (err) {
    res.status(406).json({
      message: err.message
    })
  }
}

exports.userNameCheck = async(req, res) => {
  try {
    let user = await User.findOneByUsername(req.query.username);
    
    if (user) {
      res.status(200).json({
        overlap: true
      })
    } else {
      res.status(200).json({
        overlap: false
      })
    }
  } catch (err) {
    res.status(406).json({
      message: err.message
    })
  }
}