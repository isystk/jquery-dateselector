$(function () {
    const dayjs = require('dayjs');

    // 上限値は、現在から20年前に設定
    const maxDate = dayjs().subtract(20, 'years').format('YYYY/MM/DD');
    $('.js-dateselector').dateselector({
        maxDate,
        okCallback: ({result}) => {
            console.log(result);
        },
    });

});
