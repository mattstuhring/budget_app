// BUDGET CONTROLLER

var budgetController = (function() {

  // Expense constructor
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Income constructor
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Data structure to hold our expense/income data
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

})();


////////////////////////////////////////////////////


// UI CONTROLLER

var UIController = (function() {
  // Central place where all UI strings will be stored to prevent major code bugs when HTML props are changed
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  // PUBLIC methods available
  return {
    // Get values from input fields
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    // Let DOMstrings be publicly available
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();


////////////////////////////////////////////////////


// GLOBAL APP CONTROLLER

var controller = (function(budgetCtrl, UICtrl) {

  // Help us clean up and only have functions within the controller
  var setupEventListeners = function() {
    // Get DOMstrings from UIController
    var DOM = UICtrl.getDOMstrings();

    // Add btn click event listener
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // Enter key event listener
    document.addEventListener('keypress', function(event) {
      // event.which is for older browsers
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  // Handles logic for adding budget item
  var ctrlAddItem = function() {
    // 1. Get the field input data
    var input = UICtrl.getInput();

    // 2. Add the item to the budget CONTROLLER

    // 3. Add the new item to the UI

    // 4. Calculate the budgetController

    // 5. Display the budget on the UI

  };

  // PUBLIC methods available
  return {
    // App initialization function on startup
    init: function() {
      // Fire up controller event listeners
      setupEventListeners();
      console.log('App has started.');
    }
  };

})(budgetController, UIController);

////////////////////////////////////////////////////

// We need initialization function to execute right away at app startup
controller.init();
