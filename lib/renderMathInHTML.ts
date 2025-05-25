import katex from "katex";

export function renderMathInHTML(html: string): string {
  const inlineRegex = /\\\((.+?)\\\)/g;     
  const blockRegex = /\$\$(.+?)\$\$/g;

  // Replace block math first
  html = html.replace(blockRegex, (_, expr) => {
    return katex.renderToString(expr, {
      displayMode: true,
      throwOnError: false
    });
  });

  // Replace inline math
  html = html.replace(inlineRegex, (_, expr) => {
    return katex.renderToString(expr, {
      displayMode: false,
      throwOnError: false
    });
  });

  return html;
}
