export default function preventUser(){
    document.addEventListener('contextmenu', function (e) {
        // Prevent the right-click menu
        e.preventDefault();
    });
    
    document.addEventListener('keydown', function (e) {
        // Prevent opening browser's developer tools
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'C')) {
            e.preventDefault();
        }
    });
}