
const dbConnection = () => {
  const mongoose = require('mongoose')

  main()
    .catch(err => console.log(err))

  async function main () {
    await mongoose.connect(process.env.MONGODB_CNN)
  }
}

module.exports = dbConnection
