



/******Toggle index popup **********/

class ToggleMainButton {
    is_popup_toggled = false;
    buttonName;
    popupName;
    fadeField;

    constructor(buttonName, popupName, fadeField) {
        this.buttonName = buttonName;
        this.popupName = popupName;
        this.fadeField = fadeField;
    }

    animate() {
        $(this.buttonName).click(() => {
            !this.is_popup_toggled ? this.#togglePopup(this.popupName, 0, true) : null;
            this.#toggleFadeField();
        });
    }

    #togglePopup(popupName, position, isToggled) {
        $(popupName).show().animate({
            "right": position,
        }, 500);
        this.is_popup_toggled = isToggled;
    }

    #toggleFadeField() {
        if (this.is_popup_toggled) {
            $(this.fadeField).show()
                .click(() => {
                    this.#togglePopup(this.popupName, '-524px', false);
                    $(this.fadeField).hide();
                });
        }
    }
}

// Create instances and call methods
let loginBtn = new ToggleMainButton('.btn-login', '.login-popup', '.fade-field');
let signupBtn = new ToggleMainButton('.btn-signup', '.signup-popup', '.fade-field');

loginBtn.animate();
signupBtn.animate();


/******toggle setting&hitory popup**** */

class MovingPart {
    itemName;

    constructor(itemName) {
        this.itemName = itemName;
    }

    handleClick( popupName = '.setting-popup',speed = 500, popupBg = '.popup-bg') {
        $(this.itemName).click(() => {
            $(popupName).show(speed).css('display', 'flex');
            $(popupBg).show(speed / 5);
        });
    }

    canBeClosed(closeIcon, popupName = '.setting-popup', speed = 500, popupBg = '.popup-bg') {
        $(closeIcon).click(() => {
            $(popupName).hide(speed);
            $(popupBg).hide(speed / 5);
        });
    }

    toggleItem() {
        let is_clicked = true;
        $('.user-abbreviation').click(() => {
            if (is_clicked) {
                is_clicked = false;
                $('.user-setting, .user-logout, .new-chat, .chat-history')
                    .slideToggle(500, () => is_clicked = true)
                    .css('display', 'flex');
            }
        });
    }

    canBeDragged(anchor = this.itemName, container = '.user-item-container') {
        $(anchor).mousedown(function (e) {
            e.preventDefault();
            let element = $(container);
            let isDragging = true;

            $(document).mousemove(function (e) {
                if (isDragging) {
                    element.css({
                        'top': e.pageY - $(window).scrollTop() - 120,
                        'left': e.pageX - 120,
                    });
                    if (e.pageY <= 64) {
                        element.css({
                            'top': $(window).scrollTop() - 0,
                            'left': e.pageX - 120,
                        });
                    }
                    if (e.pageX <= 0) {
                        element.css({
                            'top': e.pageY - $(window).scrollTop() - 120,
                            'left': -128,
                        });
                    }
                }
            }).mouseup(function () {
                isDragging = false;
                $(document).off('mousemove').off('mouseup');
            });

        });
    }
}

// Create instances and call methods
let userSetting = new MovingPart('.user-setting');
let chatHistory = new MovingPart('.chat-history');
let userAbbreviation = new MovingPart('.user-abbreviation');

userSetting.handleClick();
userSetting.canBeClosed('.close-popup');
chatHistory.handleClick('.history-popup');
chatHistory.canBeClosed('.close-popup', '.history-popup');
userAbbreviation.canBeDragged();
userAbbreviation.toggleItem();

$('.new-chat').click(() => {
    alert('New chat');
});

$('.user-logout').click(() => {
    window.location.href = '/index.html';
});

$('.btn-clear-history').click(()=>{
    localStorage.removeItem('mainMessage');
    $('.probReplyContainer').empty();
    alert('History deleted');
})

/***Input ****/
class Message {
    input;
    button;
    mainMessage = this.loadData('mainMessage') || [];
    apiMessage = [];

    constructor(input, button) {
        this.input = input;
        this.button = button;
        (this.mainMessage.length > 0) && this.loadMainMessage();

    }

