$( document ).ready( function () {
    


$('body').on('focus', '[contenteditable]', function() {
    var $this = $(this);
    $this.data('before', $this.text().trim());
}).on('blur', '[contenteditable]', function() {
    var $this = $(this);
    var textBefore = $this.data('before');
    var textAfter = $this.text().trim();
    if (textBefore === textAfter) { return }
    $this.data('before', textAfter);
    var target = event.target.id;
    $.ajax({
        method: 'PUT',
        url: `/users/userpage/${$('.data-table').data('userid')}`,
        data: {key: target, data: textAfter},
        headers: {Authorization: Cookies.get('token')}, 
    }) 
    
});

$('#role-select').on('change', function () {
    $.ajax({
        method: 'PUT',
        url: `/users/userpage/${$('.data-table').data('userid')}`,
        data: {roleId: event.target.value},
        headers: {Authorization: Cookies.get('token')},
        success: function (data) {
            $('#role-tab').text(data.name)
        },
        error: function (err) {
            console.log(err);
        }
    });
})

})