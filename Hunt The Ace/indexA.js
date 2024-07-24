const cardObjectDefinitions = [
  { id: 1, imagePath: 'images/card-KingHearts.png' },
  { id: 2, imagePath: 'images/card-JackClubs.png' },
  { id: 3, imagePath: 'images/card-QueenDiamonds.png' },
  { id: 4, imagePath: 'images/card-AceSpades.png' }
];

const aceId = 4;
const cardBackImgPath = 'images/card-back-blue.png';
const cardContainerElem = document.querySelector('.card-container');
let cards = [];

const playGameButtonElem = document.getElementById('playGame');
const collapsedGridAreaTemplate = '"a a" "a a"';
const originalGridAreaTemplate = '"a b" "c d"';
const cardCollectionCellClass = ".card-pos-a";

let gameInProgress = false;
let shufflingInProgress = false;
let cardsRevealed = false;

const numCards = cardObjectDefinitions.length;
let cardPositions = [];

const currentGameStatusElem = document.querySelector('.current-status');
const scoreContainerElem = document.querySelector('.header-score-container');
const scoreElem = document.querySelector('.score .badge');
const roundContainerElem = document.querySelector('.header-round-container');
const roundElem = document.querySelector('.round .badge');

const winColor = "green";
const loseColor = "red";
const primaryColor = 'black';

let roundNum = 0;
let maxRounds = 4;
let score = 0;

loadGame();

function gameOver() {
  updateStatusElement(scoreContainerElem, "none");
  updateStatusElement(roundContainerElem, "none");

  const gameOverMessage = `Game Over! Final Score - <span class='badge'>${score}</span>. Click 'Play Game' button to play again.`;
  updateStatusElement(currentGameStatusElem, "block", primaryColor, gameOverMessage);

  gameInProgress = false;
  playGameButtonElem.disabled = false;
}

function endRound() {
  setTimeout(() => {
    if (roundNum == maxRounds) {
      gameOver();
      return;
    } else {
      startRound();
    }
  }, 3000);
}

function chooseCard(card) {
  if (canChooseCard()) {
    evaluateCardChoice(card);
    flipCard(card, false);

    setTimeout(() => {
      flipCards(false);
      updateStatusElement(currentGameStatusElem, "block", primaryColor, "Card positions revealed");

      endRound();
    }, 3000);
    cardsRevealed = true;
  }
}

function updateStatusElement(elem, display, color, innerHTML) {
  elem.style.display = display;

  if (arguments.length > 2) {
    elem.style.color = color;
    elem.innerHTML = innerHTML;
  }
}

function outputChoiceFeedback(hit) {
  if (hit) {
    updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! 🎉🎉🎉🎉");
  } else {
    updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! ❌👎😭❌");
  }
}

function calculateScoreToAdd(roundNum) {
  switch(roundNum) {
    case 1: return 100;
    case 2: return 50;
    case 3: return 25;
    default: return 10;
  }
}

function calculateScore() {
  const scoreToAdd = calculateScoreToAdd(roundNum);
  score += scoreToAdd;
  updateScore();
}

function updateScore() {
  scoreElem.innerHTML = score;
}

function evaluateCardChoice(card) {
  if (card.id == aceId) {
    calculateScore();
    outputChoiceFeedback(true);
  } else {
    outputChoiceFeedback(false);
  }
}

function canChooseCard() {
  return gameInProgress && !shufflingInProgress && !cardsRevealed;
}

function loadGame() {
  createCards();
  cards = document.querySelectorAll('.card');

  cardFlyInEffect()
  

  playGameButtonElem.addEventListener('click', startGame);

  updateStatusElement(scoreContainerElem, "none")
  updateStatusElement(roundContainerElem, "none")
}

function startGame() {
  initializeNewGame();
  startRound();
}

function initializeNewGame() {
  score = 0;
  roundNum = 0;

  shufflingInProgress = false;
  gameInProgress = true;

  updateStatusElement(scoreContainerElem, "flex");
  updateStatusElement(roundContainerElem, "flex");

  updateScore();
  updateRound();
}

function updateRound() {
  roundElem.innerHTML = roundNum;
}

function startRound() {
  initializeNewRound();
  collectCards();
  flipCards(true);
  shuffleCards();
}

function initializeNewRound() {
  roundNum++;
  updateRound();
  playGameButtonElem.disabled = true;

  gameInProgress = true;
  shufflingInProgress = true;
  cardsRevealed = false;
}

function collectCards() {
  transformGridArea(collapsedGridAreaTemplate);
}

function transformGridArea(areas) {
  cardContainerElem.style.gridTemplateAreas = areas;
}

function addCardToGridAreaCell(cellPositionClassName) {
  const cells = document.querySelectorAll('.card-pos-a, .card-pos-b, .card-pos-c, .card-pos-d');
  cells.forEach(cell => cell.innerHTML = '');

  cards.forEach((card, index) => {
    const cellPositionClassName = mapCardIdToGridCell(card);
    const cellPositionElem = document.querySelector(cellPositionClassName);
    addChildElement(cellPositionElem, card);
  });
}

