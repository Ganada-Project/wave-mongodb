const jwt = require('jsonwebtoken')
const User = require('../../../models/user')

exports.register = async(req, res) => {
  const { username, password, name, phone, address, height, weight, foot, waist, base_64, body_points } = req.body
  let newUser = null
  let img_url = "http://www.kozoom.co.kr/thumbnails/original/uploads/events/17842/news/115f3b8c07d933ff693c96d58d7d5bd5350fdac2.jpg.jpg"
  // create a new user if does not exist
  const create = (user) => {
    if (user) {
      throw new Error('username exists')
    } else {
      return User.create(username, password, name, phone, address, height, weight, foot, waist, img_url, body_points)
    }
  }

  // count the number of the user
  const count = (user) => {
    newUser = user
    return User.count({}).exec()
  }

  // assign admin if count is 1
  const assign = (count) => {
    if (count === 1) {
      return newUser.assignAdmin()
    } else {
      // if not, return a promise that returns false
      return Promise.resolve(false)
    }
  }

  // respond to the client
  const respond = (isAdmin) => {
    res.json({
      message: 'registered successfully',
      admin: isAdmin ? true : false
    })
  }

  // run when there is an error (username exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message
    })
  }

  // check username duplication
  User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError)
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
              username: user.auth.username,
              admin: user.admin
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