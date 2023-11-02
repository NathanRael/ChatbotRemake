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

    handleClick(speed = 500, popupName = '.setting-popup', popupBg = '.popup-bg') {
        $(this.itemName).click(() => {
            $(popupName).show(speed).css('display', 'flex');
            $(popupBg).show(speed / 5);
        });
    }

    canBeClosed(closeIcon, speed = 500, popupName = '.setting-popup', popupBg = '.popup-bg') {
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
chatHistory.handleClick();
chatHistory.canBeClosed('.close-popup');
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

    constructor(input, button) {
        this.input = input;
        this.button = button;
    }

    sendMessage(from = 'other', data, dataName) {
        if (from === 'other') {
            if (data) {
                this.saveData(data, dataName);
                this.clearInputValue();
                this.renderUserMessage(dataName);
                this.generateBotMessage(data);//THE BOT REPLY

            } else {
                alert("Please type something before you send !");
            }

        } else if (from === 'main') {
            if (data) {
                this.saveData(data, dataName);
                window.location.href = '/problemSolverInterface.html';

            } else {
                alert("Please type something before you send !");
            }
        }
    }

    renderUserMessage(dataName) {

        let message = this.loadData(dataName) || 'undefined';
        if (message) {
            $('.reply-container').append(`
                <li class="user-reply">
                    <p class="user-reply-abbreviation">R</p>
                    <div class="user-text">
                        ${message}
                    </div>
                </li>
            `);
        }
    }

    renderBotMessage( message,time = 500,) {
        setTimeout(() => {
            $('.reply-container').append(`
            <li class="bot-reply">
                <img src="./src/image/logo.png" alt="" width="125px">
                <div class="bot-text">
                    <p class="text-down">
                        ${message}
                    </p>
                </div>
            </li>
        `);
        }, time);
    }

    async generateBotMessage(userMessage) {

        const apiUrl = 'https://api-fakell.x10.mx/v1/chat/completions/';
    
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: userMessage }
            ],
            stream: false
        };
    
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
    
        try {
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();

            let message = responseData.choices[0].message.content;

            this.renderBotMessage(message);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    

    
    click(func) {
        $(this.button).click(func);
    }

    clearInputValue() {
        $(this.input).val('');
    }

    saveData(data, dataName) {
        localStorage.setItem(dataName, data);
    }

    loadData(dataName) {
        return localStorage.getItem(dataName);
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

mainPrompt.renderUserMessage('mainMessage');
mainPrompt.generateBotMessage(userPrompt);



$('#sendProbPrompt').click(function () {
    userPrompt = $('#probPromptInput').val().trim();
    probPrompt.sendMessage('other', userPrompt, 'mainMessage');
});

$('#sendApiPrompt').click(function () {
    userPrompt = $('#ApiPromptInput').val().trim();
    apiPrompt.sendMessage('other', userPrompt, 'apiMessage');
});
