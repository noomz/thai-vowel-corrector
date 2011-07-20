===== INTRODUCTION =====
Replace Thai vowel character that placed on wrong position on the web with the
corrected one.

===== USAGE =====
First, font must support private Thai unicode range (U+0E00 to U+0E7F and U+F700
to U+F882). Then simply use this snippet on your web page.

```javascript
<script src="path/to/thai-vowel-corrector.js"></script>
var newContent = correctThaiFloatingVowel(content);
```

For cufon do this:
```javascript
Cufon.set('modifyText', correctThaiFloatingVowel);
```

or pass as an options:

```javascript
Cufon.replace('h1', {
  modifyText: correctThaiFloatingVowel
});
```

see example for cufon in './examples' directory.
