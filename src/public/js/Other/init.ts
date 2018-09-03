function next(
    hiragana: string[],
    katakana: string[],
    inputHira: HTMLInputElement,
    inputKata: HTMLInputElement,
    jpnLabel: HTMLElement,
    lastIndex: number[],
    count: HTMLInputElement
): [string[], number[]] {
    let random: number;
    let randomList: number[] = [];
    let strList: string[] = [];
    let str: string = '';
    let valueList: string[];
    if (Math.round(Math.random()) === 1) {
        valueList = hiragana;
    } else {
        valueList = katakana;
    }
    for (let i = 0; i < parseInt(count.value); i++) {
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

function getAllValues(res: any) {
    const list = [];
    for (let key in res) {
        if (res.hasOwnProperty(key)) {
            list.push(res[key]);
        }
    }
    return list;
}

function compare(input: string, actual: string[]) {
    const list = input.split(' ');
    if (list.length !== actual.length) {
        return false;
    }
    for (let i = 0; i < list.length; i++) {
        if (list[i] !== actual[i]) {
            return false;
        }
    }
    return true;
}

function getSolution(res: any, actualList: string[]): [string[], string] {
    const keyList: string[] = [];
    for (let i = 0; i < actualList.length; i++) {
        for (let key in res.hiragana) {
            if (res.hiragana.hasOwnProperty(key) && res.hiragana[key] === actualList[i]) {
                keyList.push(key);
                break;
            }
        }
    }
    if (keyList.length !== 0) {
        return [keyList, 'hiragana'];
    }
    for (let i = 0; i < actualList.length; i++) {
        for (let key in res.katakana) {
            if (res.katakana.hasOwnProperty(key) && res.katakana[key] === actualList[i]) {
                keyList.push(key);
                break;
            }
        }
    }
    return [keyList, 'katakana'];
}

function init() {
    const button = document.getElementById('button-help');
    const inputHira: any = document.getElementById('input-hiragana');
    const inputKata: any = document.getElementById('input-katakana');
    const inputRoman: any = document.getElementById('input-romanji');
    const count: any = document.getElementById('count-chars');
    const jpnLabel = document.getElementById('japanese-char');
    AjaxRequest.sendAjaxRequest('../api/get.php', null, function (http) {
        AjaxRequest.errFunction(http, 'get');
    }, (http) => {
        const res = JSON.parse(http.response);
        console.log(res);
        if (res.hiragana === null || res.katakana === null) {
            return;
        }
        let [actualList, lastIndexList] = next(getAllValues(res.hiragana), getAllValues(res.katakana), inputHira, inputKata, jpnLabel, [-1], count);
        inputHira.addEventListener('keydown', function (ev: any) {
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
            [actualList, lastIndexList] = next(getAllValues(res.hiragana), getAllValues(res.katakana), inputHira, inputKata, jpnLabel, lastIndexList, count);
        });
        inputKata.addEventListener('keydown', function (ev: any) {
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
            [actualList, lastIndexList] = next(getAllValues(res.hiragana), getAllValues(res.katakana), inputHira, inputKata, jpnLabel, lastIndexList, count);
        });
        inputRoman.addEventListener('keydown', function (ev: any) {
            if (ev.key !== 'Enter') {
                return;
            }
            jpnLabel.innerHTML = res.hiragana[inputRoman.value];
            jpnLabel.innerHTML += res.katakana[inputRoman.value];
            inputRoman.value = '';
        });
        button.addEventListener('click', function () {
            const [solution, style] = getSolution(res, actualList);
            if (style === 'katakana') {
                inputKata.value = solutionToString(solution);
                inputKata.focus();
            } else {
                inputHira.value = solutionToString(solution);
                inputHira.focus();
            }
        });
    });
}

function solutionToString(keyList: string[]) {
    let str = '';
    for (let i = 0; i < keyList.length; i++) {
        str += keyList[i];
        if (i !== keyList.length - 1) {
            str += ' ';
        }
    }
    return str;
}

document.addEventListener('DOMContentLoaded', function () {
    init()
});