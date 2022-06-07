'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd'];
// console.log(arr.splice());

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const [i, element] of movements.entries()) {
//   console.log(i, element);
// }
// console.log('---Divide---');
// movements.forEach(function (element, i) {
//   console.log(i, element);
// });
// const rest = new Map([
//   ['name', 'mujeeb'],
//   ['surname', 'opabode'],
//   ['age', '22'],
// ]);
// rest.set('mood', 'feeling privileged');

// console.log(rest);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//Print balance
const calcPrintBalance = function (account) {
  account.balance = account.movements.reduce(function (accumulator, mov) {
    return accumulator + mov;
  }, 0);

  labelBalance.innerHTML = `${account.balance}€`;
};
// ///////////

// Display summary
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = account.movements
    .filter(movement => movement < 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((accumulator, value) => accumulator + value, 0);
  labelSumInterest.textContent = `${interest}€`;
};
//////////////

// Display Movements
const calcDisplayMovement = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    let html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">2 ${type}</div>
    <div class="movements__date"> ${index + 1} days ago</div>
    <div class="movements__value">${movement}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
///////////

// Create Username
const createUserName = function (acc) {
  acc.forEach(function (account) {
    let names = account.owner.split(' ');
    let aka = names.map(function (name) {
      return name.toLowerCase().slice(0, 1);
    });
    // IN MODERN JAVASCRIPT:
    // const aka = userName.map(name => name.toLowerCase()[0]);
    account.userName = aka.join('');
  });
};
createUserName(accounts);
//////////

//update Ui(display balance,movement and summary)
const updateUI = function (currentAccount) {
  // display balance
  calcPrintBalance(currentAccount);
  // display movement
  calcDisplayMovement(currentAccount.movements); // display summary
  calcDisplaySummary(currentAccount);
};

// Login, get current account
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submiting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    // display ui
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // remove focus from pin input field
    inputLoginPin.blur();
    //update Ui(display balance,movement and summary)
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    account => account.userName === inputTransferTo.value
  );
  // clear the fields
  inputTransferTo.value = inputTransferAmount.value = '';
  //check
  //if the amount being sent is greater than 0, sender has enough , sender is not sending to himself and that the receiving account actually exists(we can do this last one with optional chaining)
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loan = Number(inputLoanAmount.value);
  if (loan > 0 && currentAccount.movements.some(mov => mov >= loan / 10)) {
    // add movement
    currentAccount.movements.push(loan);
    // updateUI
    updateUI(currentAccount);
    // clear the input field
  }
  inputLoanAmount.value = '';
});
//To Delete An Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // clear field after click

  //verify the user is really the owner of the account
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const accountIndex = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(accountIndex);
    // Delete Account
    accounts.splice(accountIndex, 1);

    //Hide UI
    containerApp.style.opacity = 0;
    console.log('deleted successfully');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
// // Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// const checkDogs = function (dogsJulia, dogsKate) {
//   const copyJulia = dogsJulia.slice(1, -2);
//   const jointDogs = [...copyJulia, ...dogsKate];
//   jointDogs.forEach(function (age, index) {
//     let text =
//       age >= 3
//         ? `Dog number ${index} is an adult, and is ${age} years old`
//         : `Dog number ${index} is still a puppy`;

//     console.log(text);
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// const newMovement = movements.map(movement => movement * 2);
// console.log(newMovement);

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrawals);

// const calcAverageHumanAge = function (ages) {
//   // const humanAge = ages.map(age=> age<= 2 ? age*2 : 16 + age * 4)
//   const humanAge = ages.map(function (age) {
//     if (age <= 2) {
//       return age * 2;
//     } else {
//       return 16 + age * 4;
//     }
//   });
//   console.log(humanAge);
//   // const adultHumanAge = humanAge.filter(age=> age >= 18)
//   const adultHumanAge = humanAge.filter(function (age) {
//     return age >= 18;
//   });
//   // console.log(adultHumanAge);
//   // const averageAdultDogAge = adultHumanAge.reduce((accumulator, dogAge)=>accumulator +dogAge,0)/adultHumanage.length
//   const averageAdultDogAge =
//     adultHumanAge.reduce(function (accumulator, dogAge) {
//       return accumulator + dogAge;
//     }, 0) / adultHumanAge.length;
//   console.log(averageAdultDogAge);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// //The above code made more modern-javascript like and refactored
// const calcAverageHumanAge = ages => {
//   const averageAdultDogAge = ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, dogAge, index, arr) => acc + dogAge / arr.length, 0);
//   console.log(averageAdultDogAge);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

const allMovements = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(sumOfAllTransactions);
console.log(allMovements);
