const errorHandler = (error, req, res, next) => {
  console.log('Error: ', error.name, error.message)

  next(error)
}

module.exports = { errorHandler }