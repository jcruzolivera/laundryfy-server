const jwt = require('jsonwebtoken')

const generateJWT = async (uid = '') => {
  return new Promise((resolve, reject) => {
    //  Get uid which is my JWT payload
    const payload = { uid }

    //  Generate JWT
    jwt.sign(payload, process.env.SECRETORPUBLICKEY, {
      expiresIn: '4h'
    }, (err, token) => {
      if (err) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Failed at generating token')
      }
      resolve(token)
    })
  })
}

module.exports = generateJWT
