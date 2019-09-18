module.exports = function(){
    // Syntax highlight code (Prism)
    $('[data-highlight]').each(function(index, element) {
        var container = $('<div></div>').prependTo(element);
        
        $(element).find('pre').each(function (i,e) {
            i === 0? $(e).show() : $(e).hide();

            var lang = $(e).attr('data-lang');
            var link = $('<a href="">' + lang + '</a>').appendTo(container);
            
            container.css('text-align', 'right');
            container.css('margin-top', '10px');
            link.css('padding','0');
            link.css('font-size','.9em');
            link.css('padding-right','.66em');
            link.css('text-transform','uppercase');
            link.css('font-weight','bold');
            link.click(function(event) {
                event.preventDefault(); 
                $(element).find('[data-lang]').hide();
                $(element).find('[data-lang="'+ lang +'"]').show();
            });
        });
    });


    // Code box -- TODO move to separate module 
    $('.code-box').each(function(index, element) {
        var contents = $(element).find('[data-highlight]').first(),
        expanded = $(element).data('expanded')? true : false,
        expandedText = $(element).data('expanded-text') || 'Hide code',
        collapsedText = $(element).data('collapsed-text') || 'Show code',
        button = $('<a class="cmx-button cmx-button--block ripple" href=""></a>').prependTo(element);

        button.html(innerHTML(expanded, expandedText, collapsedText));
        
        $(element).data('expanded', expanded);
        expanded? show(contents) : hide(contents);

        button.on('click', function(event) {
            event.preventDefault();
            expanded = !expanded;
            expanded? show(contents, true) : hide(contents, true);
            $(element).data('expanded', expanded);
            button.html(innerHTML(expanded, expandedText, collapsedText));
        });

        function innerHTML(expanded, expandedText, collapsedText) {
            var icon = expanded? 'icon-minus' : 'icon-plus',
                text = expanded? expandedText : collapsedText;
            return '<span class="cmx-button__icon"><svg class="icon-plus-basic"><use xlink:href="#' + icon + '"></use></svg></span>' + text;
        }

        function show(element, animate) {
            animate? element.fadeIn(200) : element.show();
        }
        
        function hide(element, animate) {
            animate? element.fadeOut(200) : element.hide()
        }
    });
}