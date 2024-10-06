let id = null;
let mandrel = "[MANDREL]";
let band = "[BAND]";
let modalStart = $("#modal-start");
let modalDelete = $("#modal-delete");
let modalDb = $("#modal-db");
let form = $("#startForm");
let formDb = $("#dbForm");

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

    $('.run').on("click",function() {
        id = $(this).parent().parent().find("td:nth-child(1)").html();
        let tmp_mandrel = $(this).parent().parent().find("td:nth-child(3)").html();
        let tmp_band = $(this).attr('band');
        let forceQuantity = $(this).attr('forceQuantity') === 'TRUE';
        let tmp_bandDescr = $(this).html();

        modalStart.find(".modal-title").html("Scheda " + id);

        let body = modalStart.find(".modal-body").html();
        body = body.replace(band, tmp_bandDescr);
        body = body.replace(mandrel, tmp_mandrel);
        modalStart.find(".modal-body").html(body);

        mandrel = tmp_mandrel;
        band = tmp_band;

        modalStart.find("input[name=mandrel]").val("");
        modalStart.find("input[name=mandrel]").removeClass("is-valid");
        modalStart.find("input[name=tag]").val("");
        modalStart.find("input[name=tag]").removeClass("is-valid");

        modalStart.find("input[name=quantity]").val("");
        if(forceQuantity)
        {
            modalStart.find("input[name=quantity]").attr("required", "required");
            modalStart.find("#quantity").show();
        }
        else
        {
            modalStart.find("input[name=quantity]").removeAttr("required");
            modalStart.find("#quantity").hide();
        }

        isOnline();
    });

    $('.trash').on("click",function() {
        id = $(this).parent().parent().find("td:nth-child(1)").html();

        modalDelete.find(".modal-body").find("h4").html("Sei sicuro di voler rimuovere dalla programmazione la scheda n. <b>" + id + "</b>?");

        modalDelete.find("input[name=id]").val(id);
        modalDelete.find("input[name=deleteTag]").val("");
        modalDelete.find("input[name=deleteTag]").removeClass("is-valid");

        modalDelete.modal("show");
    });

    $('#getFromDb').on("click",function() {
        modalDb.find("input[name=id]").val("");
        modalDb.find("input[name=id]").removeClass("is-valid");
        modalDb.find("input[name=tag]").val("");
        modalDb.find("input[name=tag]").removeClass("is-valid");

        modalDb.modal("show");
    });

    $(document)
        .on('shown.bs.modal', "#modal-db", function () {
            modalDb.find("input[name=dbId]").focus();
        })
        .on('shown.bs.modal', "#modal-delete", function () {
            modalDelete.find("input[name=deleteTag]").focus();
        })
        .on('click', "#checkMandrel", function (){
            if(modalStart.find("input[name=mandrel]").val().length > 0){
                checkMandrel();
            }
        })
        .on('keyup', "input[name=mandrel]", function (e){
            modalStart.find("input[name=mandrel]").removeClass("is-valid");
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
        .on('click', "#checkTag", function (){
            if(modalStart.find("input[name=tag]").val().length > 0){
                checkTag(modalStart.find("input[name=tag]"));
            }
        })
        .on('keyup', "input[name=tag]", function (e){
            modalStart.find("input[name=tag]").removeClass("is-valid");
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkTag(modalStart.find("input[name=tag]"));
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
            modalStart.find("input[name=mandrel]").addClass("is-invalid");
            modalStart.find("input[name=mandrel]").removeClass("is-valid");
            $("#modal-mandrel-a").modal("hide");
            modalStart.modal("show");
        })
        .on('click', "#modal-mandrel-a-ok", function (){
            modalStart.find("input[name=mandrel]").removeClass("is-invalid");
            modalStart.find("input[name=mandrel]").addClass("is-valid");
            $("#modal-mandrel-a").modal("hide");
            modalStart.modal("show");
        })
        .on('click', "#modal-mandrel-f-ko", function (){
            modalStart.find("input[name=mandrel]").addClass("is-invalid");
            modalStart.find("input[name=mandrel]").removeClass("is-valid");
            $("#modal-mandrel-f").modal("hide");
            modalStart.modal("show");
        })
        .on('click', "#modal-mandrel-f-ok", function (){
            modalStart.find("input[name=mandrel]").removeClass("is-invalid");
            modalStart.find("input[name=mandrel]").addClass("is-valid");
            $("#modal-mandrel-f").modal("hide");
            modalStart.modal("show");
        })
        .on('shown.bs.modal', "#modal-start", function () {
            modalStart.find("input[name=mandrel]").focus();
        })
        .on('keyup', "input[name=deleteTag]", function (e){
            modalDelete.find("input[name=deleteTag]").removeClass("is-valid");
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkTag(modalDelete.find("input[name=deleteTag]"));
            }
        })
        .on('keydown', "input[name=deleteTag]", function (e){
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        })
        .on('click', "#deleteCheckTag", function (){
            if(modalDelete.find("input[name=deleteTag]").val().length > 0){
                checkTag(modalDelete.find("input[name=deleteTag]"));
            }
        })
        .on('click', "#dbCheckTag", function (){
            if(modalDb.find("input[name=dbTag]").val().length > 0){
                checkTag(modalDb.find("input[name=dbTag]"));
            }
        })
        .on('keyup', "input[name=dbTag]", function (e){
            modalDb.find("input[name=dbTag]").removeClass("is-valid");
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkTag(modalDb.find("input[name=dbTag]"));
            }
        })
        .on('keydown', "input[name=dbTag]", function (e){
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        })
        .on('click', "input[name=dbTag]", function (){
            $(this).select();
        })
        .on('click', "#dbCheckId", function (){
            if(modalDb.find("input[name=dbId]").val().length > 0){
                checkId(modalDb);
            }
        })
        .on('keyup', "input[name=dbId]", function (e){
            modalDb.find("input[name=dbId]").removeClass("is-valid");
            if (e.key === 'Enter' || e.keyCode === 13) {
                checkId(modalDb);
            }
        })
        .on('keydown', "input[name=dbId]", function (e){
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        })
        .on('click', "input[name=dbId]", function (){
            $(this).select();
        })
        .on('click', "#start", function (){
            let quantity = modalStart.find("input[name=quantity]");
            let tag = modalStart.find("input[name=tag]").val().toString();
            let mandrel = modalStart.find("input[name=mandrel]").val().toString();

            if(~modalStart.find("input[name=mandrel]").attr('class').indexOf("is-valid") &&
                ~modalStart.find("input[name=tag]").attr('class').indexOf("is-valid") &&
                tag.length > 0 && mandrel.length > 0 &&
                (quantity.attr("required") === undefined ||
                    quantity.val().toString().length > 0)
            )
            {
                form.find("input[name=id]").val(id);
                form.find("input[name=band]").val(band);
                form.find("input[name=quantity]").val(quantity.val());
                form.find("input[name=tag]").val(tag);
                form.find("input[name=mandrel]").val(mandrel);
                $("#startForm").submit();
            }
        })
        .on('click', "#delete", function (){
            if(~modalDelete.find("input[name=deleteTag]").attr('class').indexOf("is-valid"))
            {
                $("#deleteForm").submit();
            }
        })
        .on('click', "#getFromDb", function (){
            if(~modalDb.find("input[name=dbId]").attr('class').indexOf("is-valid") &&
                ~modalDb.find("input[name=dbTag]").attr('class').indexOf("is-valid"))
            {
                formDb.find("input[name=id]").val(modalDb.find("input[name=dbId]").val());
                formDb.find("input[name=tag]").val(modalDb.find("input[name=dbTag]").val());
                $("#dbForm").submit();
            }
        });
});

