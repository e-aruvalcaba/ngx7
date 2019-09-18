module.exports = function() {
    //show search in main navigation
    $('.main-nav__item .icon-magnifier-glass').on("click", function() {
        // not exact behaviour we are after - the transition should be smooth
        $(this).parent().find('.search-holder').show();
        $(this).closest('.main-nav').find('.icon-magnifier-glass').first().hide();
        $(this).closest('.main-nav').find('.nav-notifications-item').hide();
        $(this).closest('.main-nav').find('.main-nav__item-separator').first().hide();
    });

    //hide search in main navigation
    $('.dismiss-search').on("click", function() {
        $(this).parent().hide();
        $(this).closest('.main-nav').find('.icon-magnifier-glass').first().show();
        $(this).closest('.main-nav').find('.nav-notifications-item').show();
        $(this).closest('.main-nav').find('.main-nav__item-separator').first().show();
    });
}