let timeout = setTimeout(function() {
    location.reload();
}, 30000);

$(document).mousemove(function( event ) {
    clearTimeout(timeout);

    timeout = setTimeout(function() {
        location.reload();
    }, 30000);
});

$(document).ready(function(){
    jQuery.support.cors = true;
});