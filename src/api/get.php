<?php
$jpnCharsHiraFile = __DIR__ . '/../../data/input/jpn-chars-hiragana.json';
$jpnCharsKataFile = __DIR__ . '/../../data/input/jpn-chars-katakana.json';
$hiragana = json_decode(file_get_contents($jpnCharsHiraFile), true);
$katakana = json_decode(file_get_contents($jpnCharsKataFile), true);
echo json_encode([
    'hiragana' => $hiragana,
    'katakana' => $katakana
], JSON_PRETTY_PRINT);