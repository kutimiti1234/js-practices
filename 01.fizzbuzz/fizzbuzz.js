const  fizzbuzz = (number) => {
  if (number % 3 === 0 && number % 5 === 0) {
    return "FizzBuzz";
  } else if (number % 5 === 0) {
    return "Buzz";
  } else if (number % 3 === 0) {
    return "Fizz";
  } else {
    return String(number);
  }
};

for (let number = 1; number <= 20; number++) {
  console.log(fizzbuzz(number))
}
