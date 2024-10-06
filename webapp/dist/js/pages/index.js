let go = true;
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

    $("#from").on('blur',function (){
        let from = new Date($(this).val());
        let to = new Date($("#to").val());
        if(from > to){
            $("#to").val($(this).val());
        }
        getData();
    });

    $("#to").on('blur',function (){
        let to = new Date($(this).val());
        let from = new Date($("#from").val());
        if(from > to){
            $("#from").val($(this).val());
        }
        getData();
    });
    */

    getData();
});

function getData(){
    if(go){
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
            success: function (data) {
                let rows = [];
                $.each(data.values, function (region, totalCases) {
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
            },
            error: function (msg) {
                console.log("ERROR: " +msg.responseText);
                alert("ERROR: " +msg.responseText);
                go = true;
            }
        });
    }
}