
export default  function startAnimation () {
    const location = window.location.pathname.toLowerCase();

    if (location.includes('mainInterface'.toLowerCase())){
        const heroText = $('.hero-lead');
        let text = 'Hi there, how can I assist you today ?';
        let i = 0;
        let speed = 100;

        function typeText() {
            heroText.append(text[i]);
            i++;
            if (i < text.length) {
                if (i >= 8) {
                    speed = 30;
                }
                setTimeout(typeText, speed);
            }
            
        }
        
        const heroInterval = setTimeout(typeText, speed);
        
    } else if (location.includes('index'.toLowerCase()) || location === '/'){
        const title = [
            'I can help you to '
        ]
        const mainText = 'YOUR EVERYDAY ASSISTANT';
        const heroTitle = $('.hero-title');
        let speed = 200;
        let i = 0;
        // heroTitle.text(mainText);

        function animateHero(){
            heroTitle.append(mainText[i])
            i++;
            const randomSpeed = Math.floor(Math.random() * 120);
            setTimeout(animateHero, randomSpeed);
            if (heroTitle.text() >= mainText.length) clearTimeout(animateHero);
        }

        const heroTitleIntervale = setTimeout(animateHero, speed)
        setTimeout( () =>{
            $('.hero-lead').fadeIn('slow');
        }, speed + 1600)
        setTimeout( () =>{
            $('.hero-btn-contrainer').fadeIn('slow').css("display", 'flex');
        }, speed + 2000)
    }
}