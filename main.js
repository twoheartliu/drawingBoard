const log = console.log.bind(console);

const e = selector => document.querySelector(selector);
const canvas = e("#canvas");
const ctx = canvas.getContext("2d");
let eraserEnabled = false;
let drawing = false;
let lastPoint = {
  x: undefined,
  y: undefined
};

const setCanvasSize = () => {
  const pageWidth = document.documentElement.clientWidth;
  const pageHeight = document.documentElement.clientHeight;
  canvas.width = pageWidth;
  canvas.height = pageHeight;
};

const autoCanvasSize = () => {
  setCanvasSize();
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

const listenToMouse = () => {
  canvas.addEventListener("mousedown", e => {
    drawing = true;
    const x = e.clientX;
    const y = e.clientY;
    lastPoint.x = x;
    lastPoint.y = y;
    const radius = 2;
    if (eraserEnabled) {
      ctx.clearRect(x - 5, y - 5, 10, 10);
    } else {
      drawCircle(x, y, radius);
    }
  });
  canvas.addEventListener("mousemove", e => {
    if (drawing !== true) {
      return;
    }
    const x = e.clientX;
    const y = e.clientY;
    if (eraserEnabled) {
      ctx.clearRect(x - 5, y - 5, 10, 10);
    } else {
      const newPoint = { x, y };
      drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
      lastPoint = newPoint;
      const radius = 2;
      drawCircle(x, y, radius);
    }
  });
  canvas.addEventListener("mouseup", e => {
    drawing = false;
  });
};

const listenToTouch = () => {
  canvas.addEventListener("touchstart", e => {
    log("touch start");
    drawing = true;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    lastPoint.x = x;
    lastPoint.y = y;
    const radius = 2;
    if (eraserEnabled) {
      ctx.clearRect(x - 5, y - 5, 10, 10);
    } else {
      drawCircle(x, y, radius);
    }
  });
  canvas.addEventListener("touchmove", e => {
    if (drawing !== true) {
      return;
    }
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    if (eraserEnabled) {
      ctx.clearRect(x - 5, y - 5, 10, 10);
    } else {
      const newPoint = { x, y };
      drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
      lastPoint = newPoint;
      const radius = 2;
      drawCircle(x, y, radius);
    }
  });
  canvas.addEventListener("touchend", e => {
    log("touch end");
    drawing = false;
  });
};

const changeButton = () => {
  let eraser = e(".eraser");
  let brush = e(".brush");
  eraser.addEventListener("click", () => {
    log("eraser clicked");
    eraserEnabled = !eraserEnabled;
    log("eraser", eraserEnabled);
    let old = e(".active");
    if (old) {
      old.classList.remove("active");
    }
    brush.classList.add("active");
  });
  brush.addEventListener("click", () => {
    eraserEnabled = !eraserEnabled;
    let old = e(".active");
    if (old) {
      old.classList.remove("active");
    }
    eraser.classList.add("active");
  });
};
// const listenToEraser = () => {};

// const listenToBrush = () => {};

const setPencilColor = color => {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
};

const __main = () => {
  // 设置画布大小
  autoCanvasSize();
  // 设置画笔颜色 (调整 canvas 画布会清空上下文的设置，比如颜色)
  setPencilColor("red");
  // 监听事件
  if (document.body.ontouchstart === undefined) {
    listenToMouse();
  } else {
    listenToTouch();
  }

  changeButton();
};
__main();