    sendMessage(from = 'other', data, dataName) {
        if (from === 'other') {
            if (data) {
                this.saveData(data, dataName, 'user-reply');
                (dataName === 'mainMessage') ? this.clearInputValue() : null;
            } else {
                // this.saveData(' ', dataName, 'user-reply');
                alert("Please type something before you send !");
            }

        } else if (from === 'main') {
            if (data) {
                this.saveData(data, dataName, 'user-reply');
                window.location.href = '/problemSolverInterface.html';

            } else {
                alert("Please type something before you send !");
            }
        }
    }

    renderUserMessage(message, from = 'mainMessage') {
        if (from === 'mainMessage'){

            if (message) {
                $('.probReplyContainer').append(`
                    <li class="user-reply">
                        <p class="user-reply-abbreviation">R</p>
                        <div class="user-text">
                            ${DOMPurify.sanitize(message)}
                        </div>
                    </li>
                `);
                
                $('.probReplyContainer').scrollTop($('.probReplyContainer')[0].scrollHeight);

            }
        }else if (from = 'weatherMessage'){
            if (message) {
                $('.weatherReplyContainer').append(`
                    <li class="user-reply">
                        <p class="user-reply-abbreviation">R</p>
                        <div class="user-text">
                            ${DOMPurify.sanitize(message)}
                        </div>
                    </li>
                `);
                // $('.weatherReplyContainer').scrollTop($('.weatherReplyContainer')[0].scrollHeight);
            }
        }

    }

    renderBotMessage( message, from = 'mainMessage', time = 500) {
        
        setTimeout(() => {
            if (from === 'mainMessage'){
                message = DOMPurify.sanitize(message);
                let splitedMess = message.split("```");

                $('.probReplyContainer').append(`
                <li class="bot-reply">
                    <img src="./src/image/logo.png" alt="" width="125px">
                    <div class="bot-text">
${splitedMess.map(mess => `
<code class="">
${mess}
</code>
`).join(' ')}  
                    </div>
                </li>
            `);
            
                // $('.probReplyContainer').append(`
                // <li class="bot-reply">
                //     <img src="./src/image/logo.png" alt="" width="125px">
                //     <div class="bot-text">
                //         ${message}
                //     </div>
                // </li>
                // `)
                // $('.probReplyContainer').scrollTop($('.probReplyContainer')[0].scrollHeight);
                this.loadMainMessage();
            }else if (from === 'weatherMessage'){
                let iconurl = "https://openweathermap.org/img/wn/" + message.weather[0].icon + "@2x.png";
                $('.weatherReplyContainer').append(`
                <li class="bot-reply">
                    <img src="./src/image/logo.png" alt="" width="125px">
                    <div class="bot-text">
                        Well, here is the weather today :
                    </div>
                    <div class="weather-card">
                        <p class="country-name">${message.name}</p>
                        <div class="climat">
                            <img src="${iconurl}" alt="">
                            <p>${message.weather[0].main}</p>
                            
                        </div>
                        <p class="temperature">Temp ${message.main.temp}°C</p>
                        <p class="humidity">Hudidity ${message.main.humidity}%</p>
                    </div>
                    <div class="bot-text">
                        Which coutry's weather do you want to find ?
                    </div>
                </li>
                
                `)
                // $('.weatherReplyContainer').scrollTop($('.weatherReplyContainer')[0].scrollHeight);
            }


        }, time);
    }

