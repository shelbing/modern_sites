console.log("Debugging KomootSection slider");
const checkElements = () => {
  console.log("Slider container:", document.querySelector('.komoot-slider-container'));
  console.log("Slider:", document.querySelector('.komoot-slider'));
  console.log("Slides:", document.querySelectorAll('.komoot-slide').length);
  console.log("Prev button:", document.querySelector('.prev'));
  console.log("Next button:", document.querySelector('.next'));
  console.log("Dots container:", document.querySelector('.dots-container'));
};
setTimeout(checkElements, 2000);
