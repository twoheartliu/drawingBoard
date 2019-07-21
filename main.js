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
  bindEvent(window, "resize", () => {
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
  bindEvent(canvas, "mousedown", e => {
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
  bindEvent(canvas, "mousemove", e => {
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
  bindEvent(canvas, "mouseup", e => {
    drawing = false;
  });
};

const listenToTouch = () => {
  bindEvent(canvas, "touchstart", e => {
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
  bindEvent(canvas, "touchmove", e => {
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
  bindEvent(canvas, "touchend", e => {
    log("touch end");
    drawing = false;
  });
};

const changeButton = () => {
  let eraser = e(".eraser");
  let brush = e(".brush");
  bindEvent(eraser, "click", () => {
    eraserEnabled = true;
    let old = e(".active");
    if (old) {
      old.classList.remove("active");
    }
    eraser.classList.add("active");
  });
  bindEvent(brush, "click", () => {
    eraserEnabled = false;
    log(drawing);
    let old = e(".active");
    if (old) {
      old.classList.remove("active");
    }
    brush.classList.add("active");
  });
};

const setPencilColor = () => {
  const list = es(".colors-cell");

  bindAll(list, "click", event => {
    const old = e("li.active");
    log(event.target);
    const self = event.target;
    const color = self.dataset.color;
    log("color", color);
    if (old) {
      old.classList.remove("active");
    }
    self.classList.add("active");
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
  });
};

const __main = () => {
  // 设置画布大小
  autoCanvasSize();
  // 设置画笔颜色 (调整 canvas 画布会清空上下文的设置，比如颜色)
  setPencilColor();
  // 监听事件
  if (document.body.ontouchstart === undefined) {
    listenToMouse();
  } else {
    listenToTouch();
  }

  changeButton();

  // 阻止移动端浏览器橡皮筋效果
  document.body.addEventListener(
    "touchmove",
    function(e) {
      e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    },
    { passive: false }
  );
};
__main();
