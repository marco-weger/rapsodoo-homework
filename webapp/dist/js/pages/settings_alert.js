$(document).ready(function(){
    jQuery.support.cors = true;

    //Initialize Select2 Elements
    $('.select2').select2();

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4'
    });

    $("select[name=campo]").on('change', function (){
        let type = $("option:selected", this).attr('class');

        $(this).parent().parent().parent().find("select[name=controllo]").empty();
        showInputValue(
            type,
            $(this).parent().parent().parent().find("input[name=valoreNumber]"),
            $(this).parent().parent().parent().find("input[name=valoreText]"),
            $(this).parent().parent().parent().find("select[name=controllo]"),
            ''
        );
    });

    $(".delete").on('click', function (){
        let deleteId = searchId($(this), 'delete');
        console.log(deleteId);
        $("#deleteId").val(deleteId);

        let modal = $("#modal_remove");
        modal.children('.modal-dialog')
            .children('.modal-content')
            .children('.modal-body')
            .html(
                '<p>Sei sicuro di voler eliminare la riga? La modifica non sarà reversibile!</p>'
            );

        modal.modal('show');
    });

    $(".edit").on('click', function (){
        let modal = $("#modal_edit");
        let editId = searchId($(this), 'edit');

        let row = $(this).parents('tr').children('td');
        let value = row[2].outerHTML;
        value = value.substring(4, value.length - 5);

        let fullClass = $(this).attr('class');
        let editType = null;
        fullClass = fullClass.split(' ');
        $.each(fullClass, function (subIdx, subElem){
            if(subElem.includes('editType-')){
                editType = subElem.substring(9);
            }
        });

        //showInputValue('_e', editType, value);

        showInputValue(
            editType,
            modal.find("input[name=valoreNumber]"),
            modal.find("input[name=valoreText]"),
            null, //modal.find("select[name=controllo]"),
            value
        );

        $("#editId").val(editId);
        modal.modal('show');
    });

    function showInputValue(type, valoreNumber, valoreText, checks, value){
        let collection = {};
        let inputField;
        let otherField;

        console.log(type);
        if(type.toString() === 'number'){
            collection['equals'] = 'Uguale';
            collection['notEquals'] = 'Diverso';
            collection['more'] = 'Maggiore';
            collection['less'] = 'Minore';
            collection['moreOrEquals'] = 'Maggiore o uguale';
            collection['lessOrEquals'] = 'Minore o uguale';

            inputField = valoreNumber;
            otherField = valoreText;

        } else {
            collection['equals'] = 'Uguale';
            collection['notEquals'] = 'Diverso';

            inputField = valoreText;
            otherField = valoreNumber;
        }

        inputField.val(value);
        inputField.attr('required', true);
        inputField.show();
        otherField.hide();
        otherField.attr('required', false);
        otherField.val(null);

        if(checks !== null)
        {
            $.each(collection, function (i, item){
                checks.append($('<option>', {
                    value: i,
                    text: item,
                }));
            });
        }
    }

    function searchId(obj, type){
        let ret = null;
        let elem = obj.attr('class');
        elem = elem.split(' ');
        $.each(elem, function (subIdx, subElem) {
            if(subElem.substring(0,1 + type.length) === (type+"-")){
                elem = subElem.substring(1 + type.length);
                try{
                    ret = parseInt(elem);
                } catch (e) {}
                return false;
            }
        });
        return ret;
    }
});