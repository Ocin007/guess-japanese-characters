function next(
    valueList: string[],
    inputHira: HTMLInputElement,
    inputKata: HTMLInputElement,
    jpnLabel: HTMLElement,
    lastIndex: number
): [string, number] {
    let random: number;
    do {
        random = Math.floor(Math.random() * (valueList.length-1));
    } while (random === lastIndex);
    jpnLabel.innerHTML = valueList[random];
    inputHira.value = '';
    inputKata.value = '';
    inputHira.classList.remove('wrong-answer');
    inputKata.classList.remove('wrong-answer');
    return [valueList[random], random];
}

function getAllValues(res: any) {
    const list = [];
    for(let style in res) {
        if(res.hasOwnProperty(style)) {
            for(let key in res[style]) {
                if(res[style].hasOwnProperty(key)) {
                    list.push(res[style][key]);
                }
            }
        }
    }
    return list;
}

function getSolution(res: any, actualChar: string) {
    for(let key in res.hiragana) {
        if(res.hiragana.hasOwnProperty(key) && res.hiragana[key] === actualChar) {
            return [key, 'hiragana'];
        }
    }
    for(let key in res.katakana) {
        if(res.katakana.hasOwnProperty(key) && res.katakana[key] === actualChar) {
            return [key, 'katakana'];
        }
    }
}

function init() {
    const button = document.getElementById('button-help');
    const inputHira: any = document.getElementById('input-hiragana');
    const inputKata: any = document.getElementById('input-katakana');
    const jpnLabel = document.getElementById('japanese-char');
    AjaxRequest.sendAjaxRequest('../api/get.php', null, function (http) {
        AjaxRequest.errFunction(http, 'get');
    }, (http) => {
        const res = JSON.parse(http.response);
        const valueList = getAllValues(res);
        let [actualChar, lastIndex] = next(valueList, inputHira, inputKata, jpnLabel, -1);
        inputHira.addEventListener('keydown', function (ev: any) {
            if(ev.keyCode === 39) {
                inputKata.focus();
            }
            if(ev.key !== 'Enter') {
                return;
            }
            if(res.hiragana[inputHira.value] !== actualChar) {
                inputHira.classList.add('wrong-answer');
                inputHira.value = '';
                return;
            }
            [actualChar, lastIndex] = next(valueList, inputHira, inputKata, jpnLabel, lastIndex);
        });
        inputKata.addEventListener('keydown', function (ev: any) {
            if(ev.keyCode === 37) {
                inputHira.focus();
            }
            if(ev.key !== 'Enter') {
                return;
            }
            if(res.katakana[inputKata.value] !== actualChar) {
                inputKata.classList.add('wrong-answer');
                inputKata.value = '';
                return;
            }
            [actualChar, lastIndex] = next(valueList, inputHira, inputKata, jpnLabel, lastIndex);
        });
        button.addEventListener('click', function () {
            const [solution, style] = getSolution(res, actualChar);
            if(style === 'katakana') {
                inputKata.value = solution;
                inputKata.focus();
            } else {
                inputHira.value = solution;
                inputHira.focus();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    init()
});