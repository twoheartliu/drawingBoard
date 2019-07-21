const canvas = e("#canvas");
const ctx = canvas.getContext("2d");
let eraserEnabled = false;
let drawing = false;
let lastPoint = {
  x: undefined,
  y: undefined
};

const stopTrailing = () => {
  document.body.addEventListener(
    "touchmove",
    function(e) {
      e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    },
    { passive: false }
  );
};

const setCanvasSize = () => {
  const pageWidth = document.documentElement.clientWidth;
  const pageHeight = document.documentElement.clientHeight;
  canvas.width = pageWidth;
  canvas.height = pageHeight;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    // const radius = 5;
    if (eraserEnabled) {
      ctx.clearRect(x - 5, y - 5, 10, 10);
    } else {
      drawCircle(x, y, ctx.lineWidth / 2);
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
      const radius = 5;
      drawCircle(x, y, ctx.lineWidth / 2);
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
  const eraser = e(".eraser");
  const brush = e(".brush");
  const clear = e(".delete");
  const download = e(".download");
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
  bindEvent(clear, "click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
  bindEvent(download, "click", () => {
    const data = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = data;
    a.link = "_blank";
    a.download = "画板";
    a.click();
  });
};

const setPencilColor = () => {
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
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

const setLineWidth = () => {
  ctx.lineWidth = "3";
  const lines = es(".lines-cell");
  bindAll(lines, "click", event => {
    const old = e("li.checked");
    log(event.target);
    const self = event.target;
    const width = self.dataset.width;
    if (old) {
      old.classList.remove("checked");
    }
    self.classList.add("checked");
    log("width", width);
    ctx.lineWidth = width;
  });
};
const __main = () => {
  // 阻止移动端浏览器橡皮筋效果
  stopTrailing();
  // 设置画布大小
  autoCanvasSize();
  // 监听事件
  if (document.body.ontouchstart === undefined) {
    listenToMouse();
  } else {
    listenToTouch();
  }
  // 设置画笔颜色 (调整 canvas 画布会清空上下文的设置，比如颜色)
  setPencilColor();
  // 设置画笔粗细
  setLineWidth();
  // 切换按钮
  changeButton();
};
__main();
