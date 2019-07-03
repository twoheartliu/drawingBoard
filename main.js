const log = console.log.bind(console);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const setCanvasSize = () => {
  const pageWidth = document.documentElement.clientWidth;
  const pageHeight = document.documentElement.clientHeight;
  canvas.width = pageWidth;
  canvas.height = pageHeight;
};

const canvasSize = () => {
  window.addEventListener("resize", () => {
    setCanvasSize();
  });
};

const drawCircle = (x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
};

const drawLine = (x1, y1, x2, y2) => {
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
};

let drawing = false;
let lastPoint = {
  x: undefined,
  y: undefined
};
const mouseDown = () => {
  canvas.addEventListener("mousedown", e => {
    drawing = true;
    const x = e.clientX;
    const y = e.clientY;
    lastPoint.x = x;
    lastPoint.y = y;
    const radius = 2;
    drawCircle(x, y, radius);
  });
};

const mouseMove = () => {
  canvas.addEventListener("mousemove", e => {
    if (drawing === true) {
      const x = e.clientX;
      const y = e.clientY;
      const newPoint = { x, y };
      drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
      lastPoint = newPoint;
      const radius = 2;
      drawCircle(x, y, radius);
    }
  });
};

const mouseUp = () => {
  canvas.addEventListener("mouseup", e => {
    drawing = false;
  });
};

const setPencilColor = (color) => {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

const __main = () => {
  // 设置画布大小
  setCanvasSize();
  // 设置画笔颜色
  setPencilColor('red')
  // 监听事件
  canvasSize();
  mouseDown();
  mouseMove();
  mouseUp();
};
__main();
