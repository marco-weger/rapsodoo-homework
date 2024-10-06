$(function () {
    jQuery.support.cors = true;

    if($('#modal-msg').find('.modal-body').html().length > 0){
        $('#modal-msg').modal('show');
        let myUrl = window.location.href;
        myUrl = myUrl.substring(0, myUrl.indexOf('?'));
        window.history.pushState({}, document.title, myUrl);
    };

    //Initialize Select2 Elements
    $('.select2').select2()

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    })
});

$(document).ready(function(){
    let users = $("#USERS");
    let users_user = $("#USERS_username");

    let users_currentUser = users_user.val();
    if(users_currentUser !== null){
        users.children('.card-body').show();
        //users.children('.card-footer').hide();
    }

    $("#USERS_tipo,input[name=tag]").on('change keyup', function (){
        $("#USERS_save").attr('disabled', false);
    });

    $("#USERS_reset").on('click', function (){
        let modal = $("#USERS_modal_reset")
        modal
            .children('.modal-dialog')
            .children('.modal-content')
            .children('.modal-body')
            .children('p')
            .html('Se sicuro di voler creare una nuova password per l\'utente <span class="text-bold font-italic">' + users_currentUser + '</span>?');
        modal.modal('show');
    });

    $("#USERS_delete").on('click', function (){
        let modal = $("#USERS_modal_delete")
        modal
            .children('.modal-dialog')
            .children('.modal-content')
            .children('.modal-body')
            .children('p')
            .html('Se sicuro di voler eliminare l\'utente <span class="text-bold font-italic">' + users_currentUser + '</span>?');
        modal.modal('show');
    });

    $("#USERS_new").on('click', function (){
        $("#USERS_modal_new").modal('show');
    });

    let lastIsSymbol = false;
    $("#USERS_newUsername").on('keydown',function (e){
        let char = e.key.toString();
        if(!(isLetter(char) ||
            ([".","_"].includes(char) && !lastIsSymbol) ||
            isNumber(char) ||
            isDelete(e.keyCode, e.key) ||
            isArrow(e.keyCode, e.key)
        ))
        {
            e.preventDefault();
        }
        else
        {
            lastIsSymbol = [".","_"].includes(char);
            $("#USERS_newUsername").removeClass("is-invalid");
        }
    });

    function isArrow(keyCode, key) {
        return (keyCode === 37 && key.toString() === "ArrowLeft") || (keyCode === 39 && key.toString() === "ArrowRight");
    }

    function isDelete(keyCode, key) {
        return (keyCode === 8 && key.toString() === "Backspace") || (keyCode === 46 && key.toString() === "Delete");
    }

    function isLetter(str) {
        return str.length === 1 && str.match(/[a-z]/i);
    }

    function isNumber(str) {
        return str.length === 1 && str >= '0' && str <= '9';
    }

    $("#USERS_saveNew").on('click', function (){
        $.ajax({
            type: "GET",
            url: "login_service.php",
            data: "type=isUserNameFree&" +
                "username="+$("#USERS_newUsername").val(),
            contentType: "application/text; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                if(data === 'true')
                {
                    $("#USERS_newUsername").closest("form").submit();
                }
                else
                {
                    $("#USERS_newUsername").addClass("is-invalid");
                }
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
            }
        });
    });

    let url = new URL(window.location.href);
    let tmpPwd = url.searchParams.get("tmpPwd");
    if(tmpPwd !== null){
        $("#USERS_modal_endReset").modal({backdrop: 'static', keyboard: false})
    }

    let newPwd = url.searchParams.get("newPwd");
    if(newPwd !== null){
        $("#USERS_modal_endNew").modal({backdrop: 'static', keyboard: false});
    }

    $("#USERS_newUsername").on("keyup",function (){
        $(this).val($(this).val().toUpperCase());
    });
});