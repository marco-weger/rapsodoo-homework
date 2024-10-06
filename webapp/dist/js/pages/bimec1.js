let isOkScheda = false;
let isOkBobina = false;

$(document).ready(function(){
    jQuery.support.cors = true;

    $("#start").prop("disabled",true);
    $("#bobina").prop("disabled",true);
    $("#checkBobina").prop("disabled",true);

    $("#checkScheda").on('click', function (){
        if($("#scheda").val().length > 0){
            checkScheda();
        }
    });

    $("#scheda").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            checkScheda();
        }
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

    if($('#modal-msg').find('.modal-body').html().length > 0){
        $('#modal-msg').modal('show');
        let myUrl = window.location.href;
        myUrl = myUrl.substring(0, myUrl.indexOf('?'));
        window.history.pushState({}, document.title, myUrl);
    };
});

let lightScheda = true;
function checkScheda(){
    if(lightScheda){
        let scheda = $("#scheda").val();
        lightScheda = false;
        $.ajax({
            type: "GET",
            url: "bimec1_service.php",
            data: "type=CheckScheda&" +
                "scheda="+scheda,
            contentType: "application/text; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                if(data.toString() === 'true')
                {
                    $("#bobina").prop("disabled",false);
                    $("#checkBobina").prop("disabled",false);

                    $("#scheda").removeClass("is-invalid");
                }
                else
                {
                    $("#bobina").val('');
                    $("#bobina").prop("disabled",true);
                    $("#checkBobina").prop("disabled",true);

                    $("#scheda").addClass("is-invalid");

                    $("#start").prop("disabled",true);
                }
                lightScheda = true;
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
                lightScheda = true;
            }
        });
    }
}

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
                if(data.toString() === 'false')
                {
                    $("#start").prop("disabled",true);
                    $("#bobina").addClass("is-invalid");
                }
                else
                {
                    $("#schedaModal").val($("#scheda").val());
                    $("#bobinaModal").val($("#bobina").val());

                    $("#start").prop("disabled",false);
                    $("#bobina").removeClass("is-invalid");

                    data = jQuery.parseJSON(data);
                    let descr = '<dl>';
                    $.each(data, function (idx, elem) {
                        descr += "<dt>" + idx + "</dt>";
                        descr += "<dd>" + elem + "</dd>";
                    });
                    descr += '</dl>'
                    $("#body-start").html(descr);

                    $("#modal-start").modal('show');
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