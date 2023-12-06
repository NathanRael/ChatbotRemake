import ToggleMainButton from "./ToggleMainButton.js";
import Message from "./Message.js";
import MovingPart from "./MovingPart.js";
import startAnimation from "./animation.js";

$(document).ready(() =>{
    startAnimation();
})

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



// Create instances and call methods
let userSetting = new MovingPart('.user-setting');
let chatHistory = new MovingPart('.chat-history');
let userAbbreviation = new MovingPart('.user-abbreviation');

userSetting.handleClick();
userSetting.closeBy('.close-popup');

chatHistory.handleClick('.history-popup');
chatHistory.closeBy('.close-popup', '.history-popup');

userAbbreviation.canBeDragged();
userAbbreviation.toggleItem();

$('.new-chat').click(() => {
    alert('New chat');
});

$('.user-logout').click(() => {
    window.location.href = '/index.html';
});

$('.btn-clear-history').click(()=>{ //clearing all history
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

let mainPormpt = new Message('#mainPromptInput');
let probPormpt = new Message('#probPromptInput');
let apiPrompt = new Message('#ApiPromptInput');
$('.user-input-container').submit((e) =>{
    e.preventDefault();
})

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

