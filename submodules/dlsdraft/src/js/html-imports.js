/******
Loads template content from imported HTML using HTML5 imports.
JQuery is used as fallback.
******/

module.exports = function(callback) {
    var supported = 'import' in document.createElement('link'), imports; //Feature availability check
    if (supported) {
        var template, clone;
        imports = document.querySelectorAll('link[rel="import"]'); //select all imports

        imports.forEach(function(each) {
            console.log('Native import: ' + each.href);
            template = each.import.querySelector('template');
            clone = document.importNode(template.content, true);
            insertAfter(clone, each);
        });

        callback();

    } else {
        imports = $('link[rel="import"]');
        imports.each(function(index) {
        var element, href, container;

            element = $(this);
            href = element.attr('href');
            container = $('<span></span>');
            container.load(href, onLoad);

            // console.log('JQuery fallback load: ' + href);

            function onLoad() {
                var replaceTag = $(container).find('template').first(); //Get rid of template tag
                $(replaceTag.html()).insertAfter(element);
                index === imports.length-1 && callback(); //Callback called after all imports done
            }
        });
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}