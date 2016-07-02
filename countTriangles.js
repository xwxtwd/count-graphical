// 引入readline模块
var readline = require('readline');

//创建readline接口实例
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let points = [];
// question方法
function pointsInput() {
  rl.question(`请输入第${points.length + 1}条线段中的点${points.length == 0 
  && ' (格式: A, B, F 或者 ABF)' || ' (结束请输入: end)'}：`, function (pts) {
    // 不加close，则不会结束
    if (pts == 'end') {
      rl.close();
    } else {
      console.log("输入的线段是:" + pts);
      const str = pts.indexOf(',') != -1 ? ',' : '';
      points.push(pts.split(str));
      pointsInput();
    }
  });
}
pointsInput();
// close事件监听
rl.on("close", function () {
  // 结束程序
  const result = count(points);
  console.log(`有线段：${result.totalLines.length}条,三角形有${result.triangles.length}`);
  process.exit(0);
});


// 数组去重
Array.prototype.unique = function () {
  let res = [];
  let json = {};
  for (var i = 0; i < this.length; i++) {
    if (!json[this[i]]) {
      res.push(this[i]);
      json[this[i]] = 1;
    }
  }
  return res;
};

/*
 传入图上同一线段上的点, 返回可以组合成的线段
 例如
 getLines("E", "I", "G", "F")
 返回:
 [
 [ 'E', 'I' ],
 [ 'E', 'G' ],
 [ 'E', 'F' ],
 [ 'I', 'G' ],
 [ 'I', 'F' ],
 [ 'G', 'F' ]
 ]
 */
function getLines() {
  let points = arguments;
  let lines = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (points[i] == points[j]) {
        continue;
      }

      lines.push([points[i], points[j]]);
    }
  }
  return lines;
}

// 当3个点中,有一个在存在线段中,就能组成三角形
function isVerify(ary, ary2) {
  let inline = 0;
  ary.map(v => {
    if (ary2.indexOf(v) != -1) {
      inline++
    }
  });
  return inline < 3;

}

const count = (_points) => {
  let points = _points || [
      ["A", "B", "F"],
      ["A", "G", "C", "H"],
      ["A", "D", "I", "J"],
      ["A", "E", "K"],
      ["B", "C", "D", "E"],
      ["F", "H", "J", "K"],
      ["E", "I", "G", "F"]
    ];
  let totalLines = [];
  points.map(v => {
    totalLines = totalLines.concat(getLines.apply(null, v));
  });
  let triangles = [];
  for (let i = 0; i < totalLines.length; i++) {
    for (let j = i + 1; j < totalLines.length; j++) {
      for (let z = j + 1; z < totalLines.length; z++) {
        let lines = totalLines[i].concat(totalLines[j]).concat(totalLines[z]);
        // 任意三条线段组合, lines里的点做去重, 算出三条线段一共有多少个点, 当线段组合有且只由3个点组成, 旧能组成一个三角形
        let geometric = Array.prototype.unique.call(lines);
        if (geometric.length == 3) {
          // 判断当前3个点组成的是三角形还是3点一线的线段
          let isTriangle = true;
          points.map(v => {
            if (!isVerify(geometric, v)) {
              isTriangle = false
            }
          });
          if (!isTriangle) continue;
          console.log(geometric);
          triangles.push(geometric);
        }
      }
    }
  }
  return {
    triangles,
    totalLines
  };
};



