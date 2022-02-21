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
        const slideTl = gsap.timeline({defaults: { duration: 1, ease: 'power2.inOut' }});
        slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' });
        slideTl.fromTo(img, { scale: 1.5 }, { scale: 1 }, '-=1');
        slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');
        slideTl.fromTo(nav, { y: '-100%' }, { y: '0%' },'-=0.75');

        //Create a scene to animate each slide when we scroll (Animation#1)
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        }).setTween(slideTl)
        .addIndicators({ colorTrigger: 'white', name: 'slide' })
        .addTo(controller);

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
        }).setPin(slide, { pushFollowers: false })
        .setTween(pageTl)
        .addIndicators({ colorTrigger: 'white', name: 'page', indent: 200 })
        .addTo(controller);
    });
}
const mouse = document.querySelector('.cursor');
const mouseTxt = mouse.querySelector('.cursor-text');
const burger = document.querySelector('burger');


function cursor(e){
    mouse.style.top = e.pageY + 'px';
    mouse.style.left = e.pageX + 'px';
}



function activeCursor(e){
    const item = e.target;
 
    if(item.id === "logo" || item.classList.contains('burger')){
        mouse.classList.add('activeHover');
    }
    else{
        mouse.classList.remove('activeHover'); 
    }

    if(item.classList.contains('explore')){
        mouse.classList.add('activeExp');
        gsap.to(".title-swipe", 1, {y:"0%"})
        mouseTxt.innerText = 'Tap'
    }else{
        mouse.classList.remove('activeExp');
        mouseTxt.innerText = ''
        gsap.to(".title-swipe", 1, {y:"100%"})
    }
}

function navToggle(e) {
    if (!e.target.classList.contains('active')) {
        e.target.classList.add('active');
        gsap.to('.line1', 0.5, { rotate: '45', y: 5, background: "black" });
        gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: "black" });
        gsap.to('#logo', 1, { color: 'black' });
        gsap.to('.nav-bar', 1, { clipPath: 'circle(2500px at 100% -10%)' });
        document.body.classList.add('hide');
        
    } else {
        e.target.classList.remove('active');
        gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: "white" });
        gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: "white" });
        gsap.to('#logo', 1, { color: 'white' });
        gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' });
        document.body.classList.remove('hide');
    }
}

//Page transitions
barba.init({
    views: [
        {
            namespace: 'home',
            beforeEnter() {
                animateSlides();
            },
            beforeLeave() {
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
            }
        },
        {
            namespace: 'exp1',
            beforeEnter() {
                gsap.fromTo('.nav-header', 1, {y: '100%'}, {y: '0%', ease: 'power2.inOut'})
            }
        }
    ],
    transitions: [
        {
            leave({current, next}) {
                let done = this.async();
                //Animation
                const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
                tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
                tl.fromTo('.swipe', 0.75, { x: '-100%' }, { x: '0%', stagger: 0.25, onComplete: done }, '-=0.5');
            },
            enter({current, next}) {
                let done = this.async();
                //Scroll to top of the page
                window.scrollTo(0,0);
                //Animation
                const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
                tl.fromTo('.swipe', 0.75, { x: '0%' }, { x: '100%', stagger: 0.25, onComplete: done });
                tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
            }
        }
    ]
})

//EventListeners
window.addEventListener('mousemove',cursor);
window.addEventListener('click',navToggle);
window.addEventListener('mouseover',activeCursor);