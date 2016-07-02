// 引入readline模块
var readline = require('readline');

//创建readline接口实例
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let points = [];
let num = 3;
// rl.question(`请输入要计算几边形 (格式: 3 以上数字, 默认3):`, function (_num) {
//   num = _num || num;
//   pointsInput();
// });
// question方法
(function pointsInput() {
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
})();
// close事件监听
rl.on("close", function () {
  // 结束程序
  const result = count(points, num);
  console.log(`有线段：${result.totalLines.length}条,三角形有${result.triangles.length}`);
  process.exit(0);
});


//组合
function combination(arr, num) {
  var r = [];
  (function f(t, a, n) {
    if (n == 0) return r.push(t);
    for (var i = 0, l = a.length; i <= l - n; i++) {
      f(t.concat(a[i]), a.slice(i + 1), n - 1);
    }
  })([], arr, num);
  return r;
}

//排列
function permutation(arr, num) {
  var r = [];
  (function f(t, a, n) {
    if (n == 0) return r.push(t);
    for (var i = 0, l = a.length; i < l; i++) {
      f(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1);
    }
  })([], arr, num);
  return r;
}


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

// 避免3点一线的现象存在
function isVerify(ary, ary2) {
  let inline = 0;
  ary.map(v => {
    if (ary2.indexOf(v) != -1) {
      inline++
    }
  });
  return inline < 3;

}

const count = (_points, num) => {
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
    totalLines = totalLines.concat(combination.call(null, v, 2));
  });
  let triangles = [];
  const lines = combination.call(null, totalLines, num);
  lines.map(v => {
    let geometric = Array.prototype.unique.call(v);
    if (geometric.length == num) {
      // 判断当前3个点组成的是三角形还是3点一线的线段
      let isTriangle = true;
      points.map(v => {
        if (!isVerify(geometric, v)) {
          isTriangle = false
        }
      });
      if (isTriangle) {
        // console.log(v);
        console.log(geometric);
        triangles.push(geometric);
      }
    }
  });

  return {
    triangles,
    totalLines
  };
};



