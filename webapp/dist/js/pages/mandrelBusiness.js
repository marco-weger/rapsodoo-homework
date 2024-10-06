let submit = $("button[type=submit]");
let modalMsg = $('#modal-msg');
let modalHistory = $("#modal-history");
let selectAll = true;

let Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000
});

$(document).ready(function(){
    jQuery.support.cors = true;

    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    if(modalMsg.find('h3').html().trim().length > 0){
        modalMsg.modal('show');
        let myUrl = window.location.href;
        myUrl = myUrl.substring(0, myUrl.indexOf('feed='));
        window.history.pushState({}, document.title, myUrl);

        setTimeout(function (){
            modalMsg.modal('hide');
        }, 5000);
    }

    submit.addClass("disabled");
    submit.attr("disabled","disabled");

    $(document)
        .on('change', "input[type=checkbox]", function (){
            if($("input[type=checkbox]:checked").length === 0)
            {
                submit.addClass("disabled");
                submit.attr("disabled","disabled");
            }
            else
            {
                submit.removeClass("disabled");
                submit.removeAttr("disabled");
            }
        })
        .on('click', "#selectAll", function (){
            if(selectAll)
            {
                $("input[type=checkbox]").prop("checked",true);
                $(this).html("Deseleziona tutti");
                submit.removeClass("disabled");
                submit.removeAttr("disabled");
            } else {
                $("input[type=checkbox]").prop("checked",false);
                $(this).html("Seleziona tutti");
                submit.addClass("disabled");
                submit.attr("disabled","disabled");
            }
            selectAll = !selectAll;
        })
        .on('mouseover', ".fa-exclamation", function (){
            Toast.fire({
                icon: 'warning',
                title: 'Valore di giacenza non coerente in Business! Per effettuare lo scarico è necessaria una giacenza in bancali intera.'
            });
        })
        .on('click', "#showHistory", function (){
            let val = $(this).parent().parent().parent().find("select[name=import]").val();
            if(val !== null)
            {
                getHistory(val);
            }
        });
});

let go = true;
function getHistory(id){
    if(go){
        go = false;
        modalHistory.find("tbody").html("");
        modalHistory.modal('show');
        $("#WAIT").show();
        $.ajax({
            type: "GET",
            url: "tagliamandrini_service.php",
            data: "type=getImportHistory&" +
                "id="+id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (data) {
                let body = '';
                $.each(data, function (idx, elem) {
                    let current = '<tr>';

                    current += `<td>${elem['item']}`;
                    current += `<td>${elem['lot']}`;
                    current += `<td>${elem['description']}`;

                    body += current;
                });
                go = true;
                $("#WAIT").hide();
                modalHistory.find("tbody").html(body);
            },
            error: function (msg) {
                go = true;
                alert("ERROR: " +msg.responseText);
            }
        });
    }
}