let tMin = null;
let tMax = null;

$(document).ready(function(){
    jQuery.support.cors = true;

    if($('#modal-msg').find('.modal-body').html().length > 0){
        $('#modal-msg').modal('show');
        let myUrl = window.location.href;
        myUrl = myUrl.substring(0, myUrl.indexOf('?'));
        window.history.pushState({}, document.title, myUrl);
    };

    $("input[name=tMin]")
        .on('focus', function(e){
            tMin = $(this).val();
        })
        .on('change', function(e){
            let modal = $("#modal-save");
            let fan = $(this).closest(".card").attr("fan");
            let t = $(this).val();
            let tMax = $(this).closest(".card").find("input[name=tMax]").val();
            if(parseFloat(t) < parseFloat(tMax))
            {
                let body = "Sei sicuro di voler impostare la temperatura minima del <b>compattatore " +
                    fan + "</b> a <b>" + t + "</b> °C?";
                modal.find(".modal-body").html(body);

                modal.find("input[name=fan]").val(fan);
                modal.find("input[name=field]").val("TEMPERATURA_MINIMA");
                modal.find("input[name=value]").val(t);

                modal.modal('show');
            }
            else
            {
                $(this).val(tMin);
            }
        });

    $("input[name=tMax]")
        .on('focus', function(e){
            tMax = $(this).val();
        })
        .on('change', function(e){
            let modal = $("#modal-save");
            let fan = $(this).closest(".card").attr("fan");
            let t = $(this).val();
            let tMin = $(this).closest(".card").find("input[name=tMin]").val();
            if(parseFloat(tMin) < parseFloat(t))
            {
                let body = "Sei sicuro di voler impostare la temperatura massima del <b>compattatore " +
                    fan + "</b> a <b>" + t + "</b> °C?";
                modal.find(".modal-body").html(body);

                modal.find("input[name=fan]").val(fan);
                modal.find("input[name=field]").val("TEMPERATURA_MASSIMA");
                modal.find("input[name=value]").val(t);

                modal.modal('show');
            }
            else
            {
                $(this).val(tMax);
            }
        });

    $(document).on('click', '#newMaterial', function (){
        let modal = $("#modal-newMaterial");

        modal.find('input[name=description]').val("");
        modal.find('input[name=coefficient]').val(1);

        modal.modal('show');
    });

    $(document).on('click', '.editMaterial', function (){
        let modal = $("#modal-editMaterial");

        let material = $(this).parent().parent().parent().find("td:first").html();
        let coefficient = material;

        material = material.substring(0, material.lastIndexOf(" "))
        modal.find('input[name=description]').val(material);

        coefficient = coefficient.substring(1 + coefficient.lastIndexOf("("), coefficient.lastIndexOf(")"));
        console.log(coefficient);
        modal.find('input[name=coefficient]').val(parseFloat(coefficient));

        modal.find('input[name=id]').val($(this).attr('materialId'));
        modal.modal('show');
    });

    $(document).on('click', '.deleteMaterial', function (){
        let modal = $("#modal-deleteMaterial");

        let material = $(this).parent().parent().parent().find("td:first").html();
        material = material.substring(0, material.lastIndexOf(" "))

        let body = "Sei sicuro di voler eliminare il materiale <b>" + material + "</b>?";
        modal.find(".modal-body").html(body);

        modal.find('input[name=id]').val($(this).attr('materialId'));
        modal.modal('show');
    });

    $(document).on('click', '#newMachine', function (){
        let modal = $("#modal-newMachine");

        modal.find('input[name=description]').val("");
        modal.find('input[name=coefficient]').val(1);

        modal.modal('show');
    });

    $(document).on('click', '.editMachine', function (){
        let modal = $("#modal-editMachine");

        let material = $(this).parent().parent().parent().find("td:first").html();
        let coefficient = material;

        material = material.substring(0, material.lastIndexOf(" "))
        modal.find('input[name=description]').val(material);

        coefficient = coefficient.substring(1 + coefficient.lastIndexOf("("), coefficient.lastIndexOf(")"));
        console.log(coefficient);
        modal.find('input[name=coefficient]').val(parseFloat(coefficient));

        modal.find('input[name=id]').val($(this).attr('machineId'));
        modal.modal('show');
    });

    $(document).on('click', '.deleteMachine', function (){
        let modal = $("#modal-deleteMachine");

        let machine = $(this).parent().parent().parent().find("td:first").html();
        machine = machine.substring(0, machine.lastIndexOf(" "))

        let body = "Sei sicuro di voler eliminare la macchina <b>" + machine + "</b>?";
        modal.find(".modal-body").html(body);

        modal.find('input[name=id]').val($(this).attr('machineId'));
        modal.modal('show');
    });
});