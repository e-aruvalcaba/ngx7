module.exports = function() {
    // functions to manage the check-uncheck on tables rows

    $('.cmx-table-row [type="checkbox"]').on("click", function() {
        if(!($(this).parents('.cmx-table-row').hasClass('cmx-header'))) {

            // test to see if it was checked OR unchecked

            if($(this).is(':checked')) {
                // console.log('you clicked to check this row');
                $(this).parents('.cmx-table-row').addClass('cmx-active-row');
                $(this).prop("checked", true);
            } else {
                // console.log('you clicked to uncheck this row');
                $(this).parents('.table-row').removeClass('cmx-active-row');
                $(this).prop("checked", false);
            }
        }
    });

    var allRows = $('.cmx-table-container').find('.cmx-table-row [type="checkbox"]');

    $('#checkbox-unchecked-all').on("click", function() {

        if ($(this).is(':checked')) {
            $.each(allRows, function(i,value) {
                if( !$(this).parents('.cmx-table-row').hasClass('cmx-header') ) {
                    $(this).parents('.cmx-table-row').addClass('cmx-active-row');
                    $(this).prop("checked", true);
                } 
            }); // end each();
            
        } else {
            $.each(allRows, function(i,value) {
                if( !$(this).parents('.cmx-table-row').hasClass('cmx-header') ) {
                    $(this).parents('.cmx-table-row').removeClass('cmx-active-row');
                    $(this).prop("checked", false);
                }
            }); // end each();
        }
    });
}







