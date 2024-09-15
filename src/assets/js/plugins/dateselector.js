(function() {
    const dayjs = require('dayjs')
    $.fn.dateselector = function(options) {
        const defaults = {
            format: 'YYYY/MM/DD'
        };
        const settings = $.extend({}, defaults, options);
        
        const layout = `
            <div class="dateselector-tooltip">
                <input type="number" class="dateselector-year" placeholder="年" min="1900" max="2100">
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
                    input.val(outputDateObj.format(settings.format));
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
