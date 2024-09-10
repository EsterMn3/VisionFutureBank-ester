'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault(); //so the page wont jump to the start of the page
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
//btnsOpenModal is a node list because of the querySelectorAll
//node list is not an array but it still has the foreach method
//adding event listener to all buttons
//each one will be a btn and => on the button we call eventlistener
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button scrolling
//smooth scrolling after clicking a button
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); //we get the domrectange
  console.log(e.target.getBoundingClientRect()); //the button we click

  //the new and easiest version
  section1.scrollIntoView({ behavior: 'smooth' });
});
//////////////////////////////////

//Page navigation
/*
//this will be repeated too many times
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault(); //so it wont take the # and id in html
    const id = this.getAttribute('href'); //not this.href because thats the absolute url
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/
//event deligation
//1.add eventlistener to common parent element
//2.Determine what eleement originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); //wherever we are clicking nothing should happen
  //matching strategy - if the target has the nav link class
  if (e.target.classList.contains('nav__link')) {
    //e.target on the element that is clocked
    const id = e.target.getAttribute('href'); //not this.href because thats the absolute url
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////
//Tabbed component
//event deligations
//we need to attach the event handler on the common parent element of all the elements were interested in
tabsContainer.addEventListener('click', function (e) {
  //even if we click the number01,02 we need to get the button with class .operations__tab
  const clicked = e.target.closest('.operations__tab'); //finds the closest paret with the .operations__tab classname

  // Guard clause- when there is nothing clicked we finish the function, the code below wont be excecuted
  ///when clicking outside the buttons nothing happens
  if (!clicked) return;

  // Remove active class in every tab, to put the buttons down
  //and remove the content active
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`) //the data-tab
    .classList.add('operations__content--active'); //when is not active display is none, otherwise is grid and shown in website
});

///////////////////////////////////////
// Menu fade animation
//we should not attach event listener to all the links but use event deligation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    //we dont need closest because we dont have other eleements we can accidentally click
    const link = e.target; //the element we are working with
    //we go up in the paret nav and then search for elements that have classes nav__link and img
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      //so if we are in mouseover the elemeents we arent hovering are going to get opacity 0.5
      //but if we move out (mouseout) of the nav the opaity of each element goes to 1
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
//mouseover bubbles,mouseenter(opposite mouseleave) doesnt
//bind method creates a copy of the function that is called on, and sets 'this' to whatever value we pass to bind
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API
//target element is h1-we want to displaz navigation when header is completelz out of view

const header = document.querySelector('.header');
//dznamic height, becasue with responsiveness the height of nav changes
const navHeight = nav.getBoundingClientRect().height;

//the functionalz we want to happen
const stickyNav = function (entries) {
  const [entry] = entries; //destructuring to get the first elemenet-1 threshold
  // console.log(entry);

  if (!entry.isIntersecting)
    //when the header is not intersecting = false
    nav.classList.add('sticky');
  else nav.classList.remove('sticky'); //when we move into the header it has to be removed
};

//we observe header element
//tthe callback function is stzckz nav and options are defined after it Ç'
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //the element that we want our target element to intersect(viewport)
  //0- our callback will trigger each time the target elements moves completely out/in the view
  threshold: 0, //the % of intersection on which the observer callback will be called. % that we want to have visible in our root/viewport
  rootMargin: `-${navHeight}px`, //nav appears exactly 90px before the threshold was reached
});

//So the callback function will get called each time that the observed element,
//(target element), is intersecting the root element at the threshold that we defined

//we use the headerobserver to observe the header
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections as me scroll close to them
//removing the class section--hidden as we approach the sections
const allSections = document.querySelectorAll('.section');

//we have 1 threshold so we get the entry from the entries using destructuring
const revealSection = function (entries, observer) {
  const [entry] = entries;

  //if the target is not intersecting return
  if (!entry.isIntersecting) return;

  //we want to know which section is intersectioning the viewport
  //else the function wont be returned and the rest of the code will be excetuted
  entry.target.classList.remove('section--hidden');
  //we unobserve because if we keep scrolling the sections are still getting observed
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, //the section will reveal when is 15% visible
});

//looping over the nodelist
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden'); //adding the class in each section
});

// Lazy loading images
//1. we select images that have data-src as a property
const imgTargets = document.querySelectorAll('img[data-src]');

//4.callback function, this is where out functionality is
const loadImg = function (entries, observer) {
  const [entry] = entries; ///1 threshold

  if (!entry.isIntersecting) return;

  //if they are intersecting
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //once the new image is finished loading, it will emit the load event
  //removing the class with blurred filter after the loading is done
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  //stop observing the images
  observer.unobserve(entry.target);
};

//2.image observer, callbackfunction:loadImg and options{root...}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //so when we approach the images they are fully loaded(200px before we reach them)
});

//3. looping over the targets to observe each image
imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  //we put it all in a ufunction, to dont pollute the globalnamespace
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0; //when we go to the next we ++, otherwise --
  const maxSlide = slides.length; //max slide we can go

  //DOTS
  // Functions
  const createDots = function () {
    //looping over slides
    slides.forEach(function (_, i) {
      //_ is the convention throw away variable, because we dont need the slides, oly the index
      dotContainer.insertAdjacentHTML(
        //creating html elements
        'beforeend', //adding it as the last child
        `<button class="dots__dot" data-slide="${i}"></button>` //html code
      );
    });
  };

  //we change the background color of the dots that is active(based on the photos shown in carousel)
  const activateDot = function (slide) {
    //selecting all the dots and removing the dot--active class from them
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    //adding the active class only in the slide we are interested in
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`) //based on the data slide atribute
      .classList.add('dots__dot--active');
  };
  //we pass the numer of the slide we want to go to
  const goToSlide = function (slide) {
    //putting the slides side by side
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      //-100% 0% ,100%,200%, 300%
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      //adding -1 to make it zero based
      curSlide = 0; //returning to the begining of the slide
    } else {
      curSlide++;
    }

    goToSlide(curSlide); //going to the currentslide
    activateDot(curSlide); //activate the dot on the current slide
  };

  //previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      //when curslide is 0 and we press previous button, it goes to the last photo of carousel
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //functions that have to be excecuted
  const init = function () {
    goToSlide(0); //once the application starts it goes immidiately in slide 0
    createDots();

    activateDot(0); //so when we first enter the first dot will be activated
  };
  init();

  // Event handlers, going to the next/previous slide
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //to move the slides with the keybord keys < and >
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); //short circuiting
  });

  //using event deligation,we attach the evenet handler to the common parent
  //when we click one of the dots it will go to that excact photo
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //if we click outside the dots nothing happens
      //const slide = e.target.dataset.slide ;
      //destructuring the dataset object
      const { slide } = e.target.dataset;
      goToSlide(slide); //going to the slide that we read from the dataset
      activateDot(slide);
    }
  });
};
slider(); //calling the function

//////////////////////////////////
//Selecting, creating and deleting elements
/*
console.log(document.documentElement); //for the entire html
console.log(document.head); //for the head
console.log(document.body); //for the body

const header = document.querySelector('.header');
const allSectuins = document.querySelectorAll('.section'); //we have multiple elements with section class
console.log(allSectuins); //a node list of all sections

document.getElementById('section--1');
document.getElementsByTagName('button'); //all elements with the name of buttons. gives an htmlcollection
//htmlcollection is updated automatically while nodelists are not

document.getElementsByClassName('btn'); //gives a htlm collections

//creating and inserting elements
//.insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent =
  'We use cookies for improved functionallity and analytics.';
message.innerHTML =
  'We use cookies for improved functionallity and analytics. <button button class="btn btn--close-cookie">Got it</button>';
*/
/*
//it can not be added multiple times, only one time
//prepend adds it like the first child,apend as the last child
header.prepend(message); //inserting cookies in header, it is in our dom/html
//header.append(message);

//if we want in in two or more places we clone it (prepand and append as a clone)
header.append(message.cloneNode(true));
*/

