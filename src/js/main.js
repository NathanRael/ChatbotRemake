import API_KEY from "./apikey.js";
import BOT_URL from './botUrl.js';

/******Toggle index popup **********/


class ToggleMainButton {
    is_popup_toggled = false;
    popupName;
    fadeField;

    constructor(popupName, fadeField) {
        this.popupName = popupName;
        this.fadeField = fadeField;
    }

    animate() {
        !this.is_popup_toggled ? this.togglePopup(this.popupName, 0, true) : null;
        this.toggleFadeField();
    }

    togglePopup(popupName = this.popupName, position, isToggled) {
        $(popupName).show().animate({
            "right": position,
        }, 500);
        this.is_popup_toggled = isToggled;
    }

    toggleFadeField() {
        if (this.is_popup_toggled) {
            $(this.fadeField).show()
                .click(() => {
                    this.togglePopup(this.popupName, '-524px', false);
                    $(this.fadeField).hide();
                });
        }
    }
}

// Create instances and call methods
let loginBtn = new ToggleMainButton('.login-popup', '.fade-field');
let signupBtn = new ToggleMainButton('.signup-popup', '.fade-field');

$('.btn-login').click(()=>{
    loginBtn.animate();
})

$('.btn-signup').click(()=>{
    signupBtn.animate();
})
;

$('.close-form').click(function (){
    let closeForm = new ToggleMainButton($(this).parent(0), 'fade-field' );
    closeForm.togglePopup($(this).parent(0), '-524px',true);
})

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

$('.btn-clear-history').click(()=>{//clearing all history
    if (confirm("Do you want to delete all your history ?")){
        localStorage.removeItem('mainMessage');
        localStorage.removeItem('weatherMessage');
        $('.probReplyContainer').empty() || alert("You should enter into the page");
        $('.weatherReplyContainer').empty() || alert("You should enter into the page");
        alert('History deleted');
        window.location.href = '/mainInterface.html';
    }

})

/***Input ****/

class Message{
    input;
    verifiedInput;
    probSolverData = this.loadData('mainMessage') || [];
    weatherData = this.loadData('weatherMessage') || [];

    constructor(input){
        this.input = input;
        (this.probSolverData.length > 0) && this.loadMainMessage();
        (this.weatherData.length > 0) && this.loadWeatherMessage();
    }
    
    sendMessage(messageName, isBot, isWeather){
        this.verifiedInput = this.securedInput();
        const USER_MESSAGE = this.verifiedInput;
        if ($(this.input).val() != ""){
            this.clearInput();
            if (!isWeather){
                this.saveData(messageName, USER_MESSAGE, `${isBot ? 'bot' : 'user'}-reply`, false);
                this.generateBotMessage(messageName,USER_MESSAGE);
     
                this.loadMainMessage();
                
            }else{
                this.saveData(messageName, USER_MESSAGE,`${isBot ? 'bot' : 'user'}-reply`, true);
                this.getWeather(USER_MESSAGE);
                this.loadWeatherMessage();
            }

        }else{
            alert('Please, type something before sending the message');
        }
    }

    securedInput(){
        return DOMPurify.sanitize($(this.input).val().trim().toLowerCase());
    }

    clearInput(){
        $(this.input).val('');
    }

    async generateBotMessage(messageName, userMessage){
        const apiUrl = BOT_URL;
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
            this.saveData(messageName, botMessage, 'bot-reply',false);
        }catch (error){
            console.log('Error:', error.message);
            console.error('Full error object:', error);
            alert('Error:' + (error.message.length > 50) ? error.message.slice(0, 50) : error.message );
        }finally{
            if (window.location.pathname.includes('maininterface') ||window.location.pathname.includes('mainInterface')){
                window.location.href = '/problemSolverInterface.html';
            }
            this.loadMainMessage();
        }

    }
    
    async getWeather(userInput){
        const units = 'metric';
        const lang = 'en';
        const apiKey = API_KEY;
        const cityName = userInput || 'Madagascar';
        // console.log('city : ' + cityName);
        try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`);
            if(!response.ok) {
                throw datas;
            }
            const datas = await response.json();
            
            const iconurl = "https://openweathermap.org/img/wn/" + datas.weather[0].icon + "@2x.png" || [];
            let data = [
                datas.name, iconurl, datas.weather[0].main, datas.main.temp, datas.main.humidity
            ] 
            this.saveData('weatherMessage',data,'bot-reply',true);
        }catch(err){
            alert('Err : ' + err.message);
            console.log('Err : ' + err.message);
        }finally{
            this.loadWeatherMessage();
        }

    }

    loadMainMessage(){
        const datas = this.probSolverData;
        // console.log(datas);
        let message;
        $('.probReplyContainer').empty();
            for ( let data of datas){
                message = data.message;
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
    }

    loadWeatherMessage(firstSent = false){
        const datas = this.weatherData || []; 
        let message;
        if (datas){
            $('.weatherReplyContainer').empty();
            if (firstSent){
                
            }
            for ( let data of datas){   
                if (data.class === 'user-reply'){
                    message = data.message;
                    $('.weatherReplyContainer').append(`
                        <li class="user-reply">
                            <p class="user-reply-abbreviation">R</p>
                            <div class="user-text">
                                ${message}
                            </div>
                        </li>
                    `)
                }else if (data.class === 'bot-reply'){
                    $('.weatherReplyContainer').append(`
                        <li class="bot-reply">
                            <img src="./src/image/logo.png" alt="" width="125px">
                            <div class="bot-text">
                                Well, here is the weather today :
                            </div>
                            <div class="weather-card">
                                <p class="country-name">${data.message[0]}</p>
                                <div class="climat">
                                    <img src="${data.message[1]}" alt="">
                                    <p>${data.message[2]}</p>

                                </div>
                                <p class="temperature">Temp ${data.message[3]}°C</p>
                                <p class="humidity">Hudidity ${data.message[4]}%</p>
                            </div>
                            <div class="bot-text">
                                If you want to find another country's weather, you can type it
                            </div>
                        </li>

                    `)
                }
            }
        }
    }

    saveData(dataName, data, className, isWeather){
        let jsonData;
        if (!isWeather){

            this.probSolverData.push(
                {class : className, message : data}
            )
            jsonData = JSON.stringify(this.probSolverData)
            localStorage.setItem(dataName, jsonData );
        }else{
            this.weatherData.push(
                {class : className, message : data}
            );
            jsonData = JSON.stringify(this.weatherData)
            localStorage.setItem(dataName, jsonData);
        }

    }

    loadData(dataName){
        return JSON.parse(localStorage.getItem(dataName));
    }
    getInputValue(){
        return $(this.input).val().trim();
    }


}

let mainPormpt = new Message('#mainPromptInput');
let probPormpt = new Message('#probPromptInput');
let apiPrompt = new Message('#ApiPromptInput');

$('.prompt-example').click(function () {
    const prompt = $(this).text().trim() || null;
    if (prompt) {
        $('.user-input').val(prompt);
    }
});

$('#sendMainPrompt').click(() => {
    mainPormpt.sendMessage('mainMessage');
});


$('#sendProbPrompt').click(() => {
    probPormpt.sendMessage('mainMessage');
});

$('#sendApiPrompt').click(function () {

    apiPrompt.sendMessage('weatherMessage', false, true);
});

