let isOkScheda = false;
let isOkBobina = false;

$(document).ready(function(){
    jQuery.support.cors = true;

    $("#openCheckBobina").on('click', function (){
        $("#bobina").val('');
        $('#modal-checkBobina').modal('show');
    });

    $("#checkBobina").on('click', function (){
        if($("#bobina").val().length > 0){
            checkBobina();
        }
    });

    $("#bobina").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            checkBobina();
        }
    });
});

let lightBobina = true;
function checkBobina(){
    if(lightBobina){
        lightBobina = false;
        let bobina = $("#bobina").val();
        let scheda = $("#scheda").val();
        $.ajax({
            type: "GET",
            url: "bimec1_service.php",
            data: "type=CheckBobina&" +
                "scheda="+scheda+"&"+
                "bobina="+bobina,
            contentType: "application/text; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                $('#modal-checkBobina').modal('hide');
                if(data.toString() !== 'false')
                {
                    $('#modal-bobinaOk').modal('show');
                }
                else
                {
                    $('#modal-bobinaKo').modal('show');
                }
                lightBobina = true;
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
                lightBobina = true;
            }
        });
    }
}