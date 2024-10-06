$(document).ready(function() {
    let password = $("#password");
    let repeatPassword = $("#repeatPassword");
    let save = $("#save");

    $("#password,#repeatPassword").on('keyup', function (e) {
        let pwd = password.val().toString();
        let repeat = repeatPassword.val().toString();
        if(checkRule(pwd) && pwd === repeat){
            save.attr('disabled', false);
            if (e.key === 'Enter' || e.keyCode === 13) {
                $("#password").closest("form").submit();
            }
        } else {
            save.attr('disabled', true);
        }
    });

    function checkRule(pwd){
        let ret = true;
        if(pwd.length >= 7){
            $("#ruleSevenChar").addClass("text-success");
        } else {
            $("#ruleSevenChar").removeClass("text-success");
            ret = false;
        }

        if(pwd.toUpperCase() !== pwd){
            $("#ruleLower").addClass("text-success");
        } else {
            $("#ruleLower").removeClass("text-success");
            ret = false;
        }

        if(pwd.toLowerCase() !== pwd){
            $("#ruleUpper").addClass("text-success");
        } else {
            $("#ruleUpper").removeClass("text-success");
            ret = false;
        }

        if(stringContainsNumber(pwd)){
            $("#ruleNumber").addClass("text-success");
        } else {
            $("#ruleNumber").removeClass("text-success");
            ret = false;
        }

        return ret;
    }

    function stringContainsNumber(_input){
        let string1 = String(_input);
        for( let i = 0; i < string1.length; i++){
            if(!isNaN(string1.charAt(i)) && !(string1.charAt(i) === " ") ){
                return true;
            }
        }
        return false;
    }
});