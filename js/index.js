import { userIsLoggedOut } from "./global.js";
const url =
  "https://raw.githubusercontent.com/lorey/list-of-countries/master/json/countries-readable.json";
const alternative = "https://countryapi.io/documentation";
const religion_url =
  "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-religion.json";

userIsLoggedOut();
const fetchData = async () => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`fel i databas ${res.status}`);
    }
    const data = await res.json();
    const filteredData = updateData(data);

    const countries = [...filteredData];
    const random = [...filteredData];
    const continents = [...filteredData];
    const capitals = [...filteredData];
    const quiz= [...filteredData]

    await getRandomCountry(random);
    getTop10BiggestCountries(filteredData);
    getTop10HighestPopulation(data);
    countryStartsWith(countries);
    allCountriesInContinent(continents);
    matchCapital(capitals)
    
  } catch (error) {
    console.error(error);
  }
};
const fetchReligion = async (country) => {
  try {
    const res = await fetch(religion_url);
    if (!res.ok) {
      throw new Error("HTTP fel", res.status);
    }
    const data = await res.json();
    return findReligion(country, data);
  } catch (error) {
    console.error("Något blev fel i fetchreligion");
  }
};
const findReligion = (country, data) => {
  const religion = data.find((specific) => specific.country === country);
  return religion.religion;
};
fetchData();
const getRandomCountry = async (data) => {
  const index = Math.floor(Math.random() * data.length);
  await showRandomCountry(data[index]);
};
const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const updateData = (data) => {
  data.forEach((country) => {
    country.population = parseInt(country.population);
    country.area = parseInt(country.area);
    if (country.continent === "EU") {
      country.continent = "Europe";
    } else if (country.continent === "NA") {
      country.continent = "North America";
    } else if (country.continent === "SA") {
      country.continent = "South America";
    } else if (country.continent === "AS") {
      country.continent = "Asia";
    } else if (country.continent === "OC") {
      country.continent = "Oceania";
    } else if (country.continent === "AF") {
      country.continent = "Africa";
    }
  });

  const updatedData = data.filter((country) => {
    return (
      country.population >= 20000 || country.name === "Vatican" || country.name === "Antarctica"
    );
  });

  return updatedData;
};
const showRandomCountry = async (data) => {
  const app = document.getElementById("randomCountry");

  const container = document.createElement("div");
  container.className = "container";

  const img = document.createElement("img");

  img.src = `https://flagsapi.com/${data.alpha_2}/shiny/64.png`;
  img.alt = `Bild av ${data.name}`;

  container.appendChild(img);

  const h2 = document.createElement("h2");
  h2.textContent = data.name;
  h2.style.marginBottom = "10px";
  container.appendChild(h2);

  const ul = document.createElement("ul");
  ul.classList.add("info-list");
  const li1 = document.createElement("li");
  if (data.population.length > 6) {
    li1.textContent = `Population: ${formatNumberWithCommas(data.population)} miljoner människor`;
  } else {
    li1.textContent = `Population: ${formatNumberWithCommas(data.population)} tusen människor`;
  }

  ul.appendChild(li1);

  const li2 = document.createElement("li");
  li2.textContent = `Storlek: ${formatNumberWithCommas(data.area)} kvadratkilometer`;
  ul.appendChild(li2);

  container.appendChild(ul);

  app.appendChild(container);

  const secondUl = document.createElement("ul");
  secondUl.classList.add("info-list");
  app.appendChild(secondUl);

  const continent = document.createElement("li");
  continent.innerHTML = `Kontinent: ${data.continent}`;
  secondUl.appendChild(continent);

  const capital = document.createElement("li");
  capital.innerHTML = `Huvudstad: ${data.capital}`;
  secondUl.appendChild(capital);

  const currency = document.createElement("li");
  currency.innerHTML = `Currency: ${data.currency_name}`;
  secondUl.appendChild(currency);

  const religion = document.createElement("li");
  religion.innerHTML = `Religion: ${await fetchReligion(data.name)}`;
  secondUl.appendChild(religion);

  const phone = document.createElement("li");
  phone.innerHTML = `Phonecode: ${data.phone}+`;
  secondUl.appendChild(phone);
};
const getTop10BiggestCountries = (data) => {
  const sort10 = data.sort((a, b) => {
    return b.area - a.area;
  });
  const gameArray = sort10.splice(0, 10);
  console.log(gameArray);
  const icon = `<i class="fa-solid fa-earth-europe icon green"></i>`;
  top10Button(gameArray, "De tio största länderna", icon);
};
const chooseGameContainer = document.querySelector("#chooseGameContainer");
const gameArea = document.querySelector("#game");
const list1 = document.querySelector("#list1");
const gameContainer = document.querySelector("#container");
const bottomLocation= document.querySelector("#bottomLocation");
const quizcontainer= document.querySelector("#quizcontainer")
let score=0

