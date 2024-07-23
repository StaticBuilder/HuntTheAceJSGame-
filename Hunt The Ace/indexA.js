const cardObjectDefinitions = [
  { id: 1, imagePath: 'images/card-KingHearts.png' },
  { id: 2, imagePath: 'images/card-JackClubs.png' },
  { id: 3, imagePath: 'images/card-QueenDiamonds.png' },
  { id: 4, imagePath: 'images/card-AceSpades.png' }
];

const cardBackImgPath = 'images/card-back-blue.png'; // Corrected path

const cardContainerElem = document.querySelector('.card-container');

let cards = []

const playGameButtonElem = document.getElementById('playGame'); 

const collapsedGridAreaTemplate = '"a a" "a a"';//const collapsedGridAreaTemplate = '"a a"';
const originalGridAreaTemplate = '"a b" "c d"';
const cardCollectionCellClass = ".card-pos-a"

const numCards = cardObjectDefinitions.length

let cardPositions = []

loadGame();

function loadGame(){
  createCards();

  cards = document.querySelectorAll('.card')

  playGameButtonElem.addEventListener('click', startGame)

  console.log(cards);
}

function startGame(){
  initializeNewGame()
  startRound()
}

function initializeNewGame(){

}

function startRound(){
  initializeNewGame()
  collectCards()
  flipCards(true)
  shuffleCards()
}

function initializeNewRound(){

}

function collectCards(){
  transformGridArea(collapsedGridAreaTemplate)
  
}

function transformGridArea(areas){
  cardContainerElem.style.gridTemplateAreas = areas
}

function addCardToGridAreaCell(cellPositionClassName) {
  // Clear all cells before adding new cards
  const cells = document.querySelectorAll('.card-pos-a, .card-pos-b, .card-pos-c, .card-pos-d');
  cells.forEach(cell => cell.innerHTML = '');

  // Add all cards to their respective cells
  cards.forEach((card, index) => {
    const cellPositionClassName = mapCardIdToGridCell(card);
    const cellPositionElem = document.querySelector(cellPositionClassName);
    addChildElement(cellPositionElem, card);
  });
}

/* function addCardToGridAreaCellA(cellPositionClassName) {
  const cellPositionElem = document.querySelector(cellPositionClassName);

  // Clear the content of the cell before adding new cards
  cellPositionElem.innerHTML = '';

  // Add all cards to the specified cell and stack them
  cards.forEach((card, index) => {
    card.style.position = 'absolute';
    card.style.top = '50%';
    card.style.left = '50%';
    card.style.transform = 'translate(-50%, -50%)';
    addChildElement(cellPositionElem, card);
  });

  // Add the modified cell back to the card container
  cardContainerElem.appendChild(cellPositionElem);
}  */

  

function displayTopCardOnly() {
  // Clear all cells before adding new cards
  const cells = document.querySelectorAll('.card-pos-a, .card-pos-b, .card-pos-c, .card-pos-d');
  cells.forEach(cell => cell.innerHTML = '');

  // Add only the top card (the first card in the array) to the specified cell
  const topCard = cards[0];
  if (topCard) {
    const cellPositionElem = document.querySelector(cardCollectionCellClass);
    cellPositionElem.innerHTML = ''; // Clear any existing content

    // Make the cell fit the entire grid
    cellPositionElem.style.gridArea = 'a';

    // Center the top card within the grid cell
    cellPositionElem.style.display = 'flex';
    cellPositionElem.style.justifyContent = 'center';
    cellPositionElem.style.alignItems = 'center';

    topCard.style.position = 'relative';
    topCard.style.width = '162px';  // Set to normal size
    topCard.style.height = '220px'; // Set to normal size
    topCard.style.transform = 'none';
    
    cellPositionElem.appendChild(topCard);
  }
}
  

function shuffleCards()
{
  randomizeCardPositions()
  const id = setInterval(shuffle, 12)
  let shuffleCount = 0

  function shuffle()
  {
    if(shuffleCount == 500)
    {
      clearInterval(id)
      dealCards();
    }
    else {
      shuffleCount++;
      console.log(shuffleCount);
      if (shuffleCount === 1) {
        // Remove all cards and leave the top card only
        displayTopCardOnly();
      }
    }
  }
}

function randomizeCardPositions()
{
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

function dealCards(){
  addCardsToAppropriateCell();

  const areasTemplate = returnGridAreasMappedToCardPos();

  transformGridArea(areasTemplate)
}

function returnGridAreasMappedToCardPos()
{
  let firstPart = "";
  let secondPart = "";
  let areas = "";

  cards.forEach((card, index) => {
    if(cardPositions[index] == 1){
      areas += "a ";
    }
    else if(cardPositions[index] == 2){
      areas += "b ";
    }
    else if (cardPositions[index] == 3)
    {
      areas += "c ";
    }
    else if (cardPositions[index] == 4)
    {
      areas += "d ";
    }
    if(index == 1)
    {
      firstPart = areas.trim();
      areas = "";
    }
    else if (index == 3)
    {
      secondPart = areas.trim();
    }
  });

  return `"${firstPart}" "${secondPart}"`;
}

function addCardsToAppropriateCell(){
  cards.forEach((card) => {
    addCardToGridCell(card)
  })
}

function flipCard(card, flipToBack){
  const innerCardElem = card.firstChild;

  if(flipToBack && !innerCardElem.classList.contains('flip-it')){
    innerCardElem.classList.add('flip-it')
  }
  else if(innerCardElem.classList.contains('flip-it'))
  {
    innerCardElem.classList.remove('flip-it')
  }
}

function flipCards(flipToBack){
  cards.forEach((card, index) => {
    setTimeout(() => {
      flipCard(card, flipToBack)
    },  index * 100)
  })
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
