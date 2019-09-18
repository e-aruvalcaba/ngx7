module.exports = function() {
    // a little function that clones jQuerys parents()
    function findParent(element,className){
        if (element){
            if (element.classList && element.classList.contains(className)){
                return element;
            } else {
                return findParent(element.parentNode,className);
            }
        } else {
            return false;
        }
    }
    function toggleAccordion(event){
        // console.log('woot');
        let heading = event.target;
        let accordion = findParent(heading,'accordion');
        if (accordion && accordion.classList){
            if (accordion.classList.contains('open')){
                accordion.classList.remove('open');
                accordion.classList.add('closed');
            } else {
                accordion.classList.remove('closed');
                accordion.classList.add('open');
            }
        }
    }
    function accordions(){
        let accordionHeadings = document.querySelectorAll('.accordion__heading');
        for (let accordionHeading of accordionHeadings){
            accordionHeading.addEventListener('click',toggleAccordion);
        }
    }
    accordions();
}