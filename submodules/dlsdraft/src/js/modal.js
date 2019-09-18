module.exports = function() {
    function launchModal(selector){
        let theBody = document.querySelector('body');
        if (!theBody.classList.contains('cmx-modal-open')) {
            theBody.classList.add('cmx-modal-open');
        }

        let theModal = document.querySelector(selector);
        if (theModal.classList.contains('cmx-modal') && theModal.classList.contains('hidden')) {
            theModal.classList.remove('hidden');
        }
    };
    function closeModal(){
        let theBody = document.querySelector('body');
        if (theBody.classList.contains('cmx-modal-open')) {
            theBody.classList.remove('cmx-modal-open');
        }

        let theModal = document.querySelector('.cmx-modal:not(.hidden)');
        if (theModal) {
            theModal.classList.add('hidden');
        }
    }
    window.launchModal = launchModal;
    window.closeModal = closeModal;
};