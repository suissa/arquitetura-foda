const Schema = {
  field: {
    type: String
  , default: undefined
  , validate: Function
  , index: Boolean
  , required: Boolean
  }
}

module.exports = Schema;