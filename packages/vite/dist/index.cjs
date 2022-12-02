'use strict';

const getPixels = require('get-pixels');
const images = require('images');

var Directions = /* @__PURE__ */ ((Directions2) => {
  Directions2[Directions2["Left"] = 0] = "Left";
  Directions2[Directions2["LeftTop"] = 1] = "LeftTop";
  Directions2[Directions2["Top"] = 2] = "Top";
  Directions2[Directions2["TopRight"] = 3] = "TopRight";
  Directions2[Directions2["Right"] = 4] = "Right";
  Directions2[Directions2["RightBottom"] = 5] = "RightBottom";
  Directions2[Directions2["Bottom"] = 6] = "Bottom";
  Directions2[Directions2["BottomLeft"] = 7] = "BottomLeft";
  return Directions2;
})(Directions || {});

let CannyJS, GrayImageData, Util;
Util = {};
Util.generateMatrix = function(w, h, initialValue) {
  let matrix, x, y, _i, _j, _ref, _ref1;
  matrix = [];
  for (x = _i = 0, _ref = w - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
    matrix[x] = [];
    for (y = _j = 0, _ref1 = h - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
      matrix[x][y] = initialValue;
    }
  }
  return matrix;
};
GrayImageData = function() {
  function GrayImageData2(width, height) {
    this.width = width;
    this.height = height;
    this.data = Util.generateMatrix(this.width, this.height, 0);
  }
  GrayImageData2.prototype.loadCanvas = function(rawdata) {
    let b, g, i, r, x, y, _i, _len;
    x = 0;
    y = 0;
    for (i = _i = 0, _len = rawdata.length; _i < _len; i = _i += 4) {
      rawdata[i];
      r = rawdata[i];
      g = rawdata[i + 1];
      b = rawdata[i + 2];
      this.data[x][y] = Math.round(0.298 * r + 0.586 * g + 0.114 * b);
      if (x === this.width - 1) {
        x = 0;
        y += 1;
      } else {
        x += 1;
      }
    }
    return this;
  };
  GrayImageData2.prototype.getNeighbors = function(x, y, size) {
    let i, j, neighbors, trnsX, trnsY, _i, _j, _ref, _ref1;
    neighbors = Util.generateMatrix(size, size, 0);
    for (i = _i = 0, _ref = size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      neighbors[i] = [];
      for (j = _j = 0, _ref1 = size - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        trnsX = x - (size - 1) / 2 + i;
        trnsY = y - (size - 1) / 2 + j;
        if (this.data[trnsX] && this.data[trnsX][trnsY]) {
          neighbors[i][j] = this.data[trnsX][trnsY];
        } else {
          neighbors[i][j] = 0;
        }
      }
    }
    return neighbors;
  };
  GrayImageData2.prototype.eachPixel = function(neighborSize, func) {
    let current, neighbors, x, y, _i, _j, _ref, _ref1;
    for (x = _i = 0, _ref = this.width - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
      for (y = _j = 0, _ref1 = this.height - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
        current = this.data[x][y];
        neighbors = this.getNeighbors(x, y, neighborSize);
        func(x, y, current, neighbors);
      }
    }
    return this;
  };
  GrayImageData2.prototype.toImageDataArray = function() {
    let ary, x, y, _i, _j, _k, _ref, _ref1;
    ary = [];
    for (y = _i = 0, _ref = this.height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      for (x = _j = 0, _ref1 = this.width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        for (_k = 0; _k <= 2; ++_k) {
          ary.push(this.data[x][y]);
        }
        ary.push(255);
      }
    }
    return ary;
  };
  GrayImageData2.prototype.copy = function() {
    let copied, x, y, _i, _j, _ref, _ref1;
    copied = new GrayImageData2(this.width, this.height);
    for (x = _i = 0, _ref = this.width - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
      for (y = _j = 0, _ref1 = this.height - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
        copied.data[x][y] = this.data[x][y];
      }
    }
    copied.width = this.width;
    copied.height = this.height;
    return copied;
  };
  GrayImageData2.prototype.drawOn = function(canvas) {
    let color, ctx, i, imgData, _i, _len, _ref;
    ctx = canvas.getContext("2d");
    imgData = ctx.createImageData(canvas.width, canvas.height);
    _ref = this.toImageDataArray();
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      color = _ref[i];
      imgData.data[i] = color;
    }
    return ctx.putImageData(imgData, 0, 0);
  };
  GrayImageData2.prototype.fill = function(color) {
    let x, y, _i, _ref, _results;
    _results = [];
    for (y = _i = 0, _ref = this.height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      _results.push(function() {
        let _j, _ref1, _results1;
        _results1 = [];
        for (x = _j = 0, _ref1 = this.width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          _results1.push(this.data[x][y] = color);
        }
        return _results1;
      }.call(this));
    }
    return _results;
  };
  return GrayImageData2;
}();
CannyJS = {};
CannyJS.gaussianBlur = function(imgData, sigmma, size) {
  let copy, kernel;
  if (sigmma == null) {
    sigmma = 1.4;
  }
  if (size == null) {
    size = 3;
  }
  kernel = CannyJS.generateKernel(sigmma, size);
  copy = imgData.copy();
  copy.fill(0);
  imgData.eachPixel(size, function(x, y, current, neighbors) {
    let i, j, _results;
    i = 0;
    _results = [];
    while (i <= size - 1) {
      j = 0;
      while (j <= size - 1) {
        copy.data[x][y] += neighbors[i][j] * kernel[i][j];
        j++;
      }
      _results.push(i++);
    }
    return _results;
  });
  return copy;
};
CannyJS.generateKernel = function(sigmma, size) {
  let e, gaussian, i, j, kernel, s, sum, x, y, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
  s = sigmma;
  e = 2.718;
  kernel = Util.generateMatrix(size, size, 0);
  sum = 0;
  for (i = _i = 0, _ref = size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    x = -(size - 1) / 2 + i;
    for (j = _j = 0, _ref1 = size - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
      y = -(size - 1) / 2 + j;
      gaussian = 1 / (2 * Math.PI * s * s) * Math.pow(e, -(x * x + y * y) / (2 * s * s));
      kernel[i][j] = gaussian;
      sum += gaussian;
    }
  }
  for (i = _k = 0, _ref2 = size - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
    for (j = _l = 0, _ref3 = size - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; j = 0 <= _ref3 ? ++_l : --_l) {
      kernel[i][j] = (kernel[i][j] / sum).toFixed(3);
    }
  }
  console.log("kernel", kernel);
  return kernel;
};
CannyJS.sobel = function(imgData) {
  let copy, xFiler, yFiler;
  yFiler = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  xFiler = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  copy = imgData.copy();
  copy.fill(0);
  imgData.eachPixel(3, function(x, y, current, neighbors) {
    let ghs, gvs, i, j, _i, _j;
    ghs = 0;
    gvs = 0;
    for (i = _i = 0; _i <= 2; i = ++_i) {
      for (j = _j = 0; _j <= 2; j = ++_j) {
        ghs += yFiler[i][j] * neighbors[i][j];
        gvs += xFiler[i][j] * neighbors[i][j];
      }
    }
    return copy.data[x][y] = Math.sqrt(ghs * ghs + gvs * gvs);
  });
  return copy;
};
CannyJS.nonMaximumSuppression = function(imgData) {
  let copy;
  copy = imgData.copy();
  copy.fill(0);
  imgData.eachPixel(3, function(x, y, c, n) {
    if (n[1][1] > n[0][1] && n[1][1] > n[2][1]) {
      copy.data[x][y] = n[1][1];
    } else {
      copy.data[x][y] = 0;
    }
    if (n[1][1] > n[0][2] && n[1][1] > n[2][0]) {
      copy.data[x][y] = n[1][1];
    } else {
      copy.data[x][y] = 0;
    }
    if (n[1][1] > n[1][0] && n[1][1] > n[1][2]) {
      copy.data[x][y] = n[1][1];
    } else {
      copy.data[x][y] = 0;
    }
    if (n[1][1] > n[0][0] && n[1][1] > n[2][2]) {
      return copy.data[x][y] = n[1][1];
    } else {
      return copy.data[x][y] = 0;
    }
  });
  return copy;
};
CannyJS.hysteresis = function(imgData, ht, lt) {
  let copy, isCandidate, isStrong, isWeak, traverseEdge;
  copy = imgData.copy();
  isStrong = function(edge) {
    return edge > ht;
  };
  isCandidate = function(edge) {
    return edge <= ht && edge >= lt;
  };
  isWeak = function(edge) {
    return edge < lt;
  };
  imgData.eachPixel(3, function(x, y, current, neighbors) {
    if (isStrong(current)) {
      return copy.data[x][y] = 255;
    } else if (isWeak(current) || isCandidate(current)) {
      return copy.data[x][y] = 0;
    }
  });
  traverseEdge = function(x, y) {
    let i, j, neighbors, _i, _results;
    if (x === 0 || y === 0 || x === imgData.width - 1 || y === imgData.height - 1) {
      return;
    }
    if (isStrong(copy.data[x][y])) {
      neighbors = copy.getNeighbors(x, y, 3);
      _results = [];
      for (i = _i = 0; _i <= 2; i = ++_i) {
        _results.push(function() {
          let _j, _results1;
          _results1 = [];
          for (j = _j = 0; _j <= 2; j = ++_j) {
            if (isCandidate(neighbors[i][j])) {
              copy.data[x - 1 + i][y - 1 + j] = 255;
              _results1.push(traverseEdge(x - 1 + i, y - 1 + j));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }());
      }
      return _results;
    }
  };
  copy.eachPixel(3, function(x, y) {
    return traverseEdge(x, y);
  });
  copy.eachPixel(1, function(x, y, current) {
    if (!isStrong(current)) {
      return copy.data[x][y] = 0;
    }
  });
  return copy;
};
CannyJS.canny = function({ width, height, data }, ht, lt, sigmma, kernelSize) {
  let blur, imgData, nms, sobel;
  if (ht == null) {
    ht = 100;
  }
  if (lt == null) {
    lt = 50;
  }
  if (sigmma == null) {
    sigmma = 1.4;
  }
  if (kernelSize == null) {
    kernelSize = 3;
  }
  imgData = new GrayImageData(width, height);
  imgData.loadCanvas(data);
  blur = CannyJS.gaussianBlur(imgData, sigmma, kernelSize);
  sobel = CannyJS.sobel(blur);
  nms = CannyJS.nonMaximumSuppression(sobel);
  return CannyJS.hysteresis(nms, ht, lt);
};

const directions = [
  Directions.Left,
  Directions.LeftTop,
  Directions.Top,
  Directions.TopRight,
  Directions.Right,
  Directions.RightBottom,
  Directions.Bottom,
  Directions.BottomLeft
];
const compose = (...fncs) => (...args) => fncs.reduce((p, n, i) => i ? n(p) : n(...p), args);
const getPointByDirection = ([x, y], dirction) => {
  switch (dirction) {
    case Directions.Left:
      return [x - 1, y];
    case Directions.LeftTop:
      return [x - 1, y - 1];
    case Directions.Top:
      return [x, y - 1];
    case Directions.TopRight:
      return [x + 1, y - 1];
    case Directions.Right:
      return [x + 1, y];
    case Directions.RightBottom:
      return [x + 1, y + 1];
    case Directions.Bottom:
      return [x, y + 1];
    case Directions.BottomLeft:
      return [x - 1, y + 1];
  }
};
const getPoints = (imgData, w, h) => {
  const pointMap = /* @__PURE__ */ new Map();
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = x * 4 + y * w * 4;
      if (imgData[i] === 255)
        pointMap.set(`${x}-${y}`, [x, y]);
    }
  }
  return pointMap;
};
const getLines = (pointMap) => {
  const pointCache = /* @__PURE__ */ new Map();
  const lines = [];
  const { random } = Math;
  for (const [x, y] of pointMap.values()) {
    if (pointCache.has(`${x}-${y}`))
      continue;
    directions.sort(() => random() - random());
    const line = [];
    let start = [x, y];
    line.push(start);
    pointCache.set(`${x}-${y}`, true);
    let i = 0;
    while (i < directions.length) {
      const [x2, y2] = getPointByDirection(start, directions[i]);
      if (!pointMap.has(`${x2}-${y2}`) || pointCache.has(`${x2}-${y2}`)) {
        i++;
        continue;
      }
      line.push(start = [x2, y2]);
      pointCache.set(`${x2}-${y2}`, true);
    }
    if (line.length > 2) {
      lines.push(line);
    }
  }
  return lines;
};
const createPolyLines = (lines) => {
  return lines.map((line) => `<polyline style='--offset:${line.length}' points='${line.map((point) => point.join(",")).join(" ")}' fill='none' ></polyline>`).join("");
};
const getPolyLines = compose(
  getPoints,
  getLines,
  createPolyLines
);
function draw() {
  const includeReg = /\.(png|gif|[jpeg]jpg|webp)($|\?)/;
  const activeModeReg = /([^?]+)\?activeMode=([^'"?]+)/g;
  const pathReg = /('|")([^'"]+)(\?activeMode)/g;
  const cacheMap = /* @__PURE__ */ new Map();
  return {
    name: "active-img:draw",
    async transform(code, id) {
      if (cacheMap.has(id))
        return cacheMap.get(id);
      if (!includeReg.test(id))
        return code;
      const [[, filePath, mode] = []] = Array.from(id.matchAll(activeModeReg));
      if (mode !== "draw")
        return code;
      const max = 1e4;
      console.time("img");
      const img = images(filePath);
      console.timeLog("img");
      const scaleImg = img.size(Math.min(img.width(), max));
      console.timeLog("img");
      const buffer = scaleImg.encode("jpg");
      console.timeLog("img");
      const { data, shape: [width, height] } = await new Promise((r) => {
        getPixels(buffer, "image/jpg", (err, pix) => {
          r(pix);
        });
      });
      console.timeEnd("img");
      const canny = CannyJS.canny({ width, height, data }, 80, 10, 1.4, 3);
      const content = getPolyLines(canny.toImageDataArray(), width, height);
      const [match] = Array.from(code.matchAll(pathReg));
      cacheMap.set(id, `
      import src from '${match[2]}'
      // const src = '${match[2].slice(0, match[2].length - 2)}'
      export default JSON.stringify({
        src,
        width: ${width},
        height: ${height},
        content: "${content}",
      })`);
      return cacheMap.get(id);
    }
  };
}

function index() {
  return [
    draw()
  ];
}

module.exports = index;
