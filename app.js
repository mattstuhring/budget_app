'use strict';

////////// BUDGET CONTROLLER

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

  // PUBLIC METHODS
  return {
    // Add new expense/income item
    addItem: function(type, des, val) {
      var newItem, ID;

      // ID = last ID + 1
      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push it into our data structure
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    },

    testing: function() {
      console.log(data);
    }
  };
})();


//////////////////////////////////////////////////////////////////////////////


////////// UI CONTROLLER

var UIController = (function() {
  // Central place where all UI strings will be stored to prevent major code bugs when HTML props are changed
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  };

  // PUBLIC methods available
  return {
    // Get values from input element fields
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    // Display expense/income item to UI
    addListItem: function(obj, type) {
      var html, newHtml, element;

      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    // Clear input fields
    clearFields: function() {
      var fields, fieldsArr;

      // querySelectorAll returns a list which does not have access to array methods
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      // Convert list to array using the Array constructor
      fieldsArr = Array.prototype.slice.call(fields);

      // forEach methods has access to current value, index, and array
      fieldsArr.forEach(function(current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus();
    },

    // Let DOMstrings be publicly available
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();


//////////////////////////////////////////////////////////////////////////////


////////// GLOBAL APP CONTROLLER

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
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    // 2. Add the item to the budget CONTROLLER
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the new item to the UI
    UICtrl.addListItem(newItem, input.type);

    // 4. Clear the input fields
    UICtrl.clearFields();

    // 5. Calculate the budgetController

    // 6. Display the budget on the UI

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


//////////////////////////////////////////////////////////////////////////////


// We need initialization function to execute right away at app startup
controller.init();
