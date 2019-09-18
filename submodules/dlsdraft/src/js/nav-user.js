module.exports = function() {

    let userMenuIcon = document.getElementsByClassName('user-menu__icon')[0];
    userMenuIcon.addEventListener('click',(event)=>{
        function isWithin(element,className){
            if (element){
                if (element.classList && element.classList.contains(className)){
                    return true;
                } else {
                    return isWithin(element.parentNode,className);
                }
            } else {
                return false;
            }
        }
        function hideFunction(evHide, userMenu = document.getElementsByClassName('user-menu__container')[0]){
            let evTarget = evHide.target;
            let withinContainer = isWithin(evHide.target,'user-menu__container');
            if (!withinContainer) {
                userMenu.setAttribute('class','user-menu__container hidden');
                document.removeEventListener('click',hideFunction);
            }
        }
        function showFunction(event, userMenu = document.getElementsByClassName('user-menu__container')[0]){
            userMenu.setAttribute('class','user-menu__container');
            document.addEventListener('click',hideFunction);
            event.stopPropagation();
        }
        function toggleFunction(event){
            let userMenu = document.getElementsByClassName('user-menu__container')[0];
            if (userMenu.classList.contains('hidden')){
                showFunction(event, userMenu);
            } else {
                hideFunction(event, userMenu);
            }
        }
        toggleFunction(event);
    });
}