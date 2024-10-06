let modalStart = $("#modal-new");
let form = $("#startForm");
let modalMsg = $('#modal-msg');

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

    $(document)
        .on('click', "#newLot", function (){
            modalStart.find("input[name=lot]").val("");
            modalStart.find("input[name=lot]").removeClass("is-valid");
            modalStart.find("input[name=lot]").removeClass("is-invalid");
            modalStart.find("input[name=tag]").val("");
            modalStart.find("input[name=tag]").removeClass("is-valid");
            modalStart.find("input[name=tag]").removeClass("is-invalid");

            modalStart.modal('show');
        })
        .on('shown.bs.modal', "#modal-new", function () {
            modalStart.find("input[name=lot]").focus();
        })
        .on('click', "#checkLot", function (){
            if(modalStart.find("input[name=lot]").val().length > 0){
                checkLot();
            }
        })
        .on('keyup', "input[name=lot]", function (e){
            modalStart.find("input[name=lot]").removeClass("is-valid");
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkLot();
            }
        })
        .on('keydown', "input[name=lot]", function (e){
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        })
        .on('click', "input[name=mandrel]", function (){
            $(this).select();
        })
        .on('click', "#checkTag", function (){
            if(modalStart.find("input[name=tag]").val().length > 0){
                checkTag();
            }
        })
        .on('keyup', "input[name=tag]", function (e){
            modalStart.find("input[name=tag]").removeClass("is-valid");
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkTag();
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
        .on('click', "#start", function (){
            if(~modalStart.find("input[name=lot]").attr('class').indexOf("is-valid") &&
                ~modalStart.find("input[name=tag]").attr('class').indexOf("is-valid"))
            {
                form.find("input[name=tag]").val(modalStart.find("input[name=tag]").val());
                form.find("input[name=lot]").val(modalStart.find("input[name=lot]").val());
                $("#startForm").submit();
            }
        });
});

let lightLot = true;
function checkLot(){
    if(lightLot){
        let inputLot = modalStart.find("input[name=lot]");
        console.log("tagliamandrini_service.php?type=checkLot&" +
            "lot="+inputLot.val());
        lightLot = false;
        $.ajax({
            type: "GET",
            url: "tagliamandrini_service.php",
            data: "type=checkLot&" +
                "lot="+inputLot.val(),
            contentType: "application/text; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                if(data.toString().toUpperCase() === 'TRUE')
                {
                    inputLot.removeClass("is-invalid");
                    inputLot.addClass("is-valid");
                    modalStart.find("input[name=tag]").focus();
                }
                else
                {
                    modalMsg.find('h3').html(data.toString());
                    modalStart.modal('hide')
                    modalMsg.modal('show');

                    inputLot.addClass("is-invalid");
                    inputLot.removeClass("is-valid");
                }
                lightLot = true;
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
                lightLot = true;
            }
        });
    }
}

let lightTag = true;
function checkTag(){
    if(lightTag){
        let inputTag = modalStart.find("input[name=tag]");
        lightTag = false;
        $.ajax({
            type: "GET",
            url: "login_service.php",
            data: "type=checkTag&" +
                "tag="+inputTag.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "text",
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