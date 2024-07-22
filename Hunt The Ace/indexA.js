  
  {/* <div class="card">
    <div class="card-inner">
      <div class="card-front">
        <img src="images/card-JackClubs.png" alt="" class="card-img">
      </div>
      <div class="card-back">
        <img src="images/card-back-Blue.png" alt="" class="card-img">
      </div>
    </div>
  </div>  */}
  

const cardObjectDefinitions = [
  {id:1, imagePath: 'images/card-KingHearts.png'},
  {id:2, imagePath: 'images/card-JackClubs.png'},
  {id:3, imagePath: 'images/card-QueenDiamonds.png'},
  {id:4, imagePath: 'images/card-AceSpades.png'}
]

const cardBackImgPath = 'image/card-back-blue.png'

const cardContainerElem = document.querySelector('.card-container')

function createCard(cardItem){
  //create div element that make up a card
  const cardElem = createElement('div')
  const cardInnerElem = createElement('div')
  const cardFrontElem = createElement('div')
  const cardBackElem = createElement('div')

  //create front and back image elements for a card
  const cardFrontImg = createElement('img');
  const cardBackImg = createElement('img')

  //add class and id to card elemnt
  addClassToElement(cardItem, 'card')
  addidToElement(cardElem, cardItem.id)

  //add class to inner card element
  addClassToElement(cardInnerElem, 'card-inner')

  //add class to front card elemnt
  addClassToElement(cardFrontElem, 'card-front')

  //add class to back card element
  addClassToElement(cardBackElem, 'card-back')

  //add src attributr and appropriate value to img element - back of card
  addSrcToImageElem(cardBackImg , cardBackImgPath)

  //add src attributr and appropriate value to img element - front of card
  addSrcToImageElem(cardFrontImg, cardItem.imagePath)

  //asign class to front image element of back of card
  addClassToElement(cardBackImg , 'card-img')

  //asign class to front image element of front of card
  addClassToElement(cardFrontImg, 'card-img')

  //add front image element as child element to front card element
  addChildElement(cardFrontElem, cardFrontImg)

  //add back image element as child element to back card element
  addChildElement(cardBackElem, cardBackImg)

  //add front card element as child element to inner card element
  addChildElement(cardInnerElem, cardFrontElem)

  //add back card element as child element to inner card element
  addChildElement(cardInnerElem, cardBackElem)

  //add inner card element as child element to card element
  addChildElement(cardElem, cardInnerElem)
  
}
function createElement(elemType){
  return document.createElement(elemType)
}

function addClassToElement(elem, className){
  elem.classList.add(className);
}

function addidToElement(elem, id){
  elem.id = id
}

function addSrcToImageElem(imgElem, src){
  imgElem.src = src
}

function addChildElement(parentElem, childElem){
  parentElem.appendChild(childElem)
}