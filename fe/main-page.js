var testDivOnClick = function() {
  confirm('shall we go on?');
};

var attachEvents = function() {
  var testDiv = document.querySelector('#test-div');
  if (testDiv) {
    testDiv.addEventListener('click', testDivOnClick);
  }
};