const getTop10HighestPopulation = (data) => {
  const sort10 = data.sort((a, b) => b.population - a.population);
  const gameArray = sort10.splice(0, 10);
  console.log(gameArray);
  const icon = `<i class="fa-solid fa-people-group icon yellow"></i>`;
  top10Button(gameArray, "De 10 folkrikaste länderna", icon);
};
const top10Button = (top10, header, icon) => {
  const div = document.createElement("div");
  div.classList.add("button-box");
  const h3 = document.createElement("h3");
  h3.innerHTML = header;
  h3.style.color = "white";
  div.appendChild(h3);
  const p = document.createElement("p");
  p.innerHTML = icon;
  div.appendChild(p);

  const gameButton = document.createElement("button");
  gameButton.classList.add("game-button");
  gameButton.innerHTML = `Starta spelet`;
  gameButton.addEventListener("click", () => {
    list1.innerHTML = "";
    gameArea.innerHTML = "";
    startGame(top10, header);
  });
  div.appendChild(gameButton);
  chooseGameContainer.appendChild(div);
};
const countryStartsWith = (data) => {
  const div = document.createElement("div");
  div.classList.add("button-box");
  const h3 = document.createElement("h3");
  h3.innerHTML = "Länder på bokstaven...";
  h3.style.color = "white";
  div.appendChild(h3);
  const p = document.createElement("p");
  p.innerHTML = `<i class="fa-solid fa-book-open icon pink"></i>`;
  div.appendChild(p);

  const gameButton = document.createElement("button");
  gameButton.classList.add("game-button");
  gameButton.innerHTML = `Starta spelet`;
  gameButton.addEventListener("click", () => {
    list1.innerHTML = "";
    gameArea.innerHTML = "";
    showLetters(data);
  });

  div.appendChild(gameButton);
  chooseGameContainer.appendChild(div);
};
const showLetters = (data) => {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const headline = document.createElement("h2");
  headline.innerHTML = `Alla länder som startar på bokstaven...`;

  const container = document.createElement("div");
  container.classList.add("letter-container");
  letters.forEach((letter) => {
    const button = document.createElement("button");
    button.innerHTML = letter;
    button.classList.add("letter");
    button.addEventListener("click", () => {
      const header = `Alla länder som startar på ${letter.toUpperCase()}`;
      gameArea.innerHTML = "";
      const returnCountries = returnCountriesByLetter(data, letter);
      startGame(returnCountries, header);
    });
    container.appendChild(button);
  });
  gameArea.appendChild(headline);
  gameArea.appendChild(container);
};
const returnCountriesByLetter = (data, letter) => {
  const filterCountries = data.filter((item) => item.name.toLowerCase().startsWith(letter));
  return filterCountries;
};
const allCountriesInContinent = (data) => {
  const div = document.createElement("div");
  div.classList.add("button-box");
  const h3 = document.createElement("h3");
  h3.innerHTML = "Alla länder i kontinenten";
  h3.style.color = "white";
  div.appendChild(h3);
  const p = document.createElement("p");
  p.innerHTML = `<i class="fa-solid fa-earth-americas icon purple"></i>`;
  div.appendChild(p);

  const gameButton = document.createElement("button");
  gameButton.classList.add("game-button");
  gameButton.innerHTML = `Starta spelet`;
  gameButton.addEventListener("click", () => {
    list1.innerHTML = "";
    gameArea.innerHTML = "";
    displayContinents(data)
  });
  div.appendChild(gameButton);
  chooseGameContainer.appendChild(div);
};
const displayContinents = (data) => {
  const continents= ["Europe", "Asia", "North America", "South America", "Oceania", "Africa"]
  const headline = document.createElement("h2");
  headline.innerHTML = `Alla länder i kontinenten`;
  gameArea.appendChild(headline);
  const container = document.createElement("div");
  container.classList.add("letter-container");
  continents.forEach(continent=>{
    const button = document.createElement("button");
    button.innerHTML = continent;
    button.classList.add("continent-button")
    container.appendChild(button)

    button.addEventListener("click", ()=>{
     const filterData= matchCountrieswithContinent(data, continent);
     const header=`Alla länder i ${continent}`
     gameArea.innerHTML=""
     list1.innerHTML=""
     startGame(filterData, header)
    })
  })
  gameArea.appendChild(container)
};
const matchCountrieswithContinent= (data, continent)=>{
 return data.filter(country=>country.continent===continent)
}
const matchCapital = (data)=>{
  const div = document.createElement("div");
  div.classList.add("button-box");
  const h3 = document.createElement("h3");
  h3.innerHTML = "Vilken huvudstad tillhör landet";
  h3.style.color = "white";
  div.appendChild(h3);
  const p = document.createElement("p");
  p.innerHTML = `<i class="fa-solid fa-landmark icon blue"></i>`;
  div.appendChild(p);

  const gameButton = document.createElement("button");
  gameButton.classList.add("game-button");
  gameButton.innerHTML = `Starta spelet`;
  gameButton.addEventListener("click", () => {
    list1.innerHTML = "";
    gameArea.innerHTML = "";
    quizGame(data);
  });
  div.appendChild(gameButton);
  chooseGameContainer.appendChild(div);
}
const startGame = (data, headline) => {
  gameArea.classList.add("center-content");
  const firstBox = document.createElement("div");
  firstBox.classList.add("button-box");
  const h2 = document.createElement("h2");
  h2.innerHTML = headline;
  const p = document.createElement("p");
  p.innerHTML = "Svårighetsgraden baseras på tid";
  p.style.color = "white";

  firstBox.appendChild(h2);
  firstBox.appendChild(p);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  firstBox.appendChild(buttonContainer);
  const easyGame = document.createElement("button");
  easyGame.classList.add("game-button");
  easyGame.innerHTML = "Lätt";
  easyGame.addEventListener("click", () => {
    gameArea.innerHTML = "";
    top10GameOn(data, headline, 240);
  });
  buttonContainer.appendChild(easyGame);

  const medium = document.createElement("button");
  medium.innerHTML = "Medium";
  medium.classList.add("game-button");
  medium.classList.add("medium");
  medium.addEventListener("click", () => {
    gameArea.innerHTML = "";
    top10GameOn(data, headline, 180);
  });
  buttonContainer.appendChild(medium);

  const hard = document.createElement("button");
  hard.innerHTML = "Svår";
  hard.classList.add("game-button");
  hard.classList.add("hard");
  hard.addEventListener("click", () => {
    gameArea.innerHTML = "";
    top10GameOn(data, headline, 10);
  });
  buttonContainer.appendChild(hard);

  gameArea.appendChild(firstBox);
};
const top10GameOn = (data, headline, time) => {
  bottomLocation.scrollIntoView({block: "end", inline: "nearest"})
  score = 0;
  let correctGuess = [];
  gameArea.classList.remove("center-content");
  const timer = document.createElement("div");
  timer.classList.add("timer");
  const timeLeft = document.createElement("p");
  timeLeft.classList.add("time");
  const timerInterval = setInterval(() => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timeLeft.textContent = `${minutes}:${seconds}`;
    time--;
    if (time < 0) {
      clearInterval(timerInterval);
      endGame(data, correctGuess, score);
    }
   
  }, 1000);
  timer.appendChild(timeLeft);
  gameArea.appendChild(timer);
  const gameText = document.createElement("h2");
  gameText.innerHTML = headline;
  gameArea.appendChild(gameText);
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.classList.add("gameInput");
  const submit = document.createElement("button");
  submit.classList.add("gameButton");
  submit.innerHTML = "Skicka";

  const scoreText = document.createElement("p");
  scoreText.classList.add("time");
  scoreText.innerHTML = `${score}/${data.length}`;

  submit.addEventListener("click", (e) => {
    e.preventDefault();
    const guess = input.value.toLowerCase().trim();
    if (!controlAnswer(data, guess)) {
      console.log(data);
      return responsBackground("wrong");
    }
    if (checkIfExist(guess, correctGuess)) {
      return responsBackground("wrong");
    }
    addToCorrectGuess(data, guess, correctGuess);
    score++;
    list1.innerHTML = "";
    input.value = "";

    scoreText.innerHTML = `${score}/${data.length}`;
    responsBackground("right");
    correctGuess.forEach((correct) => {
      showAnswer(correct);
    });
    
    setTimeout(() => {
      if (score === data.length) {
        endGame(data, correctGuess, score);
      }
    }, 1000);
    
  });
  
  form.appendChild(input);
  form.appendChild(submit);
  gameArea.appendChild(form);
  gameArea.appendChild(scoreText);
};
const controlAnswer = (data, input) => {
  return data.some((country) => country.name.toLowerCase() === input);
};
const checkIfExist = (guess, array) => {
  return array.some((country) => country.name.toLowerCase() === guess);
};
const addToCorrectGuess = (data, guess, array) => {
  const find = data.find((country) => country.name.toLowerCase() === guess);
  return array.push(find);
};
const showAnswer = (data) => {
  const li = document.createElement("li");
  li.innerHTML = data.name;
  li.classList.add("correct");
  list1.appendChild(li);
};
const responsBackground = (answer) => {
  gameContainer.classList.add(answer);
  setTimeout(() => {
    gameContainer.classList.remove(answer);
  }, 200);
};
const endGame = (data, array, score) => {
  gameArea.innerHTML = "";
  const h2 = document.createElement("h2");
  h2.innerHTML = `Du fick ${score} av ${data.length}`;
  gameArea.appendChild(h2);
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("game-buttons-container");
  gameArea.appendChild(buttonContainer);

  const showAll = document.createElement("button");
  showAll.innerHTML = `Visa alla svaren`;
  showAll.classList.add("gameButton");
  showAll.classList.add("show-all");
  showAll.addEventListener("click", () => {
    returnAllAnswers(data, array);
  });
  buttonContainer.appendChild(showAll);

  const tryAgain = document.createElement("button");
  tryAgain.classList.add("gameButton");
  tryAgain.classList.add("try-again");
  tryAgain.innerHTML = `<i class="fa-solid fa-arrow-rotate-left"></i> Försök pånytt`;
  buttonContainer.appendChild(tryAgain);
  console.log(array);
};
const returnAllAnswers = (data, array) => {
  const rightOrWrong = data.map((country) => {
    const exist = array.includes(country);
    country.exist = exist;
    return country;
  });
  list1.innerHTML = "";
  rightOrWrong.forEach((country, index) => {
    showResult(country, index);
  });
};
const showResult = (country, index) => {
  const li = document.createElement("li");
  li.classList.add("result");
  if (!country.exist) {
    li.classList.add("wrong");
  }
  const name = document.createElement("p");
  name.innerHTML = `#${index + 1} ${country.name}`;
  name.classList.add("information");
  li.appendChild(name);

  list1.appendChild(li);
};
const quizGame= (data)=>{
  gameArea.classList.add("center-content");
  const firstBox = document.createElement("div");
  firstBox.classList.add("button-box");
  const headline = document.createElement("h2");
  headline.innerHTML = "Matcha huvudstad med land";
  const p = document.createElement("p");
  p.innerHTML = "Svårighetsgraden baseras på tid";
  p.style.color = "white";

  firstBox.appendChild(headline);
  firstBox.appendChild(p);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  firstBox.appendChild(buttonContainer);
  const easyGame = document.createElement("button");
  easyGame.classList.add("game-button");
  easyGame.innerHTML = "Långt spel";
  easyGame.addEventListener("click", () => {
    gameArea.innerHTML = "";
    startQuizGame(data, 240);
  });
  buttonContainer.appendChild(easyGame);

  const medium = document.createElement("button");
  medium.innerHTML = "Medel långt";
  medium.classList.add("game-button");
  medium.classList.add("medium");
  medium.addEventListener("click", () => {
    gameArea.innerHTML = "";
    startQuizGame(data, 180)
  });
  buttonContainer.appendChild(medium);

  const hard = document.createElement("button");
  hard.innerHTML = "Kort spel";
  hard.classList.add("game-button");
  hard.classList.add("hard");
  hard.addEventListener("click", () => {
    gameArea.innerHTML = "";
    startQuizGame(data, 30);
  });
  buttonContainer.appendChild(hard);

  gameArea.appendChild(firstBox);
}
const startQuizGame = (data, time)=>{
let answers= [];
score=0
const timer = document.createElement("div");
  timer.classList.add("timer");
  const timeLeft = document.createElement("p");
  timeLeft.classList.add("time");
  const timerInterval = setInterval(() => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timeLeft.textContent = `${minutes}:${seconds}`;
    time--;
    if (time < 0) {
      clearInterval(timerInterval);
      endQuiz(answers)
    }
  }, 1000);
  timer.appendChild(timeLeft);
  gameArea.appendChild(timer);
  getRandomArray(data, answers)

}
const scrambleArray= (data)=>{
 return data.sort(() => Math.random() - 0.5);
}
const getRandomArray= (data, answers)=>{
  console.log(answers)
  const gameArray=[]
  const index = Math.floor(Math.random() * data.length);
  const rightAnswer= data[index];
  rightAnswer.answer=true;
  gameArray.push(rightAnswer)
  data.splice(index, 1);

  while (gameArray.length < 4) {
    const item = Math.floor(Math.random() * data.length);
    if (!gameArray.includes(data[item])) {
      data[item].answer=false
        gameArray.push(data[item]);
    }
}
scrambleArray(gameArray)
showQuiz(gameArray, answers, data)
}
const showQuiz=(gameArray, answers, data)=>{
quizcontainer.innerHTML="";
const headline=document.createElement("h2");
quizcontainer.appendChild(headline);

const scoreSheet= document.createElement("p");
scoreSheet.classList.add("score")
scoreSheet.innerHTML=`${score}/${answers.length}`
quizcontainer.appendChild(scoreSheet)

const buttonContainer= document.createElement("div");
buttonContainer.classList.add("button-container");
quizcontainer.appendChild(buttonContainer)

gameArray.forEach(country=>{
 if(country.answer){
  headline.innerHTML=`Huvudstaden i ${country.name}`
 } 
 const button= document.createElement("button");
 button.classList.add("quizButton")
 button.innerHTML=`${country.capital}`
 button.value=`${country.answer}`
 button.addEventListener("click", ()=>{
  if(button.value==="true"){
    score++
    answers.push(country)
    button.style.background="green"
    setTimeout(() => {
      getRandomArray(data,answers)
    }, 700);
  }else{
  const rightAnswer=findCorrectAnswer(gameArray)
  rightAnswer.yourGuess=`${country.capital} (${country.name})`;
  button.style.background="red"
  answers.push(rightAnswer);
  setTimeout(() => {
    getRandomArray(data,answers)
  }, 700);
  }
 })
 buttonContainer.appendChild(button)
 
})
}
const findCorrectAnswer = (array)=>{
  return array.find(arr=>arr.answer===true)
}
const endQuiz= (arr)=>{
  gameContainer.innerHTML=""
  quizcontainer.innerHTML=""
  const h2=document.createElement("h2");
  h2.innerHTML=`Du fick ${score} av ${arr.length}`
  gameContainer.appendChild(h2);
  const list= document.createElement("ul");
  list.classList.add("gamelist")
  gameContainer.appendChild(list)
  arr.forEach(ans=>{
    const li= document.createElement("li");
    li.classList.add("result");
    if(ans.yourGuess){
      li.innerHTML=`Huvudstaden i ${ans.name} = ${ans.capital}, din gissning ${ans.yourGuess}`
      li.classList.add("wrong");

    }else{
      li.innerHTML= `Huvudstaden i ${ans.name} = ${ans.capital}`
    }
    list.appendChild(li)
  })
}