let lightId = true;
function checkId(){
    if(lightId){
        let inputTag = modalDb.find("input[name=dbId]");
        inputTag.val(inputTag.val().toUpperCase());
        lightId = false;
        $.ajax({
            type: "GET",
            url: "tagliamandrini_service.php",
            data: "type=checkId&" +
                "id="+inputTag.val(),
            contentType: "application/text; charset=utf-8",
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
                    modalDb.find("input[name=dbTag]").focus();
                }
                lightId = true;
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
                lightId = true;
            }
        });
    }
}

let lightTag = true;
function checkTag(inputTag){
    inputTag.val(inputTag.val().toUpperCase());
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

let lightOnline = true;
function isOnline(){
    if(lightOnline){
        lightOnline = false;
        $.ajax({
            type: "GET",
            url: "tagliamandrini_service.php",
            data: "type=isOnline",
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                if(data.toString().toUpperCase() === 'TRUE')
                {
                    modalStart.modal('show');
                }
                else
                {
                    $("#modal-offline").modal('show');
                }
                lightOnline = true;
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
                lightOnline = true;
            }
        });
    }
}

let lightMandrel = true;
function checkMandrel(){
    if(lightMandrel){
        let inputMandrel = modalStart.find("input[name=mandrel]");
        inputMandrel.val(inputMandrel.val().toUpperCase());
        lightMandrel = false;
        $.ajax({
            type: "GET",
            url: "tagliamandrini_service.php",
            data: "type=checkMandrel&" +
                "id=" + id + "&" +
                "mandrel="+inputMandrel.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                if(data.toString().toUpperCase() === 'P')
                {
                    inputMandrel.removeClass("is-invalid");
                    inputMandrel.addClass("is-valid");
                    modalStart.find("input[name=tag]").focus();
                }
                else if(data.toString().toUpperCase() === 'A')
                {
                    modalStart.modal("hide");

                    let modal = $("#modal-mandrel-a");
                    modal.modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    modal.modal('show');
                }
                else if(data.toString().toUpperCase() === 'F')
                {
                    modalStart.modal("hide");

                    let modal = $("#modal-mandrel-f");
                    modal.modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    modal.modal('show');
                }
                else if(data.toString().toUpperCase() === 'B'
                    || data.toString().toUpperCase() === 'E'
                    || data.toString().toUpperCase() === 'L')
                {
                    inputMandrel.addClass("is-invalid");
                    inputMandrel.removeClass("is-valid");
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