let go = true;
let date = $("input[name='date']");
let loader = $("#loader");
let table = $('#table').DataTable({
    data: [],
    columns: [
        { data: 'Regione', title: 'Regione' },
        { data: 'Casi totali', title: 'Casi totali' }
    ],
    searching: false,
    ordering: false,
    info: false,
    scrollX: false,
    paging: false,
    lengthChange: false,
    fixedHeader: true,
    language: {
        emptyTable: "Nessun dato disponibile per la data selezionata"
    }
});

$(document).ready(function(){
    /*
    jQuery.support.cors = true;

    //Initialize Select2 Elements
    $('.select2').select2();

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });
    */

    $("button[name='excel']").on('click',function ()
    {
        if($("input[type='radio'][name='filterType']:checked").val() === 'latest' || date.val() !== null)
        {
            $(this).closest('form').submit();
        }
    });

    $("input[type='radio'][name='filterType']").on('change',function ()
    {
        let val = $(this).val();
        if(val === 'latest')
        {
            getLatest();
        }
        else if(val === 'date')
        {
            getByDate();
        }
    });

    date.on('blur change',function ()
    {
        if($("input[type='radio'][name='filterType']:checked").val() === 'date')
        {
            getByDate();
        }
    });

    $("input[type='radio'][name='filterType'][value='latest']").prop('checked', true);
    $("input[type='radio'][name='filterType']").trigger('change');
});

function getByDate()
{
    if(go)
    {
        go = false;
        $('#table').hide();
        loader.show();
        $.ajax({
            type: "GET",
            url: "case_per_province_service.php",
            data: "type=GetByDate&date=" + date.val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: showTable,
            error: handleError
        });
    }
}

function getLatest()
{
    if(go)
    {
        go = false;
        $('#table').hide();
        loader.show();
        $.ajax({
            type: "GET",
            url: "case_per_province_service.php",
            data: "type=GetLatest",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: showTable,
            error: handleError
        });
    }
}

function showTable(data, textStatus, jqXHR)
{
    let rows = [];
    $.each(data.values, function (region, totalCases)
    {
        rows.push({
            "Regione": region,
            "Casi totali": totalCases
        });
    });

    table.clear();
    loader.hide();
    table.rows.add(rows).draw();
    $('#table').show();
    go = true;
}

function handleError(jqXHR, textStatus, errorThrown)
{
    console.log("ERROR: " + textStatus.responseText);
    alert("ERROR: " + textStatus.responseText);
    go = true;
}