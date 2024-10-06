let scheda = $(".card").find("input[name=scheda]");
let bobina = $(".card").find("input[name=bobina]");
let tag = $(".card").find("input[name=tag]");
let modalMsg = $('#modal-msg');

let loginError = $("#modal-login-error");
let loginUsername = loginError.find('input[name=username]');
let loginPassword = loginError.find('input[name=password]');

$(document).ready(function(){
    jQuery.support.cors = true;

    $("#checkScheda").on('click', function (){
        if(scheda.val().length > 0){
            checkScheda();
        }
    });

    scheda
        .on('keyup', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkScheda();
            }
        })
        .on("click", function () {
            $(this).select();
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

    $("#checkTag").on('click', function (){
        if(tag.val().length > 0){
            checkTag();
        }
    });

    tag
        .on('keyup', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkTag();
            }
        })
        .on("click", function () {
            $(this).select();
        });

    loginError.on('shown.bs.modal', function(){
        $(this).find('input[name=username]').focus();
    });

    $("#manualLogin").on('click', function (){
        if(loginUsername.val().length > 0 && loginPassword.val().length > 0){
            login();
        }
    });

    loginUsername.on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            login();
        } else {
            $(this).val($(this).val().toUpperCase());
        }
    });

    loginPassword.on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            login();
        }
    });

    if(modalMsg.find('h3').html().trim().length > 0){
        modalMsg.modal('show');
        let myUrl = window.location.href;
        myUrl = myUrl.substring(0, myUrl.indexOf('&msg='));
        window.history.pushState({}, document.title, myUrl);

        setTimeout(function (){
            modalMsg.modal('hide');
        }, 5000);
    }

    scheda.select();
});

let lightScheda = true;
function checkScheda(){
    if(lightScheda){
        lightScheda = false;
        $.ajax({
            type: "GET",
            url: "taglierina_service.php",
            data: "type=CheckScheda&" +
                "scheda="+scheda.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                if(data)
                {
                    scheda.removeClass("is-invalid");
                    scheda.addClass("is-valid");

                    bobina.val('');
                    bobina.parent().removeClass("d-none");
                    bobina.select();
                }
                else
                {
                    scheda.addClass("is-invalid");
                    scheda.removeClass("is-valid");

                    bobina.removeClass("is-invalid");
                    bobina.removeClass("is-valid");

                    bobina.val('');
                    bobina.parent().addClass("d-none");

                    tag.removeClass("is-invalid");
                    tag.removeClass("is-valid");

                    tag.val('');
                    tag.parent().addClass("d-none");

                    modalMsg.find('h3').html("Scheda non trovata!");
                    modalMsg.modal("show");
                    setTimeout(function (){
                        modalMsg.modal('hide');
                        scheda.select();
                    }, 5000);
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
        $.ajax({
            type: "GET",
            url: "taglierina_service.php",
            data: "type=CheckBobina&" +
                "scheda="+scheda.val()+"&"+
                "bobina="+bobina.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                if(data.toString() === 'true')
                {
                    bobina.removeClass("is-invalid");
                    bobina.addClass("is-valid");

                    tag.removeClass("is-invalid");
                    tag.removeClass("is-valid");

                    tag.val('');
                    tag.parent().removeClass("d-none");
                    tag.select();
                }
                else
                {
                    bobina.addClass("is-invalid");
                    bobina.removeClass("is-valid");

                    modalMsg.find('h3').html("Bobina non trovata! Vallora atteso <b>" + data.lotto + "</b> oppure <b>" + data.commessa + "</b> oppure <b>" + data.materia_prima + "</b>.");
                    modalMsg.modal("show");
                    setTimeout(function (){
                        modalMsg.modal('hide');
                        bobina.select();
                    }, 5000);

                    tag.val('');
                    tag.parent().addClass("d-none");
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

let lightTag = true;
function checkTag(){
    if(lightTag){
        lightTag = false;
        $.ajax({
            type: "GET",
            url: "taglierina_service.php",
            data: "type=CheckTag&" +
                "scheda="+scheda.val()+"&"+
                "bobina="+bobina.val()+"&"+
                "tag="+tag.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                if(data.toString().toUpperCase() === 'FALSE')
                {
                    tag.addClass("is-invalid");
                    tag.removeClass("is-valid");

                    loginError.find('.modal-body').find('input').val('');
                    loginError.modal("show");
                }
                else
                {
                    bobina.removeClass("is-invalid");
                    bobina.addClass("is-valid");

                    tag.removeClass("is-invalid");
                    tag.addClass("is-valid");

                    let body = ['', ''];
                    let i = 0;
                    $.each(data, function (idx, elem) {
                        if(idx !== 'isError')
                        {
                            body[i % 2] += "<h3><b>" + idx + "</b></h3>";
                            if(idx.includes('Data') && elem.toString().length === 10)
                            {
                                body[i % 2] += "<h5>" + getFormattedDate(new Date(elem)) + "</h5>";
                            }
                            else
                            {
                                body[i % 2] += "<h5>" + elem + "</h5>";
                            }

                            i++;
                        }
                    });

                    let modal = $("#modal-start");

                    modal.find('input[name=scheda]').val(scheda.val());
                    modal.find('input[name=bobina]').val(bobina.val());
                    modal.find('input[name=tag]').val(tag.val());

                    modal.find('.modal-body').html("<div class='row'><div class='col-6'>" + body[0] + "</div><div class='col-6'>" + body[1] + "</div></div>");
                    modal.modal("show");
                }
                lightTag = true;
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
                lightTag = true;
            }
        });
    }
}

let lightLogin = true;
function login(){
    if(lightLogin){
        lightLogin = false;
        $.ajax({
            type: "GET",
            url: "taglierina_service.php",
            data: "type=CheckLogin&" +
                "scheda="+scheda.val()+"&"+
                "bobina="+bobina.val()+"&"+
                "username="+loginUsername.val()+"&"+
                "password="+loginPassword.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                if(data.toString().toUpperCase() === 'FALSE')
                {
                    loginUsername.addClass("is-invalid");
                    loginUsername.removeClass("is-valid");

                    loginPassword.addClass("is-invalid");
                    loginPassword.removeClass("is-valid");
                }
                else
                {
                    let body = ['', ''];
                    let i = 0;
                    $.each(data, function (idx, elem) {
                        if(idx !== 'isError')
                        {
                            body[i % 2] += "<h3><b>" + idx + "</b></h3>";
                            if(idx.includes('Data') && elem.toString().length === 10)
                            {
                                body[i % 2] += "<h5>" + getFormattedDate(new Date(elem)) + "</h5>";
                            }
                            else
                            {
                                body[i % 2] += "<h5>" + elem + "</h5>";
                            }

                            i++;
                        }
                    });

                    loginError.modal("hide");

                    let modal = $("#modal-start");

                    modal.find('input[name=scheda]').val(scheda.val());
                    modal.find('input[name=bobina]').val(bobina.val());
                    modal.find('input[name=username]').val(loginUsername.val());

                    modal.find('.modal-body').html("<div class='row'><div class='col-6'>" + body[0] + "</div><div class='col-6'>" + body[1] + "</div></div>");
                    modal.modal("show");
                }
                lightLogin = true;
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
                lightLogin = true;
            }
        });
    }
}
function getFormattedDate(datetime){
    return datetime.getDate().toString().padStart(2, '0') + "/"
        + (datetime.getMonth() + 1).toString().padStart(2, '0') + "/"
        + datetime.getFullYear();
}