(function() {
    const dayjs = require('dayjs')
    $.fn.dateselector = function(options) {
        const defaults = {
            format: 'YYYY/MM/DD',
            minDate: '1900/01/01',
            maxDate: '2099/12/31',
            okCallback: () => {},
        };
        const settings = $.extend({}, defaults, options);

        const minDateObj = dayjs(settings.minDate, settings.format);
        const maxDateObj = dayjs(settings.maxDate, settings.format);
        
        // const layout = `
        //     <div class="dateselector-tooltip">
        //         <input type="number" class="dateselector-year" placeholder="年" min="${minDateObj.year()}" max="${maxDateObj.year()}">
        //         <span>/</span>
        //         <input type="number" class="dateselector-month" placeholder="月" min="1" max="12">
        //         <span>/</span>
        //         <input type="number" class="dateselector-day" placeholder="日" min="1" max="31"><br>
        //         <p class="error"></p>
        //         <button>OK</button>
        //     </div>
        // `;
        const layout = `
            <div class="dateselector-tooltip">
                <select class="dateselector-year">
                ${(() => {
                    const options = [];
                    for (let i = minDateObj.year(); i <= maxDateObj.year(); i++) {
                        options.push(`<option value="${i}">${i}</option>`)
                    } 
                    return options.join('');
                })()}
                </select>
                <span>/</span>
                <select class="dateselector-month">
                ${(() => {
                    const options = [];
                    for (let i = 1; i <= 12; i++) {
                        options.push(`<option value="${i}">${i}</option>`)
                    }
                    return options.join('');
                })()}
                </select>
                </select>
                <span>/</span>
                <select class="dateselector-day">
                ${(() => {
                    const options = [];
                    for (let i = 1; i <= 31; i++) {
                        options.push(`<option value="${i}">${i}</option>`)
                    }
                    return options.join('');
                })()}
                </select>
                <p class="error"></p>
                <div><button>OK</button></div>
            </div>
        `;

        // テキストボックスにツールチップを作成
        const init = (input) => {
            const tooltip = $(layout);
            $('body').append(tooltip);
            
            const dateselectorYear = $('.dateselector-year', tooltip);
            const dateselectorMonth = $('.dateselector-month', tooltip);
            const dateselectorDay = $('.dateselector-day', tooltip);
            
            // テキストボックスがクリックされた時にツールチップを表示
            input.on('click', function (e) {
                $('p.error', tooltip).hide()
                
                // テキストボックスの初期値を取得してツールチップに反映
                const initialValue = input.val();
                if (initialValue) {
                    const initialDate = dayjs(initialValue, settings.format);
                    dateselectorYear.val(initialDate.year());
                    dateselectorMonth.val(initialDate.month()+1);
                    dateselectorDay.val(initialDate.date());
                }
                
                const offset = input.offset();
                tooltip.css({
                    top: offset.top + input.outerHeight(),
                    left: offset.left
                }).show();
            });
            
            // 年が入力されたら月の上限を変更する
            dateselectorYear.on('change', function () {
                // dateselectorMonth.attr('min', 1).attr('max', 12).prop('disabled', false);
                // dateselectorDay.attr('min', 1).attr('max', 31).prop('disabled', false);
                // if (minDateObj.year() === Number($(this).val())) {
                //     dateselectorMonth.attr('min', minDateObj.month() + 1);
                //     if (Number(dateselectorMonth.val()) < minDateObj.month() + 1) {
                //         dateselectorMonth.val('');
                //         dateselectorDay.val('');
                //     }
                // }
                // if (Number($(this).val()) < minDateObj.year()) {
                //     dateselectorMonth.prop('disabled', true).val('');
                //     dateselectorDay.prop('disabled', true).val('');
                // }
                // if (maxDateObj.year() === Number($(this).val())) {
                //     dateselectorMonth.attr('max', maxDateObj.month() + 1);
                //     if (maxDateObj.month() + 1 < Number(dateselectorMonth.val())) {
                //         dateselectorMonth.val('');
                //         dateselectorDay.val('');
                //     }
                // }
                // if (Number($(this).val()) > maxDateObj.year()) {
                //     dateselectorMonth.prop('disabled', true).val('');
                //     dateselectorDay.prop('disabled', true).val('');
                // }
                dateselectorMonth.prop('disabled', false);
                dateselectorMonth.find('option').removeAttr('hidden');
                dateselectorDay.prop('disabled', false);
                dateselectorDay.find('option').removeAttr('hidden');
                if (minDateObj.year() === Number($(this).val())) {
                    dateselectorMonth.find('option').each(function () {
                        if ($(this).val() < minDateObj.month() + 1) {
                            $(this).attr('hidden', 'hidden');
                        }
                    });
                    if (Number(dateselectorMonth.val()) < minDateObj.month() + 1) {
                        dateselectorMonth.val('');
                        dateselectorDay.val('');
                    }
                }
                if (Number($(this).val()) < minDateObj.year()) {
                    dateselectorMonth.prop('disabled', true).val('');
                    dateselectorDay.prop('disabled', true).val('');
                }
                if (maxDateObj.year() === Number($(this).val())) {
                    dateselectorMonth.find('option').each(function () {
                        if (maxDateObj.month() + 1 < $(this).val()) {
                            $(this).attr('hidden', 'hidden');
                        }
                    });
                    if (maxDateObj.month() + 1 < Number(dateselectorMonth.val())) {
                        dateselectorMonth.val('');
                        dateselectorDay.val('');
                    }
                }
                if (Number($(this).val()) > maxDateObj.year()) {
                    dateselectorMonth.prop('disabled', true).val('');
                    dateselectorDay.prop('disabled', true).val('');
                }

                // 存在しない日付の場合は非表示にする
                checkDateselectorDay();
            });

            // 月が入力されたら日の上限を変更する
            dateselectorMonth.on('change', function () {
                // dateselectorDay.attr('min', 1).attr('max', 31).prop('disabled', false);
                // if (Number(dateselectorYear.val()) <= minDateObj.year()) {
                //     // 年が下限の場合
                //     if (minDateObj.month() + 1 === Number($(this).val())) {
                //         dateselectorDay.attr('min', minDateObj.date());
                //         if (Number(dateselectorDay.val()) < minDateObj.date()) {
                //             dateselectorDay.val('');
                //         }
                //     }
                //     if (Number($(this).val()) < minDateObj.month() + 1) {
                //         dateselectorDay.prop('disabled', true).val('');
                //     }
                // }
                // if (maxDateObj.year() <= Number(dateselectorYear.val())) {
                //     // 年が上限の場合
                //     if (maxDateObj.month() + 1 === Number($(this).val())) {
                //         dateselectorDay.attr('max', maxDateObj.date());
                //         if (maxDateObj.date() < Number(dateselectorDay.val())) {
                //             dateselectorDay.val('');
                //         }
                //     }
                //     if (Number($(this).val()) > maxDateObj.month() + 1) {
                //         dateselectorDay.prop('disabled', true).val('');
                //     }
                // }
                dateselectorDay.prop('disabled', false);
                dateselectorDay.find('option').removeAttr('hidden');
                if (Number(dateselectorYear.val()) <= minDateObj.year()) {
                    // 年が下限の場合
                    if (minDateObj.month() + 1 === Number($(this).val())) {
                        dateselectorDay.find('option').each(function () {
                            if ($(this).val() < minDateObj.date()) {
                                $(this).attr('hidden', 'hidden');
                            }
                        });
                        if (Number(dateselectorDay.val()) < minDateObj.date()) {
                            dateselectorDay.val('');
                        }
                    }
                    if (Number($(this).val()) < minDateObj.month() + 1) {
                        dateselectorDay.prop('disabled', true).val('');
                    }
                }
                if (maxDateObj.year() <= Number(dateselectorYear.val())) {
                    // 年が上限の場合
                    if (maxDateObj.month() + 1 === Number($(this).val())) {
                        dateselectorDay.find('option').each(function () {
                            if (maxDateObj.date() < $(this).val()) {
                                $(this).attr('hidden', 'hidden');
                            }
                        });
                        if (maxDateObj.date() < Number(dateselectorDay.val())) {
                            dateselectorDay.val('');
                        }
                    }
                    if (Number($(this).val()) > maxDateObj.month() + 1) {
                        dateselectorDay.prop('disabled', true).val('');
                    }
                }
                
                // 存在しない日付の場合は非表示にする
                checkDateselectorDay();
            });

            // 存在しない日付の場合は非表示にする
            const checkDateselectorDay = () => {
                dateselectorDay.find('option').each(function () {
                    const year = dateselectorYear.val();
                    const month = ('0' + dateselectorMonth.val()).slice(-2);
                    const day = ('0' + $(this).val()).slice(-2);
                    const inputDate = `${year}-${month}-${day}`;
                    if (!isValidDate(inputDate)) {
                        $(this).attr('hidden', 'hidden');
                        if (dateselectorDay.val() === day) {
                            dateselectorDay.val('')
                        }
                    }
                });
            }
            
            // ボタンがクリックされた時に日付をセットしツールチップを閉じる
            $('button', tooltip).on('click', function () {
                const year = dateselectorYear.val();
                const month = ('0' + dateselectorMonth.val()).slice(-2);
                const day = ('0' + dateselectorDay.val()).slice(-2);

                if (year && month && day) {
                    const inputDate = `${year}-${month}-${day}`;
                    const outputDateObj = dayjs(inputDate);
                    if (!isValidDate(inputDate)) {
                        // 日付として不正な場合は何もしない。
                        showError('正しい日付を入力してください。');
                        return;
                    }
                    if (outputDateObj.isBefore(dayjs(settings.minDate))) {
                        // 下限より過去の日付が入力された場合
                        showError(`${settings.minDate}より未来の日付を入力してください。`);
                        return;
                    }
                    if (outputDateObj.isAfter(dayjs(settings.maxDate))) {
                        // 上限より未来の日付が入力された場合
                        showError(`${settings.maxDate}より過去の日付を入力してください。`);
                        return;
                    }
                    input.val(outputDateObj.format(settings.format));
                    settings.okCallback({result: outputDateObj.format(settings.format)});
                }
                tooltip.hide();
            });
            
            const showError = (message) => {
                $('p.error', tooltip)
                    .empty()
                    .text(message)
                    .show();
            }
 
            const isValidDate = (inputDate ) => {
                const outputDateObj = dayjs(inputDate);
                const outputDate = outputDateObj.format('YYYY-MM-DD')
                const dateParsed = dayjs(outputDate);
                return dateParsed.isValid() && inputDate === outputDate;
            }

            // ページのどこかがクリックされた場合にツールチップを閉じる
            $(document).on('click', function (e) {
                if (!$(e.target).closest(input).length && !$(e.target).closest(tooltip).length) {
                    tooltip.hide();
                }
            });

            // ツールチップ内のクリックはイベントを伝播させない
            tooltip.on('click', function (e) {
                e.stopPropagation();
            });
        }
        
        
        this.each(function () {
            init($(this));
        });
        return this;
    };
})();
