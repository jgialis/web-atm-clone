'use strict';

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // BANKIST APP

// Data
const account1 = {
  owner: 'Josh Gialis',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2021-09-03T00:52:00.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jennifer Zaragoza',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const welcomeMessage = document.querySelector('.welcome-message');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const errorMessage = document.querySelector('.error-message');
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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// /////////////////////////////////////////////////
const currentDate = function () {
  const currentDateUnformated = new Date(Date.now());
  return `${
    currentDateUnformated.getMonth() + 1
  }/${currentDateUnformated.getDate()}/${currentDateUnformated.getFullYear()} at ${currentDateUnformated.getHours()}:${currentDateUnformated.getMinutes()}`;
};

const generateUsersInitials = function (accounts) {
  accounts.forEach(account => {
    const arr = account.owner.toLowerCase().split(' ');
    const initialsArr = arr.map(element => element[0]);
    account.username = initialsArr.join('');
  });
};
generateUsersInitials(accounts);
//GENERAL FUNCTIONS FOR DISPLAYING UI
const displayMovements = function (movements) {
  containerMovements.innerHTML = ''; //GOOD RESET PRACTICE

  movements.forEach(function (val, i) {
    //CREATE AN HTML Element for each array element
    const currentDateUnformated = new Date(currentAccount.movementsDates[i]);

    const type = val > 0 ? `deposit` : `withdrawal`;
    const html = ` 
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${diffDays(
        currentDateUnformated,
        Date.now()
      )}</div>
      <div class="movements__value">$${Math.abs(val)}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcAndPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov, 0);
  labelBalance.textContent = `$${acc.balance.toFixed(2)}`;
  console.log(acc);
};
const calcDisplaySummary = movements => {
  labelSumIn.textContent = Math.abs(
    movements.filter(mov => mov > 0).reduce((sum, mov) => sum + mov, 0)
  ).toFixed(2);
  labelSumOut.textContent = Math.abs(
    movements.filter(mov => mov < 0).reduce((sum, mov) => sum + mov, 0)
  ).toFixed(2);
};
const updateUI = function (sort = false) {
  timer();
  labelDate.textContent = currentDate();
  calcDisplaySummary(currentAccount.movements);
  calcAndPrintBalance(currentAccount);
  sort
    ? displayMovements(currentAccount.sortedMovements)
    : displayMovements(currentAccount.movements);
};

let currentAccount;
let isSorted = false;
//************************************************ */
//FUNCTION HANDLERS
//************************************************ */
const loginHandler = function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    updateUI(isSorted);
    containerApp.style.display = 'none';
    welcomeMessage.style.display = 'block';
    welcomeMessage.style.opacity = 1;
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Welcome, ${currentAccount.owner}`;
    welcomeMessage.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    setTimeout(function () {
      inputLoginPin.value = '';
      inputLoginUsername.value = '';
      containerApp.style.opacity = 1;
      welcomeMessage.style.opacity = 0;
    }, 2000);
    setTimeout(function () {
      welcomeMessage.style.display = 'none';
      containerApp.style.display = 'grid';
    }, 3000);
    errorMessage.style.display = 'none';
    inputLoginPin.blur();
  } else {
    containerApp.style.transition = 'all 0s';
    containerApp.style.opacity = 0;
    errorMessage.style.display = 'block';
  }
};
const transferHandler = function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferToAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (amount <= currentAccount.balance && currentAccount !== transferToAcc) {
    currentAccount.movements.push(-amount);
    transferToAcc.movements.push(amount);
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
    transferToAcc.movementsDates.push(new Date());
    currentAccount.movementsDates.push(new Date());
    updateUI(isSorted);
  } else
    console.log('You do not have sufficient funds to complete this transfer!');
};
const closeAccountHandler = function (e) {
  e.preventDefault();
  const closeUser = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  if (
    closeUser === currentAccount.username &&
    closePin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    setTimeout(function () {
      containerApp.style.opacity = 0;
      containerApp.style.display = 'none';
    }, 2000);
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
};
const loanHandler = function (e) {
  e.preventDefault();
  //TO REQUEST A LOAN FROM BANK, FIND ATLEAST ONE
  //DEPOSIT WITH AT LEAST 10% of REQUESTED LOAN AMOUNT
  const loanAmt = Number(inputLoanAmount.value);
  if (currentAccount.movements.some(mov => loanAmt * 0.1 <= mov)) {
    currentAccount.movements.push(loanAmt);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    currentAccount.movementsDates.push(new Date());
    updateUI(isSorted);
  } else {
    console.log('Couldnt complete your loan!');
  }
};
const sortHandler = function (e) {
  e.preventDefault();
  if (isSorted) {
    isSorted = false;
    updateUI(isSorted);
  } else {
    isSorted = true;
    const copy = currentAccount.movements.slice();
    currentAccount.sortedMovements = copy.sort((a, b) => a - b);
    updateUI(isSorted);
  }
};
btnLogin.addEventListener('click', loginHandler);
btnTransfer.addEventListener('click', transferHandler);
btnClose.addEventListener('click', closeAccountHandler);
btnLoan.addEventListener('click', loanHandler);
btnSort.addEventListener('click', sortHandler);

const diffDays = (date1, date2) => {
  const x = Math.floor(Math.abs(date1 - date2) / 1000 / 60 / 60 / 24);
  if (x === 0) return 'today';
  else if (x === 1) return 'yesterday';
  else return `${x} days ago`;
};

const timer = () => {
  let seconds = 300;
  setInterval(() => {
    const min = String(Math.floor(seconds / 60)).padStart(2, 0);
    const sec = String(seconds % 60).padStart(2, 0);
    const t = (labelTimer.textContent = `${min}:${sec}`);

    --seconds;
    if (seconds === -1) containerApp.style.opacity = 0;
    if (seconds === -3) {
      containerApp.style.display = 'none';
      seconds = 10;
      clearInterval(t);
      labelWelcome.textContent = 'Log in to get started';
    }
  }, 1000);
};
