export default class ToggleMainButton {
    is_popup_toggled = false;
    popupName;
    fadeField;

    constructor(popupName, fadeField) {
        this.popupName = popupName;
        this.fadeField = fadeField;
    }

    animate() {
        !this.is_popup_toggled ? this.togglePopup(this.popupName, '0px', true) : null;
    }

    togglePopup(popupName = this.popupName, position, isToggled) {
        $(popupName).show().animate({
            "right": position,
        }, 500);
        this.is_popup_toggled = isToggled;
        this.toggleFadeField();
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