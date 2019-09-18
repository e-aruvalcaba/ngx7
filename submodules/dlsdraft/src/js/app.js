import 'jquery';

window.Dropzone = require('./dropzone.js');

require('../scss/app.scss');
require('./lib/prism/prism.css');
require('./polyfills.js');
require('./html-imports.js')(ready);
// console.log('e');
// require('./google-maps.js')();

function ready() {
    $(document).ready(function() {
        //Prism
        window.Clipboard = undefined; //Temp fix for https://github.com/PrismJS/prism/issues/1181
        require('./lib/prism/clipboard.js');
        require('./lib/prism/prism.js');
        
        require('./nav-sidebar.js')();
        require('./number-stepper.js')();
        require('./search.js')();
        require('./syntax-highlight.js')();
        require('./popout.js')();
        require('./modal.js')();
        require('./accordion.js')();
        require('./tables-highlight.js')();
        require('./alerts.js')();
        require('./toggle.js')();

        // include it here in order to work with FF and Safari
        if( $('html').attr("dir") == "rtl" ) {
            require('./dropzone-demo-rtl.js')();
        } else {
            require('./dropzone-demo.js')();
        }
        
    });

    /*
    document.addEventListener("DOMContentLoaded", function() {
        // access Dropzone here
        require('./dropzone-demo.js')();
    });
    */
}