/*
header.before(message); //inserting the message before the element header, as a sibling
//header.after(message);


header.append(message);

//delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); //when clicking the btn the cookie message is removed

    //back then we had to move up on the dom tree and removechild-DOM traversing
    //message.parentElement.removeChild(message);
  });

//styles (these are inline)
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color); //since its defined in stylesheet we cant get it like this
//but this way
console.log(getComputedStyle(message).color);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered'); //chaning costum properties that are in :root specified

//atributtes (src,alt, class)
const logo = document.querySelector('.nav__logo');
//we can access standart properties that are defined by html
console.log(logo.alt); //alt is a standard property
console.log(logo.className);

//for properties that we specify
console.log(logo.designer); //undefined
console.log(logo.getAttribute('designer')); //returns the value of the attribute
logo.setAttribute('company', 'Bankist');

console.log(logo.src); //http://127.0.0.1:5500/13-Advanced-DOM-Bankist/starter/img/logo.png
console.log(logo.getAttribute('src')); //img/logo.png

const link = document.querySelector('.nav__link--btn');
console.log(link.href); //http://127.0.0.1:5500/13-Advanced-DOM-Bankist/starter/#
console.log(link.getAttribute('href')); //#

//Data atributtes
//it has to start with data
console.log(logo.datas.versionNumber); //data-version-number : we convert it to cammelcase. 3.0

//Classes
logo.classList.add('j', 'c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

//smooth scrolling after clicking a button
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); //we get the domrectange
  console.log(e.target.getBoundingClientRect()); //the button we click

  console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset); //how px we scrolled from clicking the button

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //scrolling
  
  window.scrollTo(
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );
  window.scrollTo({
    left: s1coords.left + windowpageXOffset,
    right: s1coords.left + windowpageYOffset,
    behavior: 'smooth',
  });
  
  //the new and easiest version
  section1.scrollIntoView({ behavior: 'smooth' });
});


//type of events and event handlers
//hovering over an element
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('You are hovering the heading');

  h1.removeEventListener('mouseenter', alertH1); //so it will only happen once then it will be removed
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.addEventListener('mouseenter', alertH1), 3000); //eventlistener gets removed after 3 secs

//old ways of onmouseenter
h1.onmouseenter = function (e) {
  alert('You are hovering the heading');
};

//Bubbling
//rgb(255,255,555)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

//here we do not catch events in the capturing phase
document.querySelector('.nav__link').addEventListener('click', function (e) {
  console.log('LINK', e.target, e.currentTarget);
  //e.currentTarget-the target where the element is attached ===this
  this.style.backgroundColor = randomColor();

  //stop propagation
  // e.stopPropagation(); //the parents wont be clicked
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log('CONTAINER', e.target, e.currentTarget); //e.target-where the click first happened
  this.style.backgroundColor = randomColor();
});
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    console.log('NAV', e.target, e.currentTarget);
    this.style.backgroundColor = randomColor();
  },
  true
);
//when we click on nav__link the click is for 3 elements, because they are the parents of nav__link
//this is because of the bubbling


//DOM traversing
const h1 = document.querySelector('h1');

//getting all elements with highlight class, children of h1
console.log(h1.querySelectorAll('.highlight'));

//getting the direct children span, br ,span
console.log(h1.children);

//h1.firstElementChild.style.color = 'white';

//going upwards:parents
console.log(h1.parentNode); //header_title div
console.log(h1.parentElement); //same

h1.closest('.header').style.background = 'var(--gradient-secondary)'; //the closest parent element that has the class header, its painted in yellow
h1.closest('h1').style.background = 'var(--gradient-secondary)'; //the element h1 itself

//going sideways:siblings
console.log(h1.previousElementSibling); //null because h1 is the first child
console.log(h1.nextElementSibling); //h4

console.log(h1.parentElement.children); //we get all the childrens icluding h1
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)'; //all three siblings of h1 are 50% smaller
  }
});
*/

