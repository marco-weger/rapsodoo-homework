$(function () {
    jQuery.support.cors = true;

    //Initialize Select2 Elements
    $('.select2').select2();

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });


    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if((urlParams.has('order')))
    {
        $("#modal_info").modal('show');
    }

    $("#save").on('click', function(){
        $("#type").val("save");
        $("#submit").click();
        //$(this).closest("form").submit();
    });

    $("#saveClose").on('click', function(){
        $("#type").val("saveClose");
        $("#form_info").find(':submit').click();
        if(!$("#form_info").is('valid'))
        {
            $("#modal_saveClose").modal('hide');
            //$("#modal_info").modal('show');
        }
    });

    $(".stop").on('click', function (){
        let machine = $(this).attr('class').toString();
        machine = machine.substring(machine.indexOf('stop-'));
        if(machine.indexOf(' ') > 0)
        {
            machine = machine.substring(0, machine.indexOf(' '));
        }
        machine = machine.substring('stop-'.length);

        let modal = $("#modal_ETICHETTE_end");
        modal.find("input[name=machine]").val(machine);
        modal.modal('show');
    });

    $(".workOrder").on('click', function () {
        let id = $(this).parent().children()[1];
        let order = $(this).parent().parent().parent().parent().parent().parent().parent().parent().children()[0].childNodes[1].innerText;
        let row = $(this).parent().parent().children()[0].innerHTML;

        $("#order_work").empty();
        $("#order_work").append(order);
        $("#row_work").empty();
        $("#row_work").append(row);
        $("#orderToWork").val($(id).val());

        $("#modal_work_lav").modal('show');
    });

    let alert = setInterval(function () {
        checkProduction();
    },10000);

    $("#alert_viewed").on('click', function () {
        $('#modal_alert_end').modal('hide');
        clearInterval(alert);
    });

    $(".cantWork").on('click', function (){
        let modal = $("#modal_event_warning");
        modal.find(".modal-body").html($(this).attr('text'));
        modal.modal("show");
    });
});

function checkProduction() {
    //console.log("OK");
    $.ajax({
        type: "GET",
        url: "order_service.php",
        data: "type=checkProduction&" +
            "order="+$("#orderID").val()+"&" +
            "machine="+$("#machineID").val()+"&" ,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            if(data === true)
                $('#modal_alert_end').modal('show');
        },
        error: function (msg) {
            go = true;
            alert("ERROR: " +msg.responseText);
        }
    });
}