# ركن الكهرم PWA V13 — إصلاح GitHub

سبب المشكلة في المستودع كان أن المجلد اسمه `icon` بينما الملفات كانت تشير إلى `icons`.

## ارفع واستبدل هذه العناصر

- index.html
- manifest.webmanifest
- sw.js
- .nojekyll
- pwa-check.html
- مجلد icon
- مجلد assets

## بعد النشر

افتح:
`https://اسمك.github.io/Mzad-app/pwa-check.html`

يجب أن تظهر جميع الاختبارات باللون الأخضر.
بعد ذلك افتح الصفحة الرئيسية من Chrome وانتظر قليلاً، ثم اختر التثبيت.
