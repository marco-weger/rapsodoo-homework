$(document).ready(function(){
    jQuery.support.cors = true;

    $("a[data-toggle=collapse]").on('click', function (){
        let c = $(this).find("i");

        if(c.attr('class').includes("fa-caret-up"))
        {
            $(this).find("i").removeClass("fa-caret-up");
            $(this).find("i").addClass("fa-caret-down");
        }
        else if(c.attr('class').includes("fa-caret-down"))
        {
            $(this).find("i").removeClass("fa-caret-down");
            $(this).find("i").addClass("fa-caret-up");
        }
    });
});