
/**
 * 计算滚动条宽度，为表格自动计算做伏笔
 */
function getScrollbarWidth() {
  let tempElement = document.createElement('p');
  let styles = {
    width: '100px',
    height: '100px',
    overflowY: 'scroll',
  };
  let scrollbarWidth = 0;
  for (let key in styles) {
    tempElement.style[key] = styles[key];
  }
  document.body.appendChild(tempElement);
  scrollbarWidth = tempElement.offsetWidth - tempElement.clientWidth;
  tempElement.parentNode.removeChild(tempElement);
  return scrollbarWidth;
}
window.scrollbarWidth = getScrollbarWidth();
