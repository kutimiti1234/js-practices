let fizzbuzz = (number) => {
  if (number % 15 === 0) {
    return "FizzBuzz";
  } else if (number % 5 === 0) {
    return "Buzz";
  } else if (number % 3 === 0) {
    return "Fizz";
  } else {
    return String(number);
  }
};

let index = 0;
while (index <= 20) {
  console.log(fizzbuzz(index));
  index++;
}
