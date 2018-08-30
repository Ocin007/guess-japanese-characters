<?php

const JS_DIR = __DIR__.'/../public/js';
const POLYFILLS = JS_DIR.'/polyfills.js';

/**
 * Transpilieren aller TypeScript-Dateien und Ausgabe der Outputs
 */
$output = [];
echo 'execute: tsc -p '.JS_DIR.' ... '.PHP_EOL;
exec('tsc -p '.JS_DIR, $output);

echo '-----------------------------------------'.PHP_EOL;
echo 'output: '.PHP_EOL;
foreach ($output as $msg) {
    echo $msg.PHP_EOL;
}
echo '-----------------------------------------'.PHP_EOL;
echo PHP_EOL;


/**
 * Liste der Verzeichnisse aus tsconfig.json lesen und in polyfills.js schreiben
 */
$tsconfig = json_decode(file_get_contents(JS_DIR.'/tsconfig.json'), true);
file_put_contents(POLYFILLS, '');
foreach ($tsconfig['include'] as $tsDir) {
    $dir = substr($tsDir, 0, strlen($tsDir) - 2);
    echo 'Scan Namespace '.$dir.' for js files'.PHP_EOL;
    $files = scandir(JS_DIR.'/'.$dir);
    for($i = 2; $i < count($files); $i++) {
        $fileEnding = substr($files[$i], count($files[$i]) - 4, 3);
        if($fileEnding === '.js') {
            echo '      append '.$files[$i].' to polyfills.js'.PHP_EOL;
            $completeFileName = JS_DIR.'/'.$dir.'/'.$files[$i];
            $data = file_get_contents($completeFileName);
            file_put_contents(POLYFILLS, $data.PHP_EOL, FILE_APPEND);
        }
    }
}


echo PHP_EOL.'--- Fertig ---'.PHP_EOL;
