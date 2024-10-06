let modalBobina = $('#modal-checkBobina');
let bobina = modalBobina.find("input[name=bobina]");

$(document).ready(function(){
    jQuery.support.cors = true;

    $("#openCheckBobina").on('click', function (){
        bobina.val('');
        modalBobina.modal('show');
    });

    $("#openCloseProduction").on('click', function (){
        $("#modal-close").modal('show');
    });

    modalBobina.on('shown.bs.modal', function(){
        bobina.focus();
    });

    $("#checkBobina").on('click', function (){
        if(bobina.val().length > 0){
            checkBobina();
        }
    });

    bobina
        .on('keyup', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkBobina();
            }
        })
        .on("click", function () {
            $(this).select();
        });
});

let lightBobina = true;
function checkBobina(){
    if(lightBobina){
        lightBobina = false;
        $.ajax({
            type: "GET",
            url: "taglierina_service.php",
            data: "type=CheckBobina&" +
                "scheda=" + $("input[name=scheda]").val() + "&"+
                "bobina="+bobina.val(),
            contentType: "application/text; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                let feed = $('#modal-bobinaFeed');
                let body = data.toString() === 'true' ? 'Bobina corretta!' : 'Bobina errata!';
                feed.find('.modal-body').find("h3").html(body);
                modalBobina.modal('hide');
                feed.modal('show');
                lightBobina = true;

                setTimeout(function (){
                    feed.modal('hide');
                }, 5000);
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
                lightBobina = true;
            }
        });
    }
}