function displayAllCardsStacked() {
  // Clear all card positions
  const cells = document.querySelectorAll('.card-pos-a, .card-pos-b, .card-pos-c, .card-pos-d');
  cells.forEach(cell => cell.innerHTML = '');

  // Get the container where cards will be stacked
  const stackContainer = document.querySelector(cardCollectionCellClass);
  stackContainer.innerHTML = '';

  // Style the container
  stackContainer.style.gridArea = 'a'; // or adjust based on your layout
  stackContainer.style.position = 'relative'; // Ensure it's positioned correctly
  stackContainer.style.width = '162px'; // Match card width
  stackContainer.style.height = '220px'; // Match card height
  stackContainer.style.display = 'flex';
  stackContainer.style.justifyContent = 'center';
  stackContainer.style.alignItems = 'center';
  stackContainer.style.overflow = 'hidden'; // Ensure cards are contained

  // Stack all cards on top of each other
  cards.forEach((card, index) => {
    card.style.position = 'absolute'; // Position all cards absolutely within the container
    card.style.width = '162px'; // Match card width
    card.style.height = '220px'; // Match card height
    card.style.top = '0'; // Align all cards to the top
    card.style.left = '0'; // Align all cards to the left
    card.style.zIndex = cards.length - index; // Ensure cards stack correctly with the last card on top
    stackContainer.appendChild(card); // Add card to the container
  });
}


/* function displayAllCardsStacked() {
  // Clear all card positions
  const cells = document.querySelectorAll('.card-pos-a, .card-pos-b, .card-pos-c, .card-pos-d');
  cells.forEach(cell => cell.innerHTML = '');

  // Get the container where cards will be stacked
  const stackContainer = document.querySelector(cardCollectionCellClass);
  stackContainer.innerHTML = '';

  // Style the container
  stackContainer.style.gridArea = 'a'; // or adjust based on your layout
  stackContainer.style.position = 'relative'; // Ensure it's positioned correctly
  stackContainer.style.width = '162px'; // Match card width
  stackContainer.style.height = '220px'; // Match card height
  stackContainer.style.display = 'flex';
  stackContainer.style.justifyContent = 'center';
  stackContainer.style.alignItems = 'center';
  stackContainer.style.overflow = 'hidden'; // Ensure cards are contained

  // Stack all cards on top of each other
  cards.forEach((card, index) => {
    card.style.position = 'absolute'; // Position all cards absolutely within the container
    card.style.width = '162px'; // Match card width
    card.style.height = '220px'; // Match card height
    card.style.top = '0'; // Align all cards to the top
    card.style.left = '0'; // Align all cards to the left
    card.style.zIndex = index; // Ensure cards stack correctly
    stackContainer.appendChild(card); // Add card to the container
  });
} */


/* function displayTopCardOnly() {
  const cells = document.querySelectorAll('.card-pos-a, .card-pos-b, .card-pos-c, .card-pos-d');
  cells.forEach(cell => cell.innerHTML = '');

  const topCard = cards[0];
  if (topCard) {
    const cellPositionElem = document.querySelector(cardCollectionCellClass);
    cellPositionElem.innerHTML = '';

    cellPositionElem.style.gridArea = 'a';
    cellPositionElem.style.display = 'flex';
    cellPositionElem.style.justifyContent = 'center';
    cellPositionElem.style.alignItems = 'center';

    topCard.style.position = 'relative';
    topCard.style.width = '162px';
    topCard.style.height = '220px';
    topCard.style.transform = 'none';
    
    cellPositionElem.appendChild(topCard);
  }
} */


  function cardFlyInEffect()
  {
      const id = setInterval(flyIn, 5)
      let cardCount = 0
  
      let count = 0
  
      function flyIn()
      {
          count++
          if(cardCount == numCards)
          {
              clearInterval(id)
              playGameButtonElem.style.display = "inline-block"            
          }
          if(count == 1 || count == 250 || count == 500 || count == 750)
          {
              cardCount++
              let card = document.getElementById(cardCount)
              card.classList.remove("fly-in")
          }
      }
  
  
  
  }

function removeShuffleClasses()
{
    cards.forEach((card) =>{
        card.classList.remove("shuffle-left")
        card.classList.remove("shuffle-right")
    })
}

function animateShuffle(shuffleCount) {
  const random1 = Math.floor(Math.random() * numCards) + 1;
  const random2 = Math.floor(Math.random() * numCards) + 1;

  let card1 = document.getElementById(random1);
  let card2 = document.getElementById(random2);

  if (card1 && shuffleCount % 4 === 0) {
      card1.classList.toggle("shuffle-left");
      card1.style.zIndex = 100;
  }
  if (card2 && shuffleCount % 10 === 0) {
      card2.classList.toggle("shuffle-right");
      card2.style.zIndex = 200;
  }
}

function shuffleCards() {
  randomizeCardPositions();
  let shuffleCount = 0;
  const id = setInterval(() => {
      shuffleCount++;
      animateShuffle(shuffleCount);

      if (shuffleCount === 500) {
          clearInterval(id);
          shufflingInProgress = false;
          removeShuffleClasses();
          dealCards();
          updateStatusElement(currentGameStatusElem, "block", primaryColor, "Please click the card that you think is the Ace of Spades 🤔💭");
      } else {
          updateStatusElement(currentGameStatusElem, "block", primaryColor, "Shuffling🔃🔃🔃🔃");
          if (shuffleCount === 1) {
              displayTopCardOnly();
          }
      }
  }, 12);
}

