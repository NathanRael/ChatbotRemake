export default class MovingPart {
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

    closeBy(closeIcon, popupName = '.setting-popup', speed = 500, popupBg = '.popup-bg') {
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