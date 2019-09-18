var Cookies = require('js-cookie');

module.exports = function() {
    $('.cmx-collapse-trigger').on('click', collapse);
    $('.cmx-expand-trigger').on('click', expand);

    $(document).ready(function() {
        Cookies.get('nav-configuration') === 'collapsed' && restoreCollapsed();
    });

    function restoreCollapsed() {
        collapse(undefined, false);
    }

    function expand(event) {
        Cookies.set('nav-configuration', 'expanded');

        if ($(this).hasClass('hidden-nav')) {

            // addressing RTL treatment
            $('html[dir="rtl"] #wrapper').find('#sidenav').addClass('sidebar-expanded').removeClass('sidebar-collapsed');

            $('html[dir="rtl"] #wrapper').find('.cmx-navbar-static-side').animate({ width: '160px' }, 300);
            $('html[dir="rtl"] #wrapper').find('.page-wrapper').animate({ marginRight: '160px', marginLeft: '0' }, 300);
            $('html[dir="rtl"] #wrapper').find('.cmx-expand-trigger').css("display", "none");
            $('html[dir="rtl"] #wrapper').find('.cmx-collapse-trigger').css("display", "block");
            $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar .cmx-as-label').css('display', 'inline-block');
            $('html[dir="rtl"] #wrapper').find('.cmx-legal-entity').css({ "position": "relative", "right": "-160px", "left":"0" }).animate({ right: "0px", height: "80px" }, 200);
            $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar .remember-active').next().css('display', 'inline-block');
            $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar .remember-active').removeClass('remember-active').addClass('active');

            // force the item with active to show its subnav
            $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar .active').next().css('display', 'inline-block').removeClass('hidden-subnav');
            $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar>ul>li').css('width', '160px');

            // side-subnav postion static on expand
            $('html[dir="rtl"] #wrapper').find('.cmx-side-subnav').css('position', 'static');

            $('.primary').each(function() {
                $(this).off('mouseenter');
            });

        }
    }

    function collapse(event, animate) {
        var element = $('.cmx-collapse-trigger');
        animate = animate === false? animate: true;
        Cookies.set('nav-configuration', 'collapsed');

        if (element.hasClass('opened-nav')) {
            // ADDRESS THE RTL (RIGHT TO LEFT ISSUES)
                $('html[dir="rtl"]').find('#sidenav').addClass('sidebar-collapsed').removeClass('sidebar-expanded');
                $('html[dir="rtl"]').find('.cmx-legal-entity').css({ "position": "relative", "right":"0", "left": "auto !important"}); // modified

                if(animate) {
                    $('html[dir="rtl"] #wrapper').find('.cmx-legal-entity').animate({ right: "-160px", left:"auto" }, 200); // modified
                    $('html[dir="rtl"] #wrapper').find('.cmx-legal-entity').animate({ height: '44px' }, 300);
                    $('html[dir="rtl"] #wrapper').find('.cmx-navbar-static-side').animate({ width: '44px' }, 300);
                    $('html[dir="rtl"] #wrapper').find('.page-wrapper').animate({ marginRight: '44px', marginLeft:'0' }, 300); //modified
                    
                } else {
                    $('html[dir="rtl"] #wrapper').find('.cmx-legal-entity').css({ right: "-160px", left: "auto" }, 200); //modified
                    $('html[dir="rtl"] #wrapper').find('.cmx-legal-entity').css({ height: '44px' }, 300);
                    $('html[dir="rtl"] #wrapper').find('.cmx-navbar-static-side').css({ width: '44px' }, 300);
                    $('html[dir="rtl"] #wrapper').find('.page-wrapper').css({ marginRight: '44px', marginLeft:'0' }, 300); //modified
                }

                // hide the collapse btn, display the expand btn
                element.css("display", "none");
                $('html[dir="rtl"] #wrapper').find('.cmx-expand-trigger').css("display", "block");

                // hide the expanded subnavs (if any)
                $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar .cmx-as-label').css('display', 'none');
                $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar .cmx-side-subnav').css('display', 'none');

                // though it stays active, it will collapse the subnav - to respond to the click
                $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar .active').next().css('display', 'none').addClass('hidden-subnav');

                // trick to kill the background when we have the collapsed state
                $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar ul').css('background', 'none');

                animate? $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar>ul>li').animate({ width: '44px' }, 300) :
                         $('html[dir="rtl"] #wrapper').find('.cmx-side-nav-bar>ul>li').css({ width: '44px' }) 

                // side-subnav postion absolute on collapsed
                $('html[dir="rtl"] #wrapper').find('.cmx-side-subnav').css({ 'position': 'absolute', 'z-index': '10', 'right': '0' }); // modified
            // END --- // ADDRESS THE RTL (RIGHT TO LEFT ISSUES)

            //
            $('.primary').each(function() {
                $(this).on('mouseenter', function() {
                    $(this).trigger('click');
                });
            });
        }
    }

};