$('.age-form').submit( function (e) {
    e.preventDefault();
    var ageForm = $('.age-form')
    var selectStart = ageForm[0]['start'];
    var selectEnd = ageForm[0]['end'];
    var selectedIndexStart = selectStart.selectedIndex;
    var selectedIndexEnd = selectEnd.selectedIndex;
    if ((selectedIndexStart > 0) && (selectedIndexEnd > 0)) {
        var start = selectStart.options[selectedIndexStart].value;
        var end = selectEnd.options[selectedIndexEnd].value;
        $.ajax({
            method: 'GET',
            url: '/users/search/age',
            data: {start: start, end: end},
            success: function (data) {
                $('#users-table-rows').html(data);
            } 
        })
    }
   
})

function debounce(f, ms) {
    let timer = null;
    console.log('this in deb', this);
    return function () {
        console.log('debounce this',this);
        const onComplete = () => {
            f();
            timer = null;
        }

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(onComplete, ms);
    };
}

var debouncedFoo = debounce(function() {
    console.log('debounce body');
    $('.name-form').submit()
}, 200);

$('#name-input')[0].oninput = function () {
   
    console.log('input this', this);
    var self = this;
    // debounce(2000,$('.name-form').submit);
    debouncedFoo()
    //$('.name-form').submit();
    //debounce(1000,$('.name-form')[0].submit)();
}

$('.name-form').submit( function(e) {
    e.preventDefault();
    var nameForm = $('.name-form');
    var searchkey = nameForm[0]['q'].value;
    $.ajax({
        method: 'GET',
        url: '/users/search',
        data: {q: searchkey},
        success: function (data) {
            $('#users-table-rows').html(data);
        } 
    })
})