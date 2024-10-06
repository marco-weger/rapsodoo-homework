$(function () {
    jQuery.support.cors = true;

    //Initialize Select2 Elements
    $('.select2').select2();

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    $("#delete").on('click', function (event){
        event.preventDefault();
        let modal = $("#modal_delete");
        modal.modal('show');
    });

    $("#priority").on('change',function (){
        let selected = $(this).val();
        if(selected === 'low')
        {
            $(this).addClass('bg-success');
            $(this).removeClass('bg-warning');
            $(this).removeClass('bg-danger');
        }
        else if(selected === 'standard')
        {
            $(this).removeClass('bg-success');
            $(this).addClass('bg-warning');
            $(this).removeClass('bg-danger');
        }
        else if(selected === 'high')
        {
            $(this).removeClass('bg-success');
            $(this).removeClass('bg-warning');
            $(this).addClass('bg-danger');
        }
    });

    $("#newLav").on('click', function(){
        $("#modal_new_lav").modal('show');
    });

    $(".deleteLav").on('click', function () {
        let lav = $(this).parent().parent().parent().parent().children()[3].childNodes[1];
        let machine = $(this).parent().parent().parent().parent().children()[2];
        $("#description_dlt").empty();
        $("#description_dlt").append($(lav)[0].innerText);
        $("#machine_id_dlt").val($(machine).val());
        $("#modal_delete_lav").modal('show');
    });

    $("#deleteOrder").on('click', function () {
        $("#modal_delete").modal('show');
    });

    $("#deleteOrderProd").on('click', function () {
        $("#modal_delete_prod").modal('show');
    });

    $("#Save").on('click', function () {
       $("#modal_save_not_allowed").modal('show');
    });
});