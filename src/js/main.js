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

/***Input ****/
class Message {
    input;
    button;
    mainMessage = [
        {class : 'bot-reply', message : 'How can I assist you today ?'},
        {class : 'user-reply', message : 'day'},
        {class : 'bot-reply', message : 'No xay dude'},
        {class : 'bot-reply', message : 'squr'},
        {class : 'user-reply', message : 'nope mec'},
        {class : 'bot-reply', message : 'Hi'},
    ];
    apiMessage = [];

    constructor(input, button) {
        this.input = input;
        this.button = button;
    }

    sendMessage(from = 'other', data, dataName) {
        if (from === 'other') {
            if (data) {
                this.saveData(data, dataName, 'user-reply');
                this.clearInputValue();
            } else {
                this.saveData(' ', dataName, 'user-reply');
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
                            ${message}
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
                            ${message}
                        </div>
                    </li>
                `);
                $('.probReplyContainer').scrollTop($('.probReplyContainer')[0].scrollHeight);
            }
        }

    }

    renderBotMessage( message, from = 'mainMessage', time = 500,) {
        setTimeout(() => {
            if (from === 'mainMessage'){
                $('.probReplyContainer').append(`
                <li class="bot-reply">
                    <img src="./src/image/logo.png" alt="" width="125px">
                    <div class="bot-text">
                        <p class="text-down">
                            ${message}
                        </p>
                    </div>
                </li>
                `)
                $('.probReplyContainer').scrollTop($('.probReplyContainer')[0].scrollHeight);
            }else if (from === 'weatherMessage'){
                $('.weatherReplyContainer').append(`
                <li class="bot-reply">
                    <img src="./src/image/logo.png" alt="" width="125px">
                    <div class="bot-text">
                        <p class="text-down">
                            ${message}
                        </p>
                    </div>
                </li>
                
                `)
                $('.probReplyContainer').scrollTop($('.probReplyContainer')[0].scrollHeight);
            }
            this.loadMainMessage();

        }, time);
    }

    loadMainMessage(){
        this.mainMessage = this.loadData('mainMessage') || null;
        const datas = this.mainMessage
        if (datas){
            $('.probReplyContainer').empty();
            for ( let data of datas){   
                if (data.class === 'user-reply'){
                    $('.probReplyContainer').append(`
                        <li class="user-reply">
                            <p class="user-reply-abbreviation">R</p>
                            <div class="user-text">
                                ${data.message}
                            </div>
                        </li>
                    `)
                }else if (data.class === 'bot-reply'){
                    $('.probReplyContainer').append(`
                    <li class="bot-reply">
                        <img src="./src/image/logo.png" alt="" width="125px">
                        <div class="bot-text">
                            <p class="text-down">
                                ${data.message}
                            </p>
                        </div>
                    </li>
                    `)
                }
            }
        }

    }

    getMainMessage(){
        return this.mainMessage;
    }

    getApiMessage(){
        return this.apiMessage;
    }

    async generateBotMessage(userMessage, from) {

        // const apiUrl = 'https://api-fakell.x10.mx/v1/chat/completions/';
    
        // const data = {
        //     model: 'gpt-3.5-turbo',
        //     messages: [
        //         { role: 'user', content: userMessage }
        //     ],
        //     stream: false
        // };
    
        // const requestOptions = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // };
    
        // try {
        //     const response = await fetch(apiUrl, requestOptions);
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     const responseData = await response.json();
        //     let message = responseData.choices[0].message.content;

        //     // this.renderBotMessage(message);
        // } catch (error) {
        //     console.error('Error:', error.message);
        //     alert('Error : ' + error.message);
        // }
        if (from === 'mainMessage'){
            this.saveData("message", "mainMessage", "bot-reply")
        }else if (from === 'weatherMessage'){
            this.saveData("message", "weatherMessage", "bot-reply")
        }
        this.renderBotMessage("message", from);
    }
    
    

    
    click(func) {
        $(this.button).click(func);
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

$('#sendMainPrompt').click(function () {
    userPrompt = $('#mainPromptInput').val().trim();
    mainPrompt.sendMessage('main', userPrompt, 'mainMessage');

});
mainPrompt.generateBotMessage('hello', 'mainMessage');


$('#sendProbPrompt').click(function (e) {
    userPrompt = $('#probPromptInput').val().trim();
    probPrompt.sendMessage('other', userPrompt, 'mainMessage');
    probPrompt.renderUserMessage(userPrompt);
    probPrompt.generateBotMessage(userPrompt, 'mainMessage');

});

$('#sendApiPrompt').click(function () {
    userPrompt = $('#ApiPromptInput').val().trim();
    apiPrompt.sendMessage('other', userPrompt, 'weatherMessage');
});
