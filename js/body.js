//const apiUrl = "http://192.168.0.105:8080";
const apiUrl = "https://rw79kz.deta.dev";
var locations;

var lastDate = new Date();
lastDate.setMonth(lastDate.getMonth() + 1);

let defProps = {
    step: {
        months: 1
    },
    bounds: {
        min: new Date(2017, 7, 1),
        max: lastDate
    },
    defaultValues: {
        min: new Date(2017, 7, 1),
        max: lastDate
    }
};

$.get({
    url: apiUrl + '/api/locations/get',
    success: (res) => {
        var i = 0;
        locations = res;
        var i = 0;
        res.forEach(e => {
            $('.locations').append(`<li><input type="checkbox" id="loc${i}" class="place" disabled><label class="label-place disabled-text" for="loc${i++}">${e}</label></li>`);
        });
        $('.location-msg').hide().html("");
        $('#filter-go').click();
    },
    error: () => {
        $('.location-msg').html("Failed fetching location.");
    }
});

var myChart;

$().ready(() => {
    initChart();
    $('.chart-canvas').hide();
    $('.expand-area').click(() => {
        $('.expand-area').addClass('glow').delay(250).queue((next) => {
            $('.expand-area').removeClass('glow');
            next();
        })
        $('.expand-area').toggleClass('expanded');
        $('.filter-body').slideToggle().css('display', 'grid');
    });
    $('#unit').click(() => {
        $('#get').html($('#unit').val() + ':');
    });
    $('.add-button').click(() => {
        $('.modal-window').addClass('show-up');
        $('#form-location').prop('disabled', true);
        $.get({
            url: apiUrl + '/api/locations/get',
            success: (res) => {
                var i = 0;
                locations = res;
                res.forEach(e => {
                    $('#form-location').append($('<option></option>')
                        .attr('value', i++)
                        .text(e));
                });
                $('#form-location > *:nth-child(1)').prop('selected', true);
                $('#form-location').prop('disabled', false);
            },
            error: () => {
                $('#form-errors').html('Getting locations failed.');
                $('#form-errors').show();
            }
        });
    });
    $('.modal-close').click(() => {
        $('.modal-window').removeClass('show-up');
    });
    $('#filter-reset').click(() => {
        $('#slider').dateRangeSlider("values",
            defProps.defaultValues.min, defProps.defaultValues.max);
        $('#all').prop('checked', true);
        $('.place').prop('disabled', true);
        $('.label-place').css('color', '#777');
    });
    $('#filter-go').click(() => {
        $('.canvas-placeholder').show();
        $('.chart-canvas').hide();
        var from, to, lcs = [];
        var slider = $('#slider').dateRangeSlider("values");
        from = slider.min;
        to = slider.max;
        //to.setMonth(to.getMonth() + 1);

        formatFrom = `${from.getMonth() < 9 ? "0" + (from.getMonth()+1) : from.getMonth()+1}${from.getFullYear()}`;
        formatTo = `${to.getMonth() < 9 ? "0" + (to.getMonth()+1) : (to.getMonth()+1)}${to.getFullYear()}`;

        if ($('#all').is(':checked')) lcs = locations;
        else {
            lcs = [];
            for (var i = 0; i < locations.length; i++) {
                if ($(`#loc${i}`).is(':checked')) lcs.push(locations[i]);
            }
            // if ($('#atm').is(':checked')) lcs.push('ATM');
            // if ($('#dreamland').is(':checked')) lcs.push('Dreamland');
            // if ($('#ganika').is(':checked')) lcs.push('Ganika');
            // if ($('#grace').is(':checked')) lcs.push('Grace');
            // if ($('#honest').is(':checked')) lcs.push('Honest');
            // if ($('#jacobz').is(':checked')) lcs.push('Jacobz');
            // if ($('#sabus').is(':checked')) lcs.push('Sabu\'s');
            // if ($('#sports').is(':checked')) lcs.push('Sports');
            // if ($('#terrys').is(':checked')) lcs.push('Terry\'s');
            // if ($('#xerox').is(':checked')) lcs.push('Xerox');
        }
        //console.log(`${locations.toString()} ${formatFrom} ${formatTo}`);
        $.post({
            //url: apiUrl + '/api/data/get',
            url: apiUrl + `/api/data/get?TimeFrom=${formatFrom}&TimeTo=${formatTo}&Locations=${lcs.toString()}`,
            // jQuery doesn't play well even with Strings, strange.
            // data: {
            //     TimeFrom: `${formatFrom}`,
            //     TimeTo: `${formatTo}`,
            //     Locations: `${locations.toString()}`
            // },
            success: (response) => {
                updateChart(response, locations, from, to);
            }
        })
    });
    $("#slider").dateRangeSlider(defProps);
    $('#all').prop('checked', true);
    $('.place').prop('disabled', true);
    $('.label-place').css('color', '#777');
    $('#all').click(function() {
        $('.place').prop('disabled', $(this).is(':checked'));
        $(this).is(':checked') ?
            $('.label-place').css('color', '#777') : $('.label-place').css('color', "#000");
    });
    $('#form-go').click(() => {
        $('#form-errors').hide().removeClass('form-fine').html();
        var date, unit, location, password;
        var isD = false,
            isU = false,
            isL = false,
            isP = false;

        if ($('#form-password').val().length == 0) {
            $('#form-errors').show().html('No Password provided.');
        } else isP = true;

        if ($('#form-consumed').val() <= 0) {
            $('#form-errors').show().html('Units cannot be 0 or less');
        } else {
            unit = parseInt($('#form-consumed').val());
            if (isNaN(unit)) $('#form-errors').show().html('Units should be number.');
            else isU = true;
        }

        if ($('#form-date').val() == '') {
            $('#form-errors').show().html('Invalid Date.');
        } else {
            date = new Date($('#form-date').val());
            isD = true;
        }

        if (isD && isU && isP) {
            //console.log('Going to Post!');
            $('#form-errors').show().addClass('form-fine').html("Please wait");
            $.post({
                url: apiUrl + '/api/data/set?' + $.param({
                    Password: $('#form-password').val(),
                    Date: date.toISOString(),
                    Location: locations[parseInt($('#form-location').val())],
                    UnitsConsumed: unit
                }),
                success: () => {
                    $('#form-errors').show().addClass('form-fine').html("Success!");
                    setTimeout(() => {
                        $('.modal-close').click();
                    }, 1000);
                    $('#filter-go').click();
                },
                error: () => {
                    $('#form-errors').show().removeClass('form-fine').html("Incorrect Password.");
                }
            })
        }
    });
});

