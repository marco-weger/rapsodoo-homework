let currentOrder = null;
let currentItem = null;
let currentQuantity = null;
let tot = 0;

$(function () {
    jQuery.support.cors = true;

    //Initialize Select2 Elements
    $('.select2').select2();

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    $('.orderRow').on('click', function() {
        if(!$(this).hasClass('bg-success'))
        {
            $(this).addClass('bg-success');
            if(currentOrder !== null)
            {
                document.getElementById(currentOrder).classList.remove('bg-success')
            }
            currentOrder =  $(this).prop('id').toString();
            currentQuantity = parseInt($(this).children()[5].innerHTML);
            currentItem = $(this).children()[1].getAttribute('code');
            $("input[name=order]").val(currentOrder);
            getObligations();
        }
        else
        {
            $(this).removeClass('bg-success');
            currentOrder = null;
            currentQuantity = null;
            currentItem = null;
        }

        tot = 0;
        $(".obligationRow").trigger("change");
    });

    $(".order").on('click', function () {
        let val, expanded, table, tr, a, i, txtValue;

        val = $(this).children().children()[1].innerText; // Ordine nr. xxx del xxx
        expanded = $(this)[0].getAttribute('aria-expanded') === 'true';
        table = document.getElementById("ORDERS");
        tr = table.getElementsByTagName('tr');

        if(currentOrder !== null)
        {
            document.getElementById(currentOrder).classList.remove('bg-success')
            currentOrder = null;
            currentQuantity = null;
            currentItem = null;
        }

        if(!expanded)
        {
            for (i = 0; i < tr.length; i++) {
                if ($(tr[i]).hasClass('order')) {
                    a = tr[i].getElementsByTagName("order")[0].innerText;
                    txtValue = a;
                    if (a !== val) {
                        if (txtValue.toUpperCase().indexOf(val) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
            $(':button').prop('disabled', false);
        }
        else
        {
            for (i = 0; i < tr.length; i++) {
                if ($(tr[i]).hasClass('order')) {
                    tr[i].style.display = "";
                }
            }
            $("#OBLIGATIONS").empty();
            $("#obligationItem").empty();

            $("#tot").html("0/0");
            $(':button').prop('disabled', true);
        }

        tot = 0;
        $(".obligationRow").trigger("change");
    });

    $(document).on("change", ".obligationRow", function () {
        let qta = $(this).parent().parent().parent().find('td')[6].innerHTML;
        if (this.checked) {
            tot += parseInt(qta);
        } else {
            tot -= parseInt(qta);
        }
        $("#tot").html(tot + "/" + currentQuantity);
    });

    $("#CURRENT").click();
    $(".CURRENT").click();
});

let go = true;
function getObligations()
{
    if(go){
        let obl = $("#OBLIGATIONS");
        obl.empty();
        obl.parent().find("thead").hide();
        obl.parent().find("tfoot").hide();
        go = false;
        $("#WAIT").show();

        $.ajax({
            type: "GET",
            url: "order_service.php",
            data: "type=getObligations&" +
                "order=" + currentOrder + "&" +
                "item=" + currentItem,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                let body = '';
                $.each(data, function (idx, elem) {
                    let checked = '';
                    if(elem.used)
                    {
                        checked = 'checked';
                        tot += parseInt(elem.quantity);
                    }

                    let row = '<tr>';
                    row += '<td>' + elem.number + '</td>';
                    row += '<td>' + getFormattedDate(new Date(elem.date_order)) + '</td>';
                    row += '<td>' + getFormattedDate(new Date(elem.date_delivery)) + '</td>';
                    row += '<td>' + elem.customer + '</td>';
                    row += '<td>' + elem.lot + '</td>';
                    row += '<td>' + elem.unit + '</td>';
                    row += '<td>' + elem.quantity + '</td>';
                    row += '<td><div class="custom-control custom-checkbox">' +
                        '<input class="custom-control-input custom-control-input-danger obligationRow" ' +
                        'type="checkbox" id="' + elem.id + '" name="' + elem.id + '" ' + checked + '>' +
                        '<label class="custom-control-label text-danger" for="' + elem.id + '"></label></div></td>';
                    row += '<tr>';
                    body += row;
                });

                $("#tot").html(tot + "/" + currentQuantity);

                go = true;
                $("#WAIT").hide();
                obl.parent().find("thead").show();
                obl.parent().find("tfoot").show();
                obl.append(body);
            },
            error: function (msg) {
                go = true;
                alert("ERROR: " +msg.responseText);
                $("#WAIT").hide();
            }
        });
    }
}

function getFormattedDate(datetime){
    return datetime.getDate().toString().padStart(2, '0') + "/"
        + (datetime.getMonth() + 1).toString().padStart(2, '0') + "/"
        + datetime.getFullYear();
}