$('.search-form').submit(function (e) {
    e.preventDefault();
    var searchForm = $('.search-form')
    var selectStart = searchForm[0]['start'];
    var selectEnd = searchForm[0]['end'];
    var nameKey = searchForm[0]['q'].value;
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
    $.ajax({
        method: 'GET',
        url: '/users/search/',
        data: { start: start, end: end, q: nameKey },
        success: function (data) {
            $('#pagination-area').html(data);
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

var debouncedInput = debounce(function () {
    $('.search-form').submit()
}, 1000);


// todo: change to jquery event | done
$('#name-input').on('input', function () {
    debouncedInput();
})

$('.search-select').on('change', function () {
    debouncedInput();
})

$('body').on('click', '.page-btn', function() {
    var searchForm = $('.search-form')
    var selectStart = searchForm[0]['start'];
    var selectEnd = searchForm[0]['end'];
    var nameKey = searchForm[0]['q'].value;
    var selectedIndexStart = selectStart.selectedIndex;
    var selectedIndexEnd = selectEnd.selectedIndex;
    var start;
    var end;
    var currentPage = $('.page-current')[0].textContent;
    var page = event.target.textContent
    if (page === '>') {
        page = Number(currentPage) + 1
    }
    if (page === '<') {
        page = Number(currentPage) - 1
    }
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
    $.ajax({
        method: 'GET',
        url: '/users/search/',
        data: {
            start: start,
            end: end,
            q: nameKey,
            page: page
        },
        success: function (data) {
            $('#pagination-area').html(data);
        }
    })
})
