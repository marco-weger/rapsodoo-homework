$(function () {
    jQuery.support.cors = true;

    //Initialize Select2 Elements
    $('.select2').select2();

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
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
});