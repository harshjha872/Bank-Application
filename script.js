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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const upDateUI = function (acc) {
  displayMovements(acc.movements)

  calcDisplaySummary(acc);

  callDisplayBalance(acc);

}
let Timer;
//Timer
const StartTimer = function () {
  const clock = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let second = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${second}`;

    if (time === 0) {
      clearInterval(Timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    time--;
  }
  let time = 300;
  Timer = setInterval(clock, 1000);
  return Timer;
}


const displayMovements = function (movements, sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort(function (a, b) {
    if (a < b)
      return -1;
    if (a > b)
      return 1;
  }) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${i} ${type}</div>
                    <div class="movements__date"></div>
                    <div class="movements__value">${mov}$</div>
                  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
}

const userName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0]
      })
      .join('');
  });
};

userName(accounts);

const callDisplayBalance = function (accs) {
  accs.totalValue = accs.movements.reduce(
    (acc, curEl) => acc + curEl, 0
  );
  labelBalance.textContent = `${accs.totalValue}$`;
}

// callDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}$`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}$`;
};

//Login Account haldler

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  //Check credentials
  currentAccount = accounts.find(acc =>
    acc.username === inputLoginUsername.value
  );

  //Update UI
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    upDateUI(currentAccount);

    //Start Timer
    if (Timer) clearInterval(Timer);
    StartTimer();

  }
});


//Transfer Money To accounts Handler 


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);

  //find account that will recieve money
  const reccAccount = accounts.find(acc =>
    acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  //Conditions should met to Transfer money
  if (reccAccount && currentAccount.totalValue >= amount && amount > 0 && currentAccount.username !== reccAccount.username) {

    //reducing amount
    currentAccount.movements.push(-amount);

    //adding amount
    reccAccount.movements.push(amount);

    //update UI
    upDateUI(currentAccount);

    //Start Timer
    if (Timer) clearInterval(Timer);
    StartTimer();
  }
});

//Delete Account handler

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {

    //Check for correct credentials
    const DeleteAccountAtThisINDEX = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username
    });

    //Delete Account
    accounts.splice(DeleteAccountAtThisINDEX, 1);

    //Update UI
    containerApp.style.opacity = 0;
  }

});

btnLoan.addEventListener('click', function (e) {

  //Start Timer
  if (Timer) clearInterval(Timer);
  StartTimer();

  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  //It should have a minimum condition to lent loan that is 10% of highest amount deposit
  if (currentAccount.movements.some(function (acc) {
    return acc >= amount * 0.1;
  }) && amount > 0) {

    //if it true then move this amount to currentaccount and update UI
    currentAccount.movements.push(amount);
    upDateUI(currentAccount)

    inputLoanAmount.value = '';
  }
});

//Sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});