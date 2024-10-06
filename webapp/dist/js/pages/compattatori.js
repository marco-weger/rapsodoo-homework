$(document).ready(function(){
    jQuery.support.cors = true;

    $("select").on('change', function (){
        let machine = $(this).attr('incMachine');
        let last = $(this).attr('current');
        let material = $('option:selected', this).attr('coefficient');
        let h2 = $(this).parent().parent().parent().find(".card-footer").find('h2');
        let current = h2.attr('current');
        let max = h2.attr('max');
        let inc = Math.ceil(material * machine*2)/2;

        current -= last;
        current += inc;
        h2.attr('current', current);
        $(this).attr('current', inc);
        if(parseFloat(current) > parseFloat(max))
        {
            current = parseFloat(max);
        }
        h2.html("Temperatura: <b>" + current.toFixed(0) + "</b> °C");
    });
});

var curFan;
function save(fan, btn)
{
    curFan = fan;
    let temp = $(btn).parent().parent().children().children().attr('current');

    $("input[name=fan]").val(fan);
    $("input[name=temperature]").val(temp);

    temp = parseFloat(temp).toFixed(0);

    $("#lblTemp").empty().append(temp);
    $("#lblComp").empty().append('Compattatore ' + fan.toString());

    $("#modal-save").modal('show');
}

function confirmSave()
{
    $.each($('.fan' + curFan.toString()).find('.row'), function (idx, elem) {
        let cutter = $(elem).find('label').html();
        let material = $(elem).find('select').find(':selected').html();
        let toAdd = `<input type="hidden" name="${cutter}" value="${material}">`;

        $("input[name=temperature]").parent().append(toAdd);
    });
    $("input[name=temperature]").parent().submit();
}