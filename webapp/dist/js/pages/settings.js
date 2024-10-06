$(document).ready(function(){
    jQuery.support.cors = true;

    if($('#modal-msg').find('.modal-body').html().length > 0){
        $('#modal-msg').modal('show');
        let myUrl = window.location.href;
        myUrl = myUrl.substring(0, myUrl.indexOf('?'));
        window.history.pushState({}, document.title, myUrl);
    };

    $("#info").click(function(){
        $("#modal-info").modal('show');
    });
});