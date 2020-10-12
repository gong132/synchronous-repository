import React, { PureComponent } from 'react'

class MyPie extends PureComponent {

  state = {
    data: [
      {
        title: '10-15岁',
        per: 10
      },
      {
        title: '16-20岁',
        per: 8
      },
      {
        title: '21-30岁',
        per: 20
      },
      {
        title: '31-45岁',
        per: 10
      },
      {
        title: '46-60岁',
        per: 15
      }
    ],
    innerPie: false,
  }

  componentDidMount() {
    const data = this.state.data
    const dom = document.getElementById('myCanvas')
    console.log(dom.parentNode.offsetWidth)
    dom.setAttribute("width", dom.parentNode.offsetWidth)
    const ctx = document.getElementById('myCanvas').getContext("2d");
    // 初始化数据
    const PieChart = (radius) => {
      // const radius = dom.offsetWidth*0.35
      // console.log(radius)
      this.ctx = ctx || document.getElementById("myCanvas").getContext("2d");
      this.width = this.ctx.canvas.width;
      this.height = this.ctx.canvas.height;
      this.x0 = this.width / 2 - 50;
      this.y0 = this.height / 2;
      this.radius = this.width * 0.23;
      this.outLong = radius / 8;
      this.dicX = dom.offsetWidth - 84;
      this.dicY = dom.offsetHeight - 30;
      // this.dicWidth = 40;
      // this.dicHeight = 14;
      this.arcRadius = 7
      this.spanY = 25;
    }

    PieChart.prototype.init = (data) => {
      this.drawPie(data);
    };

    const pieChart = new PieChart(150);
    console.log('init:', '执行')
    pieChart.init(data)

    dom.addEventListener('click', this._handleClick)
    dom.addEventListener('mousemove', this._handleMouseover)
  }

  // 判断鼠标的位置
  judgeMouseDesti = (e) => {
    let bool = false
    const { data, innerPie } = this.state
    // if(!innerPie) {
    //   return 'true' // 不在饼图内鼠标
    // }
    const { offsetX, offsetY } = e
    const X = offsetX - this.x0
    const Y = offsetY - this.y0
    const c = Math.sqrt(X * X + Y * Y)
    if (c > this.radius) {
      this.setState({
        innerPie: false
      })
      return 'true'
    }
    this.setState({
      innerPie: true
    })
    const angleList = this.transformAngle(data);
    console.log('angleList:', angleList)
    let totalAngle = 0

    let acos = Math.abs(Math.acos(X / c))
    // 判断点击在哪个区域, canvas绘制的饼图，0角度起点在x轴
    // 以cos计算，三四象限递减，一二象限递增
    // 通过计算数据在饼图中累积的角度值来判断点击的点在哪个数据上
    // 第四象限
    if (X > 0 && Y > 0) {
      // console.log('4:', acos)
    }

    // 第三象限
    if (X < 0 && Y > 0) {
      // console.log('X:', X)
      // console.log('Y:', Y)
      // console.log('c:', c)
      // console.log('3:', acos)
    }

    // 第二象限,第一象限
    if (Y < 0) {
      acos = 2 * Math.PI - acos
    }

    let dataIndex = 0
    angleList.map((v, index) => {
      totalAngle += v.angle
      console.log(totalAngle)
      if (bool) {
        return true
      }
      if (totalAngle > acos) {
        dataIndex = index
        console.log(dataIndex)
        bool = true
      }
    })

    // 点击区域的数据
    const clickA = data[dataIndex]
    return clickA

  }

  // 添加点击事件
  _handleClick = (e) => {
    const data = this.judgeMouseDesti(e)
    if (data === 'true') {
      return false
    }
    console.log(data)
  }

  // 鼠标移动事件
  _handleMouseover = (e) => {
    const data = this.judgeMouseDesti(e)
    if (data === 'true') {
      return false
    }
    console.log(data)
  }


  // 画圆
  drawPie = (data) => {
    console.log(data)
    // 转化后带有弧度的数据
    const angleList = this.transformAngle(data);
    console.log('angleList:', angleList)
    let startAngle = 0;
    angleList.forEach((item) => {
      const color = this.randomColor();
      this.ctx.beginPath();
      console.log(this)
      console.log(this.x0, this.y0, this.radius)
      this.ctx.arc(this.x0, this.y0, this.radius, startAngle, startAngle + item.angle);
      this.ctx.lineTo(this.x0, this.y0);
      this.ctx.fillStyle = color
      this.ctx.fill();
      // 调用drawTitle函数
      this.drawTitle(startAngle, item.angle, color, item.title);
      startAngle += item.angle;
    });
  }

  // 画标题
  drawTitle = (startAngle, angle, color, title) => {
    const out = this.outLong + this.radius;
    const du = startAngle + angle / 2;
    // 伸出外面的坐标原点
    const outX = this.x0 + out * Math.cos(du);
    const outY = this.y0 + out * Math.sin(du);
    this.ctx.beginPath();
    this.ctx.moveTo(this.x0, this.y0);
    this.ctx.lineTo(outX, outY);
    this.ctx.strokeStyle = color;
    // 设置标题
    this.ctx.font = '14px Microsoft Yahei';
    // const textWidth = this.ctx.measureText(title).width;
    this.ctx.textBaseline = "bottom";
    if (outX > this.x0) {
      this.ctx.textAlign = "left";
      this.ctx.lineTo(outX + 10, outY);
      this.ctx.stroke();
      this.ctx.fillText(title, outX + 15, outY + 7);
    } else {
      this.ctx.textAlign = "right";
      this.ctx.lineTo(outX - 10, outY);
      this.ctx.stroke();
      this.ctx.fillText(title, outX - 15, outY + 7);
    }
    // this.ctx.stroke();
    // this.ctx.fillText(title, outX, outY);
    // 画描述
    this.drawDic(title, color);
  };

  // 画描述
  drawDic = (title, color) => {
    // this.ctx.fillRect(this.dicX, this.dicY, this.dicWidth, this.dicHeight);
    this.ctx.beginPath();
    this.ctx.arc(this.dicX, this.dicY, this.arcRadius, 0, 2 * Math.PI);
    this.ctx.lineTo(this.dicX, this.dicY)
    this.ctx.fillStyle = color
    this.ctx.fill();
    this.ctx.font = '12px Microsoft Yahei';
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    this.ctx.overflow = 'hidden';
    this.ctx.textOverflow = 'ellipsis'
    this.ctx.fillText(title, this.dicX + this.arcRadius + 10, this.dicY + this.arcRadius / 2 - 2);

    this.dicY -= this.spanY;
  };

  // 转换角度
  transformAngle = (data) => {
    let total = 0;
    data.forEach((item) => {
      total += item.per;
    });
    data.forEach((item) => {
      item.angle = item.per / total * 2 * Math.PI;
    });
    return data;
  };

  // 生成随即色
  randomColor = () => {
    // 随机生成rgb三元色
    const r = Math.floor(Math.random() * 255 + 1);
    const g = Math.floor(Math.random() * 255 + 1);
    const b = Math.floor(Math.random() * 255 + 1);
    return `rgb(${r},${g},${b})`;
  };

  render() {
    return (
      // <canvas id='myCanvas' style={{ width: '100%', height: 440 }} />
      <div style={{ width: '100%' }}>
        <canvas id='myCanvas' height="440" />
      </div>
    )
  }
}

export default MyPie