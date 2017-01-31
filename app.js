'use strict';

////////// BUDGET CONTROLLER

var budgetController = (function() {

  // Expense constructor
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  // Income constructor
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Calculate total expense/income within the allItems array
  var calculateTotal = function(type) {
    var sum = 0;

    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });

    data.totals[type] = sum;
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
    },
    budget: 0,
    percentage: -1
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

    deleteItem: function(type, id) {
      var ids, index;

      // map returns a new array
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      // indexOf returns the index number of the element in the array
      // returns -1 if element was not found
      index = ids.indexOf(id);

      if (index !== -1) {
        // splice removes the element starting at the given index, then specify how many elements you want to remove
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(current) {
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      // map method creates a new array
      var allPerc = data.allItems.exp.map(function(current) {
        return current.getPercentage();
      });

      return allPerc;
    },

    // Return an object that we can use to hold budget data
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec, type;
    /*
      + or - before number
      exactly 2 decimal points
      comma seperating the thousandths

      2310.4567 -> + 2,310.46
      2000 ->  + 2,000.00
    */

    // Math.abs() removes the sign of the number
    num = Math.abs(num);

    // toFixed -> always puts 2 decimal numbers
    num = num.toFixed(2)

    numSplit = num.split('.');
    int = numSplit[0];
    dec = numSplit[1];

    // logic for where to add the comma
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    // Put the formatted number back together
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };


  // PUBLIC methods available
  return {
    // Get values from input element fields
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    // Display expense/income item to UI
    addListItem: function(obj, type) {
      var html, newHtml, element;

      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);

      // Only able to remove a child node so it must be done this way which might look odd
      el.parentNode.removeChild(el);
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

      // After click or return the focus goes back to the description field
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      // Get DOM elements
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      // Check if percentage > 0
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function(percentages) {
      // fields is a list and does not have access to array methods
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      // Resuable code to loop through node lists
      // Node lists do have the length property
      var nodeListForEach = function(nodeList, callback) {
        for (var i = 0; i < nodeList.length; i++) {
          callback(nodeList[i], i)
        }
      };

      // custom forEach function
      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function() {
      var now, year, month, months;

      now = new Date();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
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

    // Event listener on the parent container, NOT on the button, for event delegation
    // Event bubbling will occur and we will catch it and be able to identify the target element
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function() {
    // 1. Calculate the budgetController
    budgetController.calculateBudget();

    // 2. Return the budget
    var budget = budgetController.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();

    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  // Handles logic for adding budget item
  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    // Description must not be empty, value must be a number, value > 0
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget CONTROLLER
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the new item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the input fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  // Delete expense/income row
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    // Tranverse the DOM to get the parent node containing an id
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    // Split method returns an array with items seperated at the '-'
    if (itemID) {
      // Store the type and ID into variables
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  // PUBLIC methods available
  return {
    // App initialization function on startup
    init: function() {
      // Fire up controller event listeners
      setupEventListeners();
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      console.log('App has started.');
    }
  };
})(budgetController, UIController);


//////////////////////////////////////////////////////////////////////////////


// We need initialization function to execute right away at app startup
controller.init();