var updateChart = (resp, locations, from, to) => {
    var dse = [];
    var labels = [];

    for (var d = from; d < to; d.setMonth(d.getMonth() + 1)) {
        var s = '';
        s += d.toLocaleString('default', { month: 'short' });
        s += ` ${d.getFullYear()}`;
        labels.push(s);
    }
    var bg = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(174, 213, 129, 0.2)',
        'rgba(67, 160, 71, 0.2)',
        'rgba(121, 134, 203, 0.2)',
        'rgba(173, 20, 87, 0.2)',
        'rgba(239, 83, 80, 0.2)',
        'rgba(255, 171, 145, 0.2)'
    ];

    var bo = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(174, 213, 129, 1)',
        'rgba(67, 160, 71, 1)',
        'rgba(121, 134, 203, 1)',
        'rgba(173, 20, 87, 1)',
        'rgba(239, 83, 80, 1)',
        'rgba(255, 171, 145, 1)'
    ];

    for (var i = 0; i < locations.length; i++) {
        var temp = {
            label: locations[i],
            data: [],
            backgroundColor: bg[i],
            borderColor: bo[i]
        };
        for (var j = 0; j < resp.length; j++) {
            if (resp[j].Location == locations[i]) {
                var s = '';
                var d = new Date(resp[j].Date);
                s += d.toLocaleString('default', { month: 'short' });
                s += ` ${d.getFullYear()}`;
                temp.data.push({ x: s, y: resp[j].UnitsConsumed });
            }
        }
        dse.push(temp);
    }
    //console.log(dse);
    canvasSet(labels, dse);
}

var initChart = () => {
    var ctx = document.getElementsByClassName('chart-canvas')[0].getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: '',
            datasets: []
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

var canvasSet = (l, d) => {
    myChart.data.labels = l;
    myChart.data.datasets = d;
    myChart.update();
    $('.canvas-placeholder').hide();
    $('.chart-canvas').show();
}
