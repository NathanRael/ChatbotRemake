
/******Toggle popup **********/

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




