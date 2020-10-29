export const docsStylesVariable = '{{docsStyles}}';
export const docsMarkupVariable = '{{docsMarkup}}';
export const docsTemplate = `
<html lang="en">
  <head>
    <title>Readme</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      .markdown-body {
        box-sizing: border-box;
        min-width: 320px;
        max-width: 640px;
        margin: 0 auto;
        padding: 45px;
      }

      ${docsStylesVariable}
    </style>
  </head>
  <body class="markdown-body">
    ${docsMarkupVariable}
  </body>
</html>
`;
