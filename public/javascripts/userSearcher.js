$('.age-form').submit(function (e) {
    e.preventDefault();
    var ageForm = $('.age-form')
    var selectStart = ageForm[0]['start'];
    var selectEnd = ageForm[0]['end'];
    var selectedIndexStart = selectStart.selectedIndex;
    var selectedIndexEnd = selectEnd.selectedIndex;
    var start;
    var end;
    if (selectedIndexStart === 0) {
        start = 0;
    }
    else {
        start = selectStart.options[selectedIndexStart].value;
    }
    if (selectedIndexEnd === 0) {
        end = 150;
    }
    else {
        end = selectEnd.options[selectedIndexEnd].value;
    }
    console.log(start,end);
        $.ajax({
            method: 'GET',
            url: '/users/search/',
            data: { start: start, end: end },
            success: function (data) {
                $('#users-table-rows').html(data);
            }
        })
})

function debounce(func, delay) {
    let timer = null;
    return function () {
        const onComplete = () => {
            func();
            timer = null;
        }
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(onComplete, delay);
    };
}

var debouncedFunc = debounce(function () {
    $('.name-form').submit()
}, 1000);


// todo: change to jquery event | done
$('#name-input').on('input', function () {
    debouncedFunc();
}) 

$('.name-form').submit(function (e) {
    e.preventDefault();
    var nameForm = $('.name-form');
    var searchkey = nameForm[0]['q'].value;
    $.ajax({
        method: 'GET',
        url: '/users/search',
        data: { q: searchkey },
        success: function (data) {
            $('#users-table-rows').html(data);
        }
    })
})