/*
///////////////////////////////////////
// Lifecycle DOM Events-from the moment the user enters the page, till he leaves it

//DOMContentLoaded - the event is fired by the document s soon as the HTML is completely parsed,
//which means that the HTML has been downloaded and been converted to the DOM tree.
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

//LOAD event is fired by the window as soon as not only the HTML is parsed, but also
//all the images and external resources like CSS files are also loaded. So basically
//when the complete page has finished loading is when this event gets fired.
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

//beforeunload event-is created immidiately before the user is out to leave the page
//when the user clicks x to leave we generate a popup to ask him if hes sure
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
*/

//cards animation
/*
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.card');

  const positionCards = () => {
    const centerCardIndex = Math.floor(cards.length / 2);

    cards.forEach((card, index) => {
      // Distance from the center
      const distanceFromCenter = index - centerCardIndex;

      // Calculate rotation and translation based on distance from center
      let xOffset = distanceFromCenter * 100; // Space between cards horizontally
      let rotateAngle = distanceFromCenter * 15; // Slight rotation difference

      // Apply transform to each card
      card.style.transform = `translateX(${xOffset}px) rotate(${rotateAngle}deg)`;

      // Adjust z-index to ensure proper stacking of the cards
      card.style.zIndex = `${10 - Math.abs(distanceFromCenter)}`;
    });
  };

  // Initial positioning
  positionCards();

  // Optional: Recalculate on window resize
  window.addEventListener('resize', positionCards);
});
*/
// JavaScript to position the middle card on top
function stackCards() {
  const cards = document.querySelectorAll('.card');
  if (cards.length > 1) {
    // Reset all cards z-index
    cards.forEach(card => {
      card.style.zIndex = '10';
    });

    // Set the middle card to be on top
    const middleCard = cards[Math.floor(cards.length / 2)];
    middleCard.style.zIndex = '20';
  }
}

// Call the function on page load
window.onload = stackCards;