    loadMainMessage(){
        this.mainMessage = this.loadData('mainMessage') || null;
        const datas = this.mainMessage;
        let message;
        if (datas){
            $('.probReplyContainer').empty();
            for ( let data of datas){   
                message = DOMPurify.sanitize(data.message);
                if (data.class === 'user-reply'){
                    $('.probReplyContainer').append(`
                        <li class="user-reply">
                            <p class="user-reply-abbreviation">R</p>
                            <div class="user-text">
                                ${message}
                            </div>
                        </li>
                    `)
                }else if (data.class === 'bot-reply'){
                    let splitedMess = message.split(/```/);
    
                    $('.probReplyContainer').append(`
                        <li class="bot-reply">
                            <img src="./src/image/logo.png" alt="" width="125px">
                            <div class="bot-text">
${splitedMess.map(mess => `
<code class="">
    ${mess}
</code>
`).join(' ')}  
                            </div>
                        </li>
                    `);
                }
            }
            // $('.probReplyContainer').scrollTop($('.probReplyContainer')[0].scrollHeight);
        }

    }

    async generateBotMessage(userMessage, from) {
        const apiUrl = 'https://api-fakell.x10.mx/v1/chat/completions/';
        let botMessage;
        const data = {
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": userMessage}],
            stream: false
        }

        const requestOptions = {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data) 
        }

        try{

            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            botMessage = responseData.choices[0].message.content;
            console.log(botMessage);
            if (from === 'mainMessage'){
                this.saveData(botMessage, "mainMessage", "bot-reply")
            }else if (from === 'weatherMessage'){
                this.saveData(botMessage, "weatherMessage", "bot-reply")
            }
            this.renderBotMessage(botMessage, from);
        }catch (error){
            console.log('Error:', error.message);
            alert('Something went wrong, try again !')
        }
        
    }

    async getWeather(){
        const units = 'metric';
        const lang = 'en';
        const cityName = this.getInnputValue() || 'Madagascar';
        console.log('city : ' + cityName);
        try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b275b33dffe936abc144bfe7c2ba6678&units=${units}&lang=${lang}`);
            const datas = await response.json();
            console.log(datas);
            this.renderBotMessage(datas, 'weatherMessage');
        }catch(err){
            alert('Err : ' + err.message);
            console.log('Err : ' + err.message);
        }

    }

    getInnputValue(){
        return $(this.input).val().trim();
    }

    getMainMessage(){
        return this.mainMessage;
    }

    getApiMessage(){
        return this.apiMessage;
    }

    clearInputValue() {
        $(this.input).val('');
    }

    saveData(data, dataName, className) {
        if (dataName === 'mainMessage'){
            this.mainMessage.push(
                {class : className, message : data}
            );
            localStorage.setItem(dataName, JSON.stringify(this.mainMessage));

        }else if (dataName === 'weatherMessage'){
            this.apiMessage.push(data);
            localStorage.setItem(dataName, JSON.stringify(this.apiMessage));
        }
    }

    loadData(dataName) {
        return JSON.parse(localStorage.getItem(dataName));
    }
}

// Render suggestionPrompt inside the input
$('.prompt-example').click(function () {
    const prompt = $(this).text().trim() || null;
    if (prompt) {
        $('.user-input').val(prompt);
    }
});



// Create instances and set up message sending
let mainPrompt = new Message('#mainPromptInput', '#sendMainPrompt');
let probPrompt = new Message('#probPromptInput', '#sendProbPrompt');
let apiPrompt = new Message('#ApiPromptInput', '#sendApiPrompt');
let userPrompt;
let datas;
let first_sent = localStorage.getItem('firstSent') || 'false' ;
localStorage.setItem('firstSent', first_sent);

$('#sendMainPrompt').click(function () {
    userPrompt = $('#mainPromptInput').val().trim();
    mainPrompt.sendMessage('main', userPrompt, 'mainMessage');
    first_sent = 'true';
    localStorage.setItem('firstSent', first_sent);

});
if (first_sent === 'true'){
    datas = mainPrompt.loadData('mainMessage')[0].message || null;
    console.log(datas)
    if (datas){

        mainPrompt.renderUserMessage(datas, 'mainMessage' );
        mainPrompt.generateBotMessage(userPrompt, 'mainMessage');
        first_sent = 'false';
        localStorage.setItem('firstSent', first_sent);
    }
}



$('#sendProbPrompt').click(function (e) {
    userPrompt = $('#probPromptInput').val().trim();
    probPrompt.sendMessage('other', userPrompt, 'mainMessage');
    probPrompt.renderUserMessage(userPrompt);
    probPrompt.generateBotMessage(userPrompt, 'mainMessage');

});

$('#sendApiPrompt').click(function () {
    userPrompt = $('#ApiPromptInput').val().trim();
    apiPrompt.sendMessage('other', userPrompt, 'weatherMessage');
    apiPrompt.renderUserMessage(userPrompt, 'weatherMessage' );
    apiPrompt.getWeather();
    apiPrompt.clearInputValue();
});

function execute_once(){
    if (!localStorage.getItem('rendered')) {
        apiPrompt.renderBotMessage('Welcome to the weather API. What is your country Name', 'weatherMessage');
        localStorage.setItem('rendered', true);
    }
}
