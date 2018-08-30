var AjaxRequest = /** @class */ (function () {
    function AjaxRequest() {
    }
    AjaxRequest.sendAjaxRequest = function (url, data, onError, onSuccess) {
        var http = new XMLHttpRequest();
        http.open("POST", url);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.addEventListener('load', function () {
            if (http.status >= 200 && http.status < 300) {
                try {
                    onSuccess(http);
                }
                catch (e) {
                    var errWindow = window.open();
                    errWindow.document.write(http.responseText);
                    errWindow.document.write(e);
                }
            }
            else {
                onError(http);
            }
        });
        http.send('data=' + JSON.stringify(data));
    };
    AjaxRequest.errFunction = function (http, title) {
        console.warn('Error: ' + title + ', code: ' + http.status + ' ' + http.statusText);
        console.log(http.responseText);
        try {
            console.log(JSON.parse(http.responseText));
        }
        catch (e) {
            console.log('cannot be parsed');
        }
        var errWindow = window.open();
        errWindow.document.write(http.responseText);
    };
    return AjaxRequest;
}());
//# sourceMappingURL=AjaxRequest.js.map
function next(valueList, inputHira, inputKata, jpnLabel, lastIndex) {
    var random;
    do {
        random = Math.floor(Math.random() * (valueList.length - 1));
    } while (random === lastIndex);
    jpnLabel.innerHTML = valueList[random];
    inputHira.value = '';
    inputKata.value = '';
    inputHira.classList.remove('wrong-answer');
    inputKata.classList.remove('wrong-answer');
    return [valueList[random], random];
}
function getAllValues(res) {
    var list = [];
    for (var style in res) {
        if (res.hasOwnProperty(style)) {
            for (var key in res[style]) {
                if (res[style].hasOwnProperty(key)) {
                    list.push(res[style][key]);
                }
            }
        }
    }
    return list;
}
function getSolution(res, actualChar) {
    for (var key in res.hiragana) {
        if (res.hiragana.hasOwnProperty(key) && res.hiragana[key] === actualChar) {
            return [key, 'hiragana'];
        }
    }
    for (var key in res.katakana) {
        if (res.katakana.hasOwnProperty(key) && res.katakana[key] === actualChar) {
            return [key, 'katakana'];
        }
    }
}
function init() {
    var button = document.getElementById('button-help');
    var inputHira = document.getElementById('input-hiragana');
    var inputKata = document.getElementById('input-katakana');
    var jpnLabel = document.getElementById('japanese-char');
    AjaxRequest.sendAjaxRequest('../api/get.php', null, function (http) {
        AjaxRequest.errFunction(http, 'get');
    }, function (http) {
        var res = JSON.parse(http.response);
        var valueList = getAllValues(res);
        var _a = next(valueList, inputHira, inputKata, jpnLabel, -1), actualChar = _a[0], lastIndex = _a[1];
        inputHira.addEventListener('keydown', function (ev) {
            if (ev.keyCode === 39) {
                inputKata.focus();
            }
            if (ev.key !== 'Enter') {
                return;
            }
            if (res.hiragana[inputHira.value] !== actualChar) {
                inputHira.classList.add('wrong-answer');
                inputHira.value = '';
                return;
            }
            _a = next(valueList, inputHira, inputKata, jpnLabel, lastIndex), actualChar = _a[0], lastIndex = _a[1];
            var _a;
        });
        inputKata.addEventListener('keydown', function (ev) {
            if (ev.keyCode === 37) {
                inputHira.focus();
            }
            if (ev.key !== 'Enter') {
                return;
            }
            if (res.katakana[inputKata.value] !== actualChar) {
                inputKata.classList.add('wrong-answer');
                inputKata.value = '';
                return;
            }
            _a = next(valueList, inputHira, inputKata, jpnLabel, lastIndex), actualChar = _a[0], lastIndex = _a[1];
            var _a;
        });
        button.addEventListener('click', function () {
            var _a = getSolution(res, actualChar), solution = _a[0], style = _a[1];
            if (style === 'katakana') {
                inputKata.value = solution;
                inputKata.focus();
            }
            else {
                inputHira.value = solution;
                inputHira.focus();
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    init();
});
//# sourceMappingURL=init.js.map
