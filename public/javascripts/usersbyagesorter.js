$('.age-form').submit( function (e) {
    e.preventDefault();
    var ageForm = $('.age-form')
    var selectStart = ageForm.elements['start'];
    var selectEnd = ageForm.elements['end'];
    var selectedIndexStart = selectStart.selectedIndex;
    var selectedIndexEnd = selectEnd.selectedIndex;
    if (selectedIndexStart > 0) {
        var start = selectStart.options[selectedIndexStart].value
    }
    if (selectedIndexEnd > 0) {
        var end = selectEnd.options[selectedIndexEnd].value
    }
    $.ajax({
        method: 'GET',
        url: '',
        data: {start: start, end: end},
        success: function (data) {
            console.log(data);
        } 
    })
})