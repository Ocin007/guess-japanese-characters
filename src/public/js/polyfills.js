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
function next(hiragana, katakana, inputHira, inputKata, jpnLabel, lastIndex, count) {
    var random;
    var randomList = [];
    var strList = [];
    var str = '';
    var valueList;
    if (Math.round(Math.random()) === 1) {
        valueList = hiragana;
    }
    else {
        valueList = katakana;
    }
    for (var i = 0; i < parseInt(count.value); i++) {
        do {
            random = Math.round(Math.random() * (valueList.length - 1));
        } while (random === lastIndex[i]);
        str += valueList[random];
        randomList[i] = random;
        strList[i] = valueList[random];
    }
    jpnLabel.innerHTML = str;
    inputHira.value = '';
    inputKata.value = '';
    inputHira.classList.remove('wrong-answer');
    inputKata.classList.remove('wrong-answer');
    return [strList, randomList];
}
function getAllValues(res) {
    var list = [];
    for (var key in res) {
        if (res.hasOwnProperty(key)) {
            list.push(res[key]);
        }
    }
    return list;
}
function compare(input, actual) {
    var list = input.split(' ');
    if (list.length !== actual.length) {
        return false;
    }
    for (var i = 0; i < list.length; i++) {
        if (list[i] !== actual[i]) {
            return false;
        }
    }
    return true;
}
function getSolution(res, actualList) {
    var keyList = [];
    for (var i = 0; i < actualList.length; i++) {
        for (var key in res.hiragana) {
            if (res.hiragana.hasOwnProperty(key) && res.hiragana[key] === actualList[i]) {
                keyList.push(key);
                break;
            }
        }
    }
    if (keyList.length !== 0) {
        return [keyList, 'hiragana'];
    }
    for (var i = 0; i < actualList.length; i++) {
        for (var key in res.katakana) {
            if (res.katakana.hasOwnProperty(key) && res.katakana[key] === actualList[i]) {
                keyList.push(key);
                break;
            }
        }
    }
    return [keyList, 'katakana'];
}
function init() {
    var button = document.getElementById('button-help');
    var inputHira = document.getElementById('input-hiragana');
    var inputKata = document.getElementById('input-katakana');
    var inputRoman = document.getElementById('input-romanji');
    var count = document.getElementById('count-chars');
    var jpnLabel = document.getElementById('japanese-char');
    AjaxRequest.sendAjaxRequest('../api/get.php', null, function (http) {
        AjaxRequest.errFunction(http, 'get');
    }, function (http) {
        var res = JSON.parse(http.response);
        console.log(res);
        if (res.hiragana === null || res.katakana === null) {
            return;
        }
        var _a = next(getAllValues(res.hiragana), getAllValues(res.katakana), inputHira, inputKata, jpnLabel, [-1], count), actualList = _a[0], lastIndexList = _a[1];
        inputHira.addEventListener('keydown', function (ev) {
            if (ev.keyCode === 39) {
                inputKata.focus();
            }
            if (ev.key !== 'Enter') {
                return;
            }
            if (!compare(inputHira.value, getSolution(res, actualList)[0])) {
                inputHira.classList.add('wrong-answer');
                inputHira.value = '';
                return;
            }
            _a = next(getAllValues(res.hiragana), getAllValues(res.katakana), inputHira, inputKata, jpnLabel, lastIndexList, count), actualList = _a[0], lastIndexList = _a[1];
            var _a;
        });
        inputKata.addEventListener('keydown', function (ev) {
            if (ev.keyCode === 37) {
                inputHira.focus();
            }
            if (ev.key !== 'Enter') {
                return;
            }
            if (!compare(inputKata.value, getSolution(res, actualList)[0])) {
                inputKata.classList.add('wrong-answer');
                inputKata.value = '';
                return;
            }
            _a = next(getAllValues(res.hiragana), getAllValues(res.katakana), inputHira, inputKata, jpnLabel, lastIndexList, count), actualList = _a[0], lastIndexList = _a[1];
            var _a;
        });
        inputRoman.addEventListener('keydown', function (ev) {
            if (ev.key !== 'Enter') {
                return;
            }
            jpnLabel.innerHTML = res.hiragana[inputRoman.value];
            jpnLabel.innerHTML += res.katakana[inputRoman.value];
            inputRoman.value = '';
        });
        button.addEventListener('click', function () {
            var _a = getSolution(res, actualList), solution = _a[0], style = _a[1];
            if (style === 'katakana') {
                inputKata.value = solutionToString(solution);
                inputKata.focus();
            }
            else {
                inputHira.value = solutionToString(solution);
                inputHira.focus();
            }
        });
    });
}
function solutionToString(keyList) {
    var str = '';
    for (var i = 0; i < keyList.length; i++) {
        str += keyList[i];
        if (i !== keyList.length - 1) {
            str += ' ';
        }
    }
    return str;
}
document.addEventListener('DOMContentLoaded', function () {
    init();
});
//# sourceMappingURL=init.js.map
