// utils/getTocList.ts
export function getTocListFromContent(rootEl: HTMLElement) {
  const headers = rootEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const toc = Array.from(headers).map((el) => {
    return {
      id: el.id, // 文章中的锚点 id
      text: el.textContent || '',
      level: parseInt(el.tagName[1]), // 获取 H 标签的数字部分
    };
  });
  return toc;
}
