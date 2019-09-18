module.exports = function() {
    // keeping active the number field on hover over plus minus btns
    $('.cmx-number-field-btn.cmx-minus-btn').on("mouseenter", function(){
        $(this).parent().find('.cmx-number-control').addClass("active");
    });

    $('.cmx-number-field-btn.cmx-minus-btn').on("mouseleave", function(){
        $(this).parent().find('.cmx-number-control').removeClass("active");
    });

    $('.cmx-number-field-btn.cmx-minus-btn').on('click', function(event){
        var numberElement = $(this).parent().find('.cmx-number-control').get(0);
        numberElement.stepDown();
    });

    $('.cmx-number-field-btn.cmx-plus-btn').on("mouseenter", function(){
        $(this).parent().find('.cmx-number-control').addClass("active");
    });

    $('.cmx-number-field-btn.cmx-plus-btn').on("mouseleave", function(){
        $(this).parent().find('.cmx-number-control').removeClass("active");
    });

    $('.cmx-number-field-btn.cmx-plus-btn').on('click', function(event){
        var numberElement = $(this).parent().find('.cmx-number-control').get(0);
        numberElement.stepUp();
    });
}