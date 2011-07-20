===== INTRODUCTION =====
Replace Thai vowel character that placed on wrong position on the web with the
corrected one.

===== USAGE =====
First, font must support private Thai unicode range (U+0E00 to U+0E7F and U+F700
to U+F882). Then simply use this snippet on your web page.

`
<script src="path/to/thai-vowel-corrector.js"></script>
var newContent = correctThaiFloatingVowel(content);
`

see example for cufon in './examples' directory.
