$(function () {
    jQuery.support.cors = true;

    let Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });

    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    $(".run").on("click", function (){
        let service = $(this).attr("class");
        service = service.substring(service.indexOf("run-") + 4);
        if(service.indexOf(" ") > 0)
        {
            service = service.substring(0, service.indexOf(" "));
        }

        let c = $(this).parent().parent().parent();
        c.removeClass('card-success');
        c.addClass('card-secondary');

        let play = $(this).children("i");
        play.hide();

        // console.log(service);

        $.ajax({
            type: "GET",
            url: "services_run.php",
            data: "name=" + service,
            contentType: "application/text; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                if(data === "true")
                {
                    c.removeClass('card-secondary');
                    c.addClass('card-success');

                    play.show();

                    Toast.fire({
                        icon: 'success',
                        title: 'Esecuzione completata!'
                    });
                }
                else
                {
                    Toast.fire({
                        icon: 'error',
                        title: 'Errore generico, verificare il file di log.'
                    });
                }
            },
            error: function (msg) {
                alert(msg)
            }
        });
    });

    $(".btn-outline-danger").on("click", function (){
        let date = $(this).parent().parent().find("select").val();
        if(date !== null)
        {
            let service = $(this).attr("class");
            service = service.substring(service.indexOf("service-") + "service-".length);
            if(service.indexOf(" ") > 0)
            {
                service = service.substring(0, service.indexOf(" "));
            }

            if(date.length > 0 && service.length > 0)
            {
                window.open('printLog.php?service=' + service + "&date=" + date, service + " - " + getFormattedDate(new Date(date)), 'width=1000,height=600');
            }
        }
    });
});

function getFormattedDate(datetime){
    return datetime.getDate().toString().padStart(2, '0') + "/"
        + (datetime.getMonth() + 1).toString().padStart(2, '0') + "/"
        + datetime.getFullYear();
}