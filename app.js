let controller;
let slideScene;
let pageScene;

function animateSlides() {
    //Initiallize controller
    controller = new ScrollMagic.Controller();
    //Selecting all slide and nav-header
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');
    //loop over all slide and select reveal-img, img and reveal-text
    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');

        //Animation#1
        //Animating using GSAP
        //creating animation timeline
        const slideTl = gsap.timeline({
            defaults: { duration: 1, ease: 'power2.inOut' }
        });
        slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' });
        slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
        slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');
        slideTl.fromTo(nav, { y: '-100%' }, { y: '0%' }, '-=0.5');
        //Create a scene to animate each slide when we scroll (Animation#1)
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        }).setTween(slideTl).addIndicators({ colorTrigger: 'white', name: 'slide' }).addTo(controller);

        //Animation#2
        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        pageTl.fromTo(nextSlide, { y: '0%' }, { y: '50%' });
        pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
        pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.15');
        //Create a scene for animation#2
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0
        }).setPin(slide, { pushFollowers: false }).setTween(pageTl).addIndicators({ colorTrigger: 'white', name: 'page', indent: 200 }).addTo(controller);
    });
}

animateSlides();