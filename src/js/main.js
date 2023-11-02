
/******Toggle index popup **********/

class ToggleMainButton {
    is_popup_toggled = false;
    buttonName;
    popupName;
    fadeField;

    constructor (buttonName, popupName, fadeField){
        this.buttonName = buttonName;
        this.popupName = popupName;
        this.fadeField = fadeField;
    }

    Animate  () {
        $(this.buttonName).click(  ()=> {
            !this.is_popup_toggled ? this.#togglePopup(this.popupName, 0, true) : null;
            this.#toggleFadeField();
        })
    }

    #togglePopup(popupName, postion, is_toggled){
        $(popupName).show().animate({
            "right" : postion,
        }, 500);
        this.is_popup_toggled = is_toggled;
    }

    #toggleFadeField(){
        if (this.is_popup_toggled){

            $(this.fadeField).show()
            .click( () => {
                this.#togglePopup(this.popupName, '-524px', false);
                $(this.fadeField).hide();
            });
        }
    }

}

let loginBtn = new ToggleMainButton('.btn-login', '.login-popup', '.fade-field' );
let signupBtn = new ToggleMainButton('.btn-signup', '.signup-popup', '.fade-field' );

loginBtn.Animate();
signupBtn.Animate();


/******toggle setting&hitory popup**** */

class MovingPart {
    itemName;

    constructor (itemName){
        this.itemName = itemName;

    }

    handleClick(speed = 500, popupName = '.setting-popup', popupBg = '.popup-bg'){
        $(this.itemName).click(() =>{
            $(popupName).show(speed).css('display', 'flex');
            $(popupBg).show(speed/5);
        })
    }

    canBeClosed(closeIcon, speed = 500, popupName = '.setting-popup', popupBg = '.popup-bg'){
        $(closeIcon).click(() =>{
            $(popupName).hide(speed);
            $(popupBg).hide(speed/5);
        })

    }

    toggleItem(){
        let is_clicked = true;
        $('.user-abbreviation').click(()=>{
            if(is_clicked){
                is_clicked = false;
                $('.user-setting, .user-logout, .new-chat, .chat-history')
                .slideToggle(500, () => is_clicked = true)//using callback function
                .css('display', 'flex');
            }
        })
    }

    canBeDragged(anchor = this.itemName, container = '.user-item-container'){//dragging the object depending to the cursor pos
        $(anchor).mousedown(function(e) {
            e.preventDefault(); // Prevents default behavior (e.g., text selection)
        
            let element = $(container);
            let isDragging = true;
    
            $(document).mousemove(function (e){
                if (isDragging){
                    element.css({
                        'top': e.pageY - $(window).scrollTop() - 120,
                        'left': e.pageX - 120,
                    });
                    /****Reseting the movingPart pos if it's far from the windows */
                    if (e.pageY <= 64){
                        element.css({
                            'top':  $(window).scrollTop() - 0,
                            'left': e.pageX - 120,
                        });
                    }
                    if(e.pageX <= 0){
                        element.css({
                            'top': e.pageY - $(window).scrollTop() - 120,
                            'left': -128,
                        }); 
                    }
                }
            }).mouseup(function() {
                isDragging = false;
                $(document).off('mousemove').off('mouseup');
            });
    
        })
    
    } 

}

let userSetting = new MovingPart('.user-setting');
let chatHistory = new MovingPart('.chat-history');
let userAbbreviation = new MovingPart('.user-abbreviation')

userSetting.handleClick();
userSetting.canBeClosed('.close-popup');
chatHistory.handleClick();
chatHistory.canBeClosed('.close-popup');
userAbbreviation.canBeDragged();
userAbbreviation.toggleItem();

$('.new-chat').click( () =>{
    // window.location.href('')
    alert('New chat');
    }
)

$('.user-logout').click(()=>{
    window.location.href = '/index.html';
})


/***Input ****/
class Message{
    input;
    button;
    message;

    constructor (input, button){
        this.input = input;
    }

    sendMessage (from = 'other', data, dataName){
        if (from === 'other'){
            if (data){
                this.saveData(data, dataName);
                this.clearInputValue();
                this.setUserMessage(dataName);
                this.setBotMessage();
                
            }else{
                alert("Please type something before you send !");
            }
            
        }else if (from = 'main'){
            if (data){
                this.saveData(data, dataName);
                window.location.href = '/problemSolverInterface.html';

            }else{
                alert("Please type something before you send !");
            }
        }
    }

    setUserMessage(dataName){
        let message = this.loadData(dataName) || 'undefined';
        if (message){
            $('.reply-container').append(`
                <li class="user-reply">
                    <p class="user-reply-abbreviation">R</p>
                    <div class="user-text">
                        ${message}
                    </div>
                </li>
            `
            )
        }
    }

    setBotMessage(time = 500){
        let message = 'yah';
        setTimeout(()=>{
            $('.reply-container').append(`
            <li class="bot-reply">
                <img src="./src/image/logo.png" alt="" width="125px">
                <div class="bot-text">
                    <p class="text-down">
                        ${message}
                    </p>
                </div>
            </li>
        `)
        }, time)

    }

    Click(func){
        $(this.button).click(func);
    }

    clearInputValue(){
        $(this.input).val('');
    }

    saveData (data, dataName){
        localStorage.setItem(dataName, data)
    }

    loadData (dataName){
        return localStorage.getItem(dataName);
    }

}


//rendering the suggestionPromt inside the input

$('.prompt-example').click(function (){
    const prompt = $(this).text().trim() || null;
    if (prompt){
        $('.user-input').val(prompt);
    }

})

let mainPrompt = new Message('#mainPromptInput', '#sendMainPrompt');
let problePrompt = new Message('#probPromptInput', '#sendProbPrompt');
let weatherApi = new Message('#ApiPromptInput', '#sendApiPrompt');



$('#sendMainPrompt').click(function () {//the button in the main UI
    const prompt = $('#mainPromptInput').val().trim();
    mainPrompt.sendMessage('main',prompt, 'mainMessage');
    // messageSent = true;
    
})

mainPrompt.setBotMessage();

mainPrompt.setUserMessage('mainMessage');

$('#sendProbPrompt').click(function (){//the btn in the problemSolver UI
    const prompt = $('#probPromptInput').val().trim();
    problePrompt.sendMessage('other', prompt, 'mainMessage');

})



$('#sendApiPrompt').click(function (){//the btn in the problemSolver UI
    const prompt = $('#ApiPromptInput').val().trim();
    weatherApi.sendMessage('other', prompt, 'apiMessage');
})



