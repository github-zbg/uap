function ApiResult() {
  this.code = 0;
  this.error = null;
  this.result = null;
}

module.exports = {
  SUCCESS: 0,
  ARGUMENT_ERROR: 1,
  INTERNAL_ERROR: 2,

  errorResult: function(code, error) {
    var result = new ApiResult();
    result.code = code;
    result.error = error;
    return result;
  },
  successResult: function(code, result) {
    var result = new ApiResult();
    result.code = code;
    result.result = result;
    return result;
  },
};
