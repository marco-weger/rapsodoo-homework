function getCookie(name)
{
    const nameString = name + "="

    const value = document.cookie.trim().split(";").filter(item => {
        return item.includes(nameString);
    });

    if (value.length) {
        return value[0].trim().substring(nameString.length);
    } else {
        return "";
    }
}
function setCookie(name, value)
{
    document.cookie = name + "=" + value + ";";
}
function removeCookie(name)
{
    document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
}

$(document).ready(function() {
    const username = $("#username");
    const password = $("#password");
    const remember = $("#remember");

    username.val(getCookie("username"));
    password.val(getCookie("password"));

    if(username.val().length > 0 || password.val().length > 0)
    {
        remember.prop('checked', true);
    }

    $("#username,#password").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            tryLogin(username, password, remember);
        }
    });

    $("#login").on("click",function (){
        tryLogin(username, password, remember);
    });

    username.on("keyup",function (){
        $(this).val($(this).val().toUpperCase());
    });
});

function tryLogin(username, password, remember)
{
    if(
        username.val().toString().length > 0 &&
        password.val().toString().length > 0
    )
    {
        // delete cookie if necessary
        if(!remember.is(':checked'))
        {
            setCookie("username","");
            setCookie("password","");
        }

        $.ajax({
            type: "GET",
            url: "login_service.php",
            data: "type=LogIn&" +
                "username="+username.val()+"&"+
                "password="+password.val(),
            contentType: "application/text; charset=utf-8",
            dataType: "text",
            cache: false,
            success: function (data) {
                if(data === 'true')
                {
                    if(remember.is(':checked')){
                        setCookie("username",username.val());
                        setCookie("password",password.val());
                    }
                    window.location.href = "index.php";
                }
                else
                {
                    username.addClass("is-invalid");
                    password.addClass("is-invalid");
                    password.val('');
                }
            },
            error: function (msg) {
                alert("ERROR: " +msg.responseText);
            }
        });
    }
    else
    {
        if(username.val().toString().length === 0)
        {
            username.addClass("is-invalid");
        }
        else
        {
            username.removeClass("is-invalid");
        }

        if(password.val().toString().length === 0)
        {
            password.addClass("is-invalid");
        }
        else
        {
            password.removeClass("is-invalid");
        }
    }
}