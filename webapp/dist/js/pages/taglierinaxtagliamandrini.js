let scheda = $(".card").find("input[name=scheda]");
//let bobina = $(".card").find("input[name=bobina]");
//let tag = $(".card").find("input[name=tag]");
//let modalMsg = $('#modal-msg');

//let loginError = $("#modal-login-error");
//let loginUsername = loginError.find('input[name=username]');
//let loginPassword = loginError.find('input[name=password]');

$(document).ready(function(){
    jQuery.support.cors = true;

    $("#checkScheda").on('click', function (){
        if(scheda.val().length > 0){
            checkScheda();
        }
    });

    scheda
        .on('focus', function () {
            $(this).select();
        })
        .on('keyup', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkScheda();
            }
        })
        .on("click", function () {
            $(this).select();
        });

    /*
    if(modalMsg.find('h3').html().trim().length > 0){
        modalMsg.modal('show');
        let myUrl = window.location.href;
        myUrl = myUrl.substring(0, myUrl.indexOf('&msg='));
        window.history.pushState({}, document.title, myUrl);

        setTimeout(function (){
            modalMsg.modal('hide');
        }, 5000);
    }
    */

    scheda.select();
});

let lightScheda = true;
function checkScheda(){
    if(lightScheda){
        lightScheda = false;

        $.ajax({
            type: "GET",
            url: "tagliamandrini_service.php",
            data: "type=getInfo&" +
                "scheda="+scheda.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                console.log(data);
                if(Object.keys(data).length > 0)
                {
                    scheda.removeClass("is-invalid");

                    let modal = $("#modal");

                    modal.find(".modal-title").html("Scheda " + scheda.val());

                    let body = "";
                    body += "<div class='row'>";

                    let i = 1;
                    $.each(data, function (idx, elem) {
                        let qta = elem.split(" di ");
                        let progress = 100 * parseFloat(qta[0]) / parseFloat(qta[1]);
                        let color = 'warning';
                        if(progress >= 100)
                        {
                            color =  'success';
                            progress = 100
                        }

                        body += "<div class='col-3'>";
                        body += "<div class='callout callout-secondary'>";
                        body += "<h5>Fascia " + (i++) + "</h5>";
                        body += "<h5>Quantità: " + elem + "</h5>";
                        //body += "<h5>Quantità: " + qta + "</h5>";
                        body += "<h5><div class='progress progress-xs'><div class='progress-bar bg-" + color + "' style='width: " + progress + "%'></div></h5>";
                        body += "</div>";
                        body += "</div>";
                    });
                    body += "</div>";

                    modal.find(".modal-body").html(body);

                    modal.modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    modal.modal('show');
                }
                else
                {
                    scheda.addClass("is-invalid");
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

function getFormattedDate(datetime){
    return datetime.getDate().toString().padStart(2, '0') + "/"
        + (datetime.getMonth() + 1).toString().padStart(2, '0') + "/"
        + datetime.getFullYear();
}