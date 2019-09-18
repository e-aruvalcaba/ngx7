var Cookies = require('js-cookie');

module.exports = function() {
    function restoreCollapsed(callback) {
        // this could be replaced by server-side or actually included in the rendering of the angular/react component
        document.querySelector('.cmx-navbar').classList.add('collapsed');
    }

    function selectNav(location) {
        // on load find the nav we must see
        location = location.match(/\/?[^\/]+$/);
        location = location? location[0] : '';
        location = location.replace(/^\//, '');

        let navLocation = document.querySelector('.cmx-navbar a[href="' + location +'"]');
        
        if(navLocation){
            if (navLocation.classList.contains('primary')){
                if (!navLocation.classList.contains('active')){
                    window.toggleSub(navLocation);
                }
            } else {
                let parent = findParentByClass(navLocation,'cmx-navbar__menu-item')
                let primary = parent.querySelector('.cmx-navbar__menu-link');

                window.toggleSub(primary,true);
            }
        }
    }

    function toggleClass(selector,className){
        let el = selector;
        if (typeof(selector)==='string'){
            el = document.querySelector(selector);
        }
        if (el){
            let classList = el.classList;
            if (!classList.contains(className)) {
                classList.add(className);
                return true;
            } else {
                classList.remove(className);
                return false;
            }
        }
    }

    function findParentByClass(element,className){
        let directParent = element.parentNode;
        if (directParent.classList.contains(className)){
            return directParent;
        } else {
            return findParentByClass(directParent,className);
        }
    }

    window.toggleSub = (element) => {
        // we look out for parent so that we can check for an active sibling
        let parent = findParentByClass(element,'cmx-navbar__menu');
        // we catch the current active sibling
        let currentActive = parent.querySelector('.active');

        // since the menus work differently id the nav is collapsed or not, we have to find out if it is

        let wholeMenu = findParentByClass(element,'cmx-navbar');

        let isCollapsed = wholeMenu.classList.contains('collapsed');

        // we are togllin one after the other (not simultaneously), that's why we'll use transition end event listener, which works hand in hand with CSS transitions
        
        // we define the latter function so we can remove it with the remove event listener (you cannot do this with an anonymus fnction)
        let tcf = function(){
            // we activate the next menu
            toggleClass(element,'active');
            // we remove this function frm being listened once again
            currentActive.removeEventListener('transitionend',tcf);
        };
        // if there's an active sibling
        if (currentActive) {
            // add the event listener that is going to open up the next submenu (if it's not the same one that's already open)
            if (currentActive!==element){
                currentActive.addEventListener('transitionend',tcf);
            }
            // we close the current submenu
            currentActive.classList.remove('active');
        } else {
            toggleClass(element,'active');
        }
    };

    window.toggleSidebar = function(e){
        let nav = findParentByClass(e.target,'cmx-navbar');
        let cookieClass = nav.classList.contains('collapsed')?'expanded':'collapsed';
        Cookies.set('nav-configuration', cookieClass);
        let collapsed = toggleClass(nav,'collapsed');
    }

    window.toggleEntitySelector = function(e){
        toggleClass('.cmx-navbar','entity-selector-open');
    }
    window.chooseLegalEntity = function(elm){
        console.log(elm);
        // remove active class from siblings
        let activeSibling = elm.parentNode.parentNode.querySelector('.active');

        if (activeSibling) {
            activeSibling.classList.remove('active');
        }

        elm.parentNode.classList.add('active');
        document.querySelector('#legalEntityName').innerHTML = elm.dataset.entityName;
        document.querySelector('#legalEntityId').innerHTML = elm.dataset.entityId;

        // are we in mobile? if so, .mobile-only elements should show

        let isMobile = (document.querySelector('.mobile-only').offsetParent!==null);

        if (!isMobile) {
            toggleEntitySelector();
        }
    };
    window.toggleClass = toggleClass;

    window.hideOnClickOutside = function(e,selector){
        // a little function that clones jQuerys parents()
        let zeElement = document.querySelector(selector);
        function isWithin(element,selector){
            if (element){
                if (element===zeElement){
                    return true;
                } else {
                    return isWithin(element.parentNode,selector);
                }
            } else {
                return false;
            }
        }
        function hideFunction(e){
            let withinContainer = isWithin(e.target,selector);

            if (!withinContainer){
                zeElement.classList.add('hidden');
                document.removeEventListener('click',hideFunction);
            }
        }
        document.addEventListener('click',hideFunction);
    };

    window.showMobileLanguage = function(e){
        toggleClass('#mobileLanguageSelection','hidden');
        toggleSidebar(e);
        window.setTimeout(function(){
            console.log('woot')
            hideOnClickOutside(e,'#mobileLanguageSelection');
        },100);
    };


    //load function
    function loadFunc (){
        let mobileDimensions = window.innerWidth;
        let collapsed = (Cookies.get('nav-configuration') === 'collapsed');
        if ((mobileDimensions > 576) && collapsed){
            restoreCollapsed();
        }
        selectNav(window.location.pathname);
    };

    if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
        loadFunc();
    } else {
        document.addEventListener("DOMContentLoaded", loadFunc);
    }
};
