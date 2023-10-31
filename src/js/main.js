
/******Toggle index popup **********/

let is_log_toggled = false;


$('.btn-login').click(function(){
    !is_log_toggled ? togglePopup('.login-popup', 0, true) : '';
    toggleFadeField('.login-popup');
})

$('.btn-signup').click(function(){
    !is_log_toggled ? togglePopup('.signup-popup', 0, true) : '';
    toggleFadeField('.signup-popup' );
})


function togglePopup( name, pos, is_toggled){
    $(name).show().animate({
        "right" : pos,
    }, 500);
    is_log_toggled = is_toggled;
}

function toggleFadeField(activePopup){
    if (is_log_toggled){
        $('.fade-field').show().click(function (){
            togglePopup(activePopup, '-524px', false);
            $(this).hide();
        });
    }
}

/******toggle setting&hitory popup**** */
$('.user-setting').click(()=>{
    $('.setting-popup').show(500).css('display', 'flex');
    $('.popup-bg').show(100);
})
$('.chat-history').click(()=>{
    $('.history-popup').show(500).css('display', 'flex');
    $('.popup-bg').show(100);
})

$('.close-popup').click(()=>{
    $('.setting-popup').hide(500);
    $('.history-popup').hide(500);
    $('.popup-bg').hide(100);
})

$('.new-chat').click( () =>{
    // window.location.href('')
    alert('New chat');
    }
)

$('.user-logout').click(()=>{
    window.location.href = '/index.html';
})

/******moving part *******/
function toggleMovingPart(){
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

function moveMovingPart(){//dragging the object depending to the cursor pos
    $('.user-abbreviation').mousedown(function(e) {
        e.preventDefault(); // Prevents default behavior (e.g., text selection)
    
        let element = $('.user-item-container');
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

moveMovingPart();
toggleMovingPart();

/***Input ****/

//rendering the suggestionPromt inside the input
$('.prompt-example').click(function (){
    const prompt = $(this).text().trim() || null;
    if (prompt){
        $('.user-input').val(prompt);
    }


})

$('.sendPrompt').each(function (indexInArray, sendPrompt) { 
    $(sendPrompt).click(function () { 
        const prompt = $('.user-input').val() || null;
        if (prompt){
            saveItem(prompt);
        }
     })
});



function saveItem(data){
    localStorage.setItem('MainPrompt', data)
}

function loadItem(dataName){
    return localStorage.getItem(dataName);
}

function setUserMessage(){
    let message = loadItem('MainPrompt') || 'undefined';
    if (message){   
        $('.reply-container').prepend(`
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

setUserMessage();


