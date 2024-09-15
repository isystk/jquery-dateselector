(function() {
    const dayjs = require('dayjs')
    $.fn.dateselector = function(options) {
        const defaults = {
            format: 'YYYY/MM/DD',
            minDate: '1970/01/01',
            maxDate: '2099/12/31',
            okCallback: () => {},
        };
        const settings = $.extend({}, defaults, options);

        const minDateObj = dayjs(settings.minDate, settings.format);
        const maxDateObj = dayjs(settings.maxDate, settings.format);
        
        const layout = `
            <div class="dateselector-tooltip">
                <input type="number" class="dateselector-year" placeholder="年" min="${minDateObj.year()}" max="${maxDateObj.year()}">
                <span>/</span>
                <input type="number" class="dateselector-month" placeholder="月" min="1" max="12">
                <span>/</span>
                <input type="number" class="dateselector-day" placeholder="日" min="1" max="31"><br>
                <p class="error"></p>
                <button>OK</button>
            </div>
        `;

        // テキストボックスにツールチップを作成
        const init = (input) => {
            const tooltip = $(layout);
            $('body').append(tooltip);
            
            // テキストボックスの初期値を取得してツールチップに反映
            const initialValue = input.val();
            if (initialValue) {
                const initialDate = dayjs(initialValue, settings.format);
                $('.dateselector-year', tooltip).val(initialDate.year());
                $('.dateselector-month', tooltip).val(initialDate.month()+1);
                $('.dateselector-day', tooltip).val(initialDate.date());
            }
            
            // テキストボックスがクリックされた時にツールチップを表示
            input.on('click', function (e) {
                $('p.error', tooltip).hide()
                const offset = input.offset();
                tooltip.css({
                    top: offset.top + input.outerHeight(),
                    left: offset.left
                }).show();
            });
            
            // 年が入力されたら月の上限を変更する
            $('.dateselector-year', tooltip).on('change', function () {
                $('.dateselector-month', tooltip).attr('min', 1).prop('disabled', false);
                $('.dateselector-month', tooltip).attr('max', 12).prop('disabled', false);
                if (minDateObj.year() === Number($(this).val())) {
                    $('.dateselector-month', tooltip).attr('min', minDateObj.month() + 1);
                    if (Number($('.dateselector-month', tooltip).val()) < minDateObj.month() + 1) {
                        $('.dateselector-month, .dateselector-day', tooltip).val('');
                    }
                }
                if (Number($(this).val()) < minDateObj.year()) {
                    $('.dateselector-month, .dateselector-day', tooltip).prop('disabled', true).val('');
                }
                if (maxDateObj.year() === Number($(this).val())) {
                    $('.dateselector-month', tooltip).attr('max', maxDateObj.month() + 1);
                    if (maxDateObj.month() + 1 < Number($('.dateselector-month', tooltip).val())) {
                        $('.dateselector-month, .dateselector-day', tooltip).val('');
                    }
                }
                if (Number($(this).val()) > maxDateObj.year()) {
                    $('.dateselector-month, .dateselector-day', tooltip).prop('disabled', true).val('');
                }
            });

            // 月が入力されたら日の上限を変更する
            $('.dateselector-month', tooltip).on('change', function () {
                $('.dateselector-day', tooltip).attr('min', 1).prop('disabled', false);
                $('.dateselector-day', tooltip).attr('max', 31).prop('disabled', false);
                if (minDateObj.month() + 1 === Number($(this).val())) {
                    $('.dateselector-day', tooltip).attr('min', minDateObj.date());
                    if (Number($('.dateselector-day', tooltip).val()) < minDateObj.date()) {
                        $('.dateselector-day', tooltip).val('');
                    }
                }
                if (Number($(this).val()) < minDateObj.month() + 1) {
                    $('.dateselector-day', tooltip).prop('disabled', true).val('');
                }
                if (maxDateObj.month() + 1 === Number($(this).val())) {
                    $('.dateselector-day', tooltip).attr('max', maxDateObj.date());
                    if (maxDateObj.date() < Number($('.dateselector-day', tooltip).val())) {
                        $('.dateselector-day', tooltip).val('');
                    }
                }
                if (Number($(this).val()) > maxDateObj.month() + 1) {
                    $('.dateselector-day', tooltip).prop('disabled', true).val('');
                }
            });
            
            // ボタンがクリックされた時に日付をセットしツールチップを閉じる
            $('button', tooltip).on('click', function () {
                const year = $('.dateselector-year', tooltip).val();
                const month = ('0' + $('.dateselector-month', tooltip).val()).slice(-2);
                const day = ('0' + $('.dateselector-day', tooltip).val()).slice(-2);

                if (year && month && day) {
                    const inputDate = `${year}-${month}-${day}`;
                    const outputDateObj = dayjs(inputDate);
                    const outputDate = outputDateObj.format('YYYY-MM-DD')
                    if (!isValidDate(inputDate, outputDate)) {
                        // 日付として不正な場合は何もしない。
                        $('p.error', tooltip)
                            .empty()
                            .text('正しい日付を入力してください。')
                            .show();
                        return;
                    }
                    if (outputDateObj.isBefore(dayjs(settings.minDate))) {
                        // 下限より過去の日付が入力された場合
                        $('p.error', tooltip)
                            .empty()
                            .text(`${settings.minDate}より未来の日付を入力してください。`)
                            .show();
                        return;
                    }
                    if (outputDateObj.isAfter(dayjs(settings.maxDate))) {
                        // 上限より未来の日付が入力された場合
                        $('p.error', tooltip)
                            .empty()
                            .text(`${settings.maxDate}より過去の日付を入力してください。`)
                            .show();
                        return;
                    }
                    input.val(outputDateObj.format(settings.format));
                    settings.okCallback({result: outputDateObj.format(settings.format)});
                }
                tooltip.hide();
            });
 
            const isValidDate = (inputDate, outputDate) => {
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
