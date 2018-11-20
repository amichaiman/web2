function textChanged(){
    $("#presenter").html($("#editor").val())
}

$(document).ready( function(){
    textChanged();
});