function randomizeCardPositions() {
  for (let i = cardPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardPositions[i], cardPositions[j]] = [cardPositions[j], cardPositions[i]];
  }
}

function createCards() {
  cardObjectDefinitions.forEach((cardItem) => {
    createCard(cardItem);
  });
}

function dealCards() {
  addCardsToAppropriateCell();
  const areasTemplate = returnGridAreasMappedToCardPos();
  transformGridArea(areasTemplate);
}

function returnGridAreasMappedToCardPos() {
  let firstPart = "";
  let secondPart = "";
  let areas = "";

  cards.forEach((card, index) => {
    if (cardPositions[index] == 1) {
      areas += "a ";
    } else if (cardPositions[index] == 2) {
      areas += "b ";
    } else if (cardPositions[index] == 3) {
      areas += "c ";
    } else if (cardPositions[index] == 4) {
      areas += "d ";
    }
    if (index == 1) {
      firstPart = areas.trim();
      areas = "";
    } else if (index == 3) {
      secondPart = areas.trim();
    }
  });

  return `"${firstPart}" "${secondPart}"`;
}

function addCardsToAppropriateCell() {
  cards.forEach((card) => {
    addCardToGridCell(card);
  });
}

function flipCard(card, flipToBack) {
  const innerCardElem = card.firstChild;

  if (flipToBack && !innerCardElem.classList.contains('flip-it')) {
    innerCardElem.classList.add('flip-it');
  } else if (innerCardElem.classList.contains('flip-it')) {
    innerCardElem.classList.remove('flip-it');
  }
}

function flipCards(flipToBack) {
  cards.forEach((card, index) => {
    setTimeout(() => {
      flipCard(card, flipToBack);
    }, index * 100);
  });
}

function createCard(cardItem) {
  // Create div elements that make up a card
  const cardElem = createElement('div');
  const cardInnerElem = createElement('div');
  const cardFrontElem = createElement('div');
  const cardBackElem = createElement('div');

  // Create front and back image elements for a card
  const cardFrontImg = createElement('img');
  const cardBackImg = createElement('img');

  // Add class and id to card element
  addClassToElement(cardElem, 'card');
  addClassToElement (cardElem, 'fly-in');
  addIdToElement(cardElem, cardItem.id);

  // Add class to inner card element
  addClassToElement(cardInnerElem, 'card-inner');

  // Add class to front card element
  addClassToElement(cardFrontElem, 'card-front');

  // Add class to back card element
  addClassToElement(cardBackElem, 'card-back');

  // Add src attribute and appropriate value to img element - back of card
  addSrcToImageElem(cardBackImg, cardBackImgPath);

  // Add src attribute and appropriate value to img element - front of card
  addSrcToImageElem(cardFrontImg, cardItem.imagePath);

  // Assign class to front image element of back of card
  addClassToElement(cardBackImg, 'card-img');

  // Assign class to front image element of front of card
  addClassToElement(cardFrontImg, 'card-img');

  // Add front image element as child element to front card element
  addChildElement(cardFrontElem, cardFrontImg);

  // Add back image element as child element to back card element
  addChildElement(cardBackElem, cardBackImg);

  // Add front card element as child element to inner card element
  addChildElement(cardInnerElem, cardFrontElem);

  // Add back card element as child element to inner card element
  addChildElement(cardInnerElem, cardBackElem);

  // Add inner card element as child element to card element
  addChildElement(cardElem, cardInnerElem);

  // Add card element as child element to appropriate grid cell
  addCardToGridCell(cardElem);

  initializeCardPositions(cardElem)

  attachClickEventHandlerToCard(cardElem)
}

function attachClickEventHandlerToCard(card){
  card.addEventListener('click', () => chooseCard(card))
}

function initializeCardPositions(card)
{
  cardPositions.push(card.id)
}

function createElement(elemType) {
  return document.createElement(elemType);
}

function addClassToElement(elem, className) {
  elem.classList.add(className);
}

function addIdToElement(elem, id) {
  elem.id = id;
}

function addSrcToImageElem(imgElem, src) {
  imgElem.src = src;
}

function addChildElement(parentElem, childElem) {
  parentElem.appendChild(childElem);
}

function addCardToGridCell(card) {
  const cardPositionClassName = mapCardIdToGridCell(card);

  const cardPostElem = document.querySelector(cardPositionClassName);

  if (cardPostElem) {
    addChildElement(cardPostElem, card);
  } else {
    console.error(`Could not find element with class ${cardPositionClassName}`);
  }
}

function mapCardIdToGridCell(card) {
  if (card.id == 1) {
    return '.card-pos-a';
  } else if (card.id == 2) {
    return '.card-pos-b';
  } else if (card.id == 3) {
    return '.card-pos-c';
  } else if (card.id == 4) {
    return '.card-pos-d';
  }
}
