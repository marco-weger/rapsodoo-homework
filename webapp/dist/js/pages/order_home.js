var table = $('#ORD').DataTable({
    "paging": true,
    "lengthChange": false,
    "ordering": true,
    "info": false,
    "searching": false,
    "autoWidth": false,
    "responsive": true,
    "order": [[ 1, "asc" ],[ 0, "desc" ]],
    "pageLength": 16,
});
let loader = '<tr id="loader" class="loader_tr">' +
    '<td class="loader_td" colspan="10">' +
    '<div class="loader"></div></td></tr>';
$(function () {
    jQuery.support.cors = true;

    //Initialize Select2 Elements
    $('.select2').select2();

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    $("#order, #lot, #center, #codart, #recipe, #completed").on('change', function (){
        getOrders();
    });

    $("#from, #to").on('blur', function (){
        getOrders();
    });

    getOrders();
});
let go = true;
function getOrders(){
    if(go){
        go = false;
        $("#ORD").parents('div.dataTables_wrapper').first().hide();
        $("#WAIT").show();

        let completed = $("#completed").is(":checked") ? '1' : '0';
        $.ajax({
            type: "GET",
            url: "order_service.php",
            data: "type=getOrders&" +
                "order="+$("#order").val()+"&" +
                "from="+$("#from").val()+"&" +
                "to="+$("#to").val()+"&"+
                "lot="+$("#lot").val()+"&" +
                "codart="+$("#codart").val()+"&" +
                "recipe="+$("#recipe").val()+"&" +
                "center="+$("#center").val()+"&" +
                "completed=" + completed + "&",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                $("#ORD").parents('div.dataTables_wrapper').first().show();
                $("#WAIT").hide();

                table.clear();
                $.each(data, function (idx, elem) {
                    var toAdd = [];


                    let center = '';
                    try
                    {
                        center = elem['center']['description'];
                    } catch {}

                    let evaded = elem['completed'];
                    if(evaded === "1")
                    {
                        evaded = '<i class="fas fa-check"></i>';
                    }
                    else
                    {
                        evaded = "";
                    }

                    let order = `<a class="link-red" href="order_open.php?id=${elem['id']}">${elem['order']}-${elem['row']}</a>`;

                    toAdd.push(order);
                    toAdd.push(getFormattedDate(new Date(elem['date'].toString())));
                    toAdd.push(elem['lot']);
                    toAdd.push(elem['recipe']);
                    toAdd.push(elem['item']);
                    toAdd.push(elem['unit']);
                    toAdd.push(elem['quantity']);
                    toAdd.push(elem['description_1']);
                    //toAdd.push(elem['description_2']);
                    toAdd.push(center);
                    toAdd.push(evaded);

                    table.row.add(
                        toAdd
                    );
                });
                go = true;
                table.draw();
            },
            error: function (msg) {
                go = true;
                alert("ERROR: " +msg.responseText);
            }
        });
    }
}

function getFormattedDate(datetime){
    return datetime.getDate().toString().padStart(2, '0') + "/"
        + (datetime.getMonth() + 1).toString().padStart(2, '0') + "/"
        + datetime.getFullYear();
}