const makeTree = () => {
  let arr = document.querySelector("#tree-input").value;
  if (!arr) {
    // arr = "1,2,3,4,5,6,7,8";
    // arr = "[5,4,8,11,null,13,4,7,2,null,null,5,1]";

    arr = "1,22,3,4,5,6,77,8,9,1,2,3,4,5,6,7,8888,9,1,2,3,4,5,6,7,8,9";
  }

  let treeVisualization = document.querySelector("#tree");

  arr = arr
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll(" ", "")
    .split(",");

  text = buildTree(arr);

  treeVisualization.innerHTML = "<pre>" + text + "</pre>";
};

const buildTree = (arr) => {
  let lengths = arr.filter((i) => i !== "null").map((i) => i.length);
  let maxLength = Math.max(...lengths);
  console.log(maxLength);

  console.log(arr);

  const tree = helper(0);

  function helper(index) {
    if (index >= arr.length) return null;
    if (arr[index] === "null") {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      arr.splice(leftChildIndex, 0, "null");
      arr.splice(rightChildIndex, 0, "null");
      return null;
    }

    let leftChildIndex = 2 * index + 1;
    let rightChildIndex = 2 * index + 2;

    let root = TreeNode(
      parseInt(arr[index], 10),
      helper(leftChildIndex),
      helper(rightChildIndex)
    );

    return root;
  }

  console.log(tree);

  function height(tree) {
    if (!tree) {
      return 0;
    }
    return 1 + Math.max(height(tree.left), height(tree.right));
  }

  function width(h) {
    return Math.pow(2, h) - 1;
  }

  let m = [];
  let h = 2 * height(tree) - 1;
  let w = width(height(tree));
  for (let i = 0; i < h; i++) {
    m[i] = [];
    for (let j = 0; j < w; j++) {
      m[i][j] = " ".repeat(maxLength);
    }
  }

  function getNodeValueString(node, maxLength, isLeft) {
    let val = node.val.toString();
    let lenDiff = maxLength - val.length;
    let leftPadding = Math.floor(lenDiff / 2);
    let rightPadding = leftPadding;
    console.log(leftPadding, rightPadding);
    if (lenDiff % 2 === 1) {
      if (isLeft) rightPadding++;
      else leftPadding++;
    }
    return " ".repeat(leftPadding) + val + " ".repeat(rightPadding);
  }

  function getLine(char, maxLength) {
    let lenDiff = maxLength - 1;
    let leftPadding = Math.floor(lenDiff / 2);
    let rightPadding = leftPadding;
    // if (char === "/") {
    //   leftPadding = lenDiff + 1;
    // } else {
    //   rightPadding = lenDiff + 1;
    // }
    if (lenDiff % 2 === 1) {
      if (char === "/") leftPadding++;
      else rightPadding++;
    }
    return " ".repeat(leftPadding) + char + " ".repeat(rightPadding);
  }

  function dfs(level, n, l, r, isLeft) {
    if (!n) {
      return;
    }
    let mid = Math.floor((l + r) / 2);
    console.log(l, r, mid);
    m[2 * level][mid] = getNodeValueString(n, maxLength, isLeft);
    if (level > 0) {
      let char = getLine(isLeft ? "/" : "\\", maxLength);
      let charIndex = 0;
      if (isLeft) {
        charIndex = Math.floor((r - mid) / 2) + mid;
      } else {
        charIndex = Math.floor((mid - l) / 2) + l;
        if (charIndex === l) charIndex++;
      }

      m[2 * level - 1][charIndex] = char;
    }
    dfs(level + 1, n.left, l, mid, true);
    dfs(level + 1, n.right, mid, r, false);
  }

  dfs(0, tree, 0, m[0].length, false);

  let lines = [];

  for (line of m) {
    lines.push(line.toString().replaceAll(",", ",").split(""));
  }

  for (let j = 0; j < lines[0].length; j++) {
    let allEmpty = true;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i][j] !== " ") allEmpty = false;
    }
    if (allEmpty) {
      for (let i = 0; i < m.length; i++) {
        lines[i][j] = "";
      }
    }
  }
  if (lines.length === 0) {
    lines = m;
  }

  let res = "";

  for (line of lines) {
    res += line.toString().replaceAll(",", "");
    res += "\n";
  }

  return res;
};

function TreeNode(val, left = null, right = null) {
  return {
    val: val === undefined ? 0 : val,
    left: left === undefined ? null : left,
    right: right === undefined ? null : right,
  };
}

const button = document.querySelector("#make-tree-button");
button.onclick = makeTree;
