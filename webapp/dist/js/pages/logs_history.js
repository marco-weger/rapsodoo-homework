$("#WAIT").hide();

let table = '';
let go = true;

$(document).ready(function(){
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

    $("#macchina, #logType").on('change',function (){
        if($(this).attr('id') === 'macchina')
            getMachineLogTypes();
        if($("#logType").val() !== null)
            getData();
    });
});

function getData(){
    if(go){
        go = false;

        try {
            table.destroy();
        } catch (error) {}

        $('#table').empty();
        $("#WAIT").show();

        console.log("service.php?type=GetLogs&macchina=" + $("#macchina").val() + "&from=" + $("#from").val() + "&to=" + $("#to").val()
        );

        $.ajax({
            type: "GET",
            url: "service.php",
            data: {
               'type': 'GetLogs',
               'macchina': $("#macchina").val(),
               'logType': $("#logType").val(),
               'from': $("#from").val(),
               'to': $("#to").val()
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                $("#WAIT").hide();

                let first = true;
                let header = [];
                let rows = [];
                let row = [];
                if(data.length > 0) {
                    $.each(data, function (idx, elem) {
                        row = [];
                        $.each(elem, function (subIdx, subElem) {
                            if (first) {
                                header.push({"title": subIdx});
                            }
                            if (subElem != null) {
                                if(subIdx === 'INIZIO PRODUZIONE'
                                    || subIdx === 'FINE PRODUZIONE')
                                {
                                    let tmp = subElem.toString();
                                    if(tmp.length > 19)
                                    {
                                        tmp = tmp.substring(0, 19);
                                    }
                                    row.push(tmp);
                                }
                                else
                                {
                                    row.push(subElem.toString());
                                }
                            } else {
                                row.push('');
                            }
                        });
                        if (first) {
                            first = false;
                        }
                        rows.push(row);
                    });

                    table = $('#table').DataTable({
                        data: rows,
                        columns: header,
                        searching: false,
                        ordering: false,
                        info: false,
                        scrollX: false,
                        //scrollCollapse: true,
                        paging: true,
                        lengthChange: false,
                        pageLength: 9,
                        fixedHeader: false
                    });
                }
                else {
                    header.push({"title": " "});
                    table = $('#table').DataTable({
                        //data: ,
                        columns: header,
                        searching: false,
                        ordering: false,
                        info: false,
                        scrollX: false,
                        //scrollCollapse: true,
                        paging: false,
                        lengthChange: false,
                        pageLength: 9,
                        fixedHeader: false
                    });
                }

                table.draw();
                go = true;
            },
            error: function (msg) {
                console.log("ERROR: " +msg.responseText);
                alert("ERROR: " +msg.responseText);
                $("#WAIT").hide();
                go = true;
            }
        });
    }
}

function getMachineLogTypes()
{
    $.ajax({
        type: "GET",
        url: "service.php",
        data: {
            'type': 'GetMachineLogTypes',
            'macchina': $("#macchina").val()
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            let toAdd = '<option value="%">--- TUTTI ---</option>';
            $.each(data, function (idx, elem) {
                toAdd += `<option value="${elem}">${elem}</option>`;
            });

            $("#logType").empty().append(toAdd).change();
        },
        error: function (msg) {
            console.log("ERROR: " +msg.responseText);
            alert("ERROR: " +msg.responseText);
            $("#WAIT").hide();
        }
    });
}