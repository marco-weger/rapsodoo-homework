let modalMandrel = $('#modal-mandrel');
let modalClose = $('#modal-close');
let modalSuspend = $('#modal-suspend');
let form = $("#changeForm");
let modalMsg = $('#modal-msg');

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

    if(modalMsg.find('h3').html().trim().length > 0){
        modalMsg.modal('show');
        let myUrl = window.location.href;
        myUrl = myUrl.substring(0, myUrl.indexOf('&msg='));
        window.history.pushState({}, document.title, myUrl);

        setTimeout(function (){
            modalMsg.modal('hide');
        }, 5000);
    }

    $("#openMandrel").on('click', function (){
        modalMandrel.find('input').val('');
        modalMandrel.find('input').removeClass("is-valid");
        modalMandrel.modal('show');
    });

    $('#modal-mandrel').on('shown.bs.modal', function () {
        modalMandrel.find("input[name=mandrel]").focus();
    });

    modalClose.on('shown.bs.modal', function () {
        modalClose.find("input[name=tag]").val("");
        modalClose.find("input[name=tag]").removeClass("is-valid");
        modalClose.find("input[name=tag]").focus();
    });

    modalSuspend.on('shown.bs.modal', function () {
        modalSuspend.find("input[name=tag]").val("");
        modalSuspend.find("input[name=tag]").removeClass("is-valid");
        modalSuspend.find("input[name=tag]").focus();
    });

    $("#openCloseProduction").on('click', function (){
        modalClose.find('input[type=text]').val('');
        modalClose.find('input[type=text]').removeClass("is-valid");
        modalClose.modal('show');
    });

    $("#openSuspendProduction").on('click', function (){
        modalSuspend.find('input[type=text]').val('');
        modalSuspend.find('input[type=text]').removeClass("is-valid");
        modalSuspend.modal('show');
    });

    $(document)
        .on('click', "#checkMandrel", function (){
            if(modalMandrel.find("input[name=mandrel]").val().length > 0){
                checkMandrel();
            }
        })
        .on('keyup', "input[name=mandrel]", function (e){
            modalMandrel.find("input[name=mandrel]").removeClass("is-valid");
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkMandrel();
            }
        })
        .on('keydown', "input[name=mandrel]", function (e){
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        })
        .on('click', "input[name=mandrel]", function (){
            $(this).select();
        })
        .on('click', ".checkTag", function (){
            let inputTag = $(this).parent().parent().parent().find("input[name=tag]");
            inputTag.val(inputTag.val().toUpperCase());
            if(inputTag.val().length > 0){
                checkTag(inputTag);
            }
        })
        .on('keyup', "input[name=tag]", function (e){
            $(this).removeClass("is-valid");
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkTag($(this));
            }
        })
        .on('keydown', "input[name=tag]", function (e){
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        })
        .on('click', "input[name=tag]", function (){
            $(this).select();
        })
        .on('click', "#modal-mandrel-a-ko", function (){
            modalMandrel.find("input[name=mandrel]").addClass("is-invalid");
            modalMandrel.find("input[name=mandrel]").removeClass("is-valid");
            $("#modal-mandrel-a").modal("hide");
            modalMandrel.modal("show");
        })
        .on('click', "#modal-mandrel-a-ok", function (){
            modalMandrel.find("input[name=mandrel]").removeClass("is-invalid");
            modalMandrel.find("input[name=mandrel]").addClass("is-valid");
            $("#modal-mandrel-a").modal("hide");
            modalMandrel.modal("show");
        })
        .on('click', "#modal-mandrel-f-ko", function (){
            modalMandrel.find("input[name=mandrel]").addClass("is-invalid");
            modalMandrel.find("input[name=mandrel]").removeClass("is-valid");
            $("#modal-mandrel-f").modal("hide");
            modalMandrel.modal("show");
        })
        .on('click', "#modal-mandrel-f-ok", function (){
            modalMandrel.find("input[name=mandrel]").removeClass("is-invalid");
            modalMandrel.find("input[name=mandrel]").addClass("is-valid");
            $("#modal-mandrel-f").modal("hide");
            modalMandrel.modal("show");
        })
        .on('click', "#change", function (){
            if(~modalMandrel.find("input[name=mandrel]").attr('class').indexOf("is-valid") &&
                ~modalMandrel.find("input[name=tag]").attr('class').indexOf("is-valid"))
            {
                form.find("input[name=tag]").val(modalMandrel.find("input[name=tag]").val());
                form.find("input[name=mandrel]").val(modalMandrel.find("input[name=mandrel]").val());
                $("#changeForm").submit();
            }
        })
        .on('click', "#close", function (){
            if(~modalClose.find("input[name=tag]").attr('class').indexOf("is-valid"))
            {
                modalClose.find("form").submit();
            }
        })
        .on('click', "#suspend", function (){
            if(~modalSuspend.find("input[name=tag]").attr('class').indexOf("is-valid"))
            {
                modalSuspend.find("form").submit();
            }
        });

    /*
    bobina
        .on('keyup', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkBobina();
            }
        })
        .on('keydown', function (e){
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        })
        .on("click", function () {
            $(this).select();
        });

     */
});

let lightTag = true;
function checkTag(inputTag){
    if(lightTag){
        lightTag = false;
        $.ajax({
            type: "GET",
            url: "login_service.php",
            data: "type=checkTag&" +
                "tag="+inputTag.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                if(data.toString().toUpperCase() === 'FALSE')
                {
                    inputTag.addClass("is-invalid");
                    inputTag.removeClass("is-valid");
                }
                else
                {
                    inputTag.removeClass("is-invalid");
                    inputTag.addClass("is-valid");
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

let lightMandrel = true;
function checkMandrel(){
    if(lightMandrel){
        let inputMandrel = modalMandrel.find("input[name=mandrel]");
        inputMandrel.val(inputMandrel.val().toUpperCase());
        lightMandrel = false;
        $.ajax({
            type: "GET",
            url: "tagliamandrini_service.php",
            data: "type=checkChangeMandrel&" +
                "mandrel="+inputMandrel.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                if(data.toString().toUpperCase() === 'P')
                {
                    inputMandrel.removeClass("is-invalid");
                    inputMandrel.addClass("is-valid");
                }
                else if(data.toString().toUpperCase() === 'A')
                {
                    modalMandrel.modal("hide");

                    let modal = $("#modal-mandrel-a");
                    modal.modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    modal.modal('show');
                }
                else if(data.toString().toUpperCase() === 'F')
                {
                    modalMandrel.modal("hide");

                    let modal = $("#modal-mandrel-f");
                    modal.modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    modal.modal('show');
                }
                else if(data.toString().toUpperCase() === 'B')
                {
                    inputMandrel.addClass("is-invalid");
                    inputMandrel.removeClass("is-valid");
                }
                else if(data.toString().toUpperCase() === 'L')
                {
                    inputMandrel.addClass("is-invalid");
                    inputMandrel.removeClass("is-valid");
                }
                else
                {
                    alert(data);
                }
                lightMandrel = true;
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
                lightMandrel = true;
            }
        });
    }
}