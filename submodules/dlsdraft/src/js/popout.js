module.exports = function() {

    // a little function that clones jQuerys parents()
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


    // the hiding function
    function hideFunction(evHide = {target:document.getElementsByTagName('body')[0]}){
        let evTarget = evHide.target;
        let withinContainer = isWithin(evHide.target,'popout');
        let forceHide = (evTarget.dataset.forceHide?true:false);
        
        if (!withinContainer || (withinContainer&&forceHide)) {
            // hide all popouts
            for (let popout of document.querySelectorAll('.popout')){
                popout.classList.add('hidden');
            }
            document.removeEventListener('click',hideFunction);
        }
    }

    // the showing function
    function showFunction(event, userMenu){

        // hide open popovers
        hideFunction();
        
        if (userMenu.classList) {
            userMenu.classList.remove('hidden');
        }
        document.addEventListener('click',hideFunction);
        event.stopPropagation();
    }

    // the togglin' function
    function toggleFunction(event, target){
        let userMenu = document.querySelector(target);
        if (userMenu.classList.contains('hidden')){
            showFunction(event, userMenu);
        } else {
            hideFunction(event);
        }
    }

    // add the popover functionality
    function addPop(elmt){
        
        // get the target from the data-popout-target attribute
        let target = elmt.dataset.popoutTarget;

        // add the click event listener
        elmt.addEventListener('click',(event)=>{
            // and toggle!
            toggleFunction(event,target);
        });
    }

    function popouts(){
        // find all the togglin buttons on the page
        let popoutButtons = document.getElementsByClassName('popout__toggle');
    
        // add popout capabilities to them all
        for (popoutButton of popoutButtons){
            addPop(popoutButton);
        }
    }

    // initialize popouts
    popouts();
}