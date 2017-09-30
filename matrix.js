let container = document.body

let charts = ['0', '1']
let chartsLen = charts.length
let baseFontSize = 20
let miniCount = 10
let maxCount = 50

class Line {
  constructor(rects, fontSize) {
    this.zIndex = Math.random() * 0.7 + 0.3
    this.chartCount = Math.floor(Math.random() * (maxCount - miniCount)) + miniCount
    this.charts = Array(this.chartCount).fill(0).map(d => charts[Math.floor(Math.random() * charts.length)])
    this.offsetX = Math.floor(Math.random() * rects.width / fontSize) * fontSize - fontSize * this.zIndex / 2
    this.offsetY = 0
    return this
  }
}

class Matrix {

  constructor(container) {
    this.fontSize = 30
    this.maxLines = 200
    this.speed = 50
    this.rects = container.getBoundingClientRect()
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.rects.width
    this.canvas.height = this.rects.height
    this.canvas.style.background = '#000'
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = 'green'
    this.lines = []
    container.innerHTML = ''
    container.appendChild(this.canvas)
    return this
  }

  font(fontSize) {
    let fs = fontSize || this.fontSize
    return `${fs}px Menlo, Monaco, Consolas`
  }

  drawLine(line) {
    let fontSize = this.fontSize * line.zIndex
    this.ctx.font = this.font(fontSize)
    this.ctx.globalAlpha = line.zIndex
    line.charts.forEach((c, i) => {
      this.ctx.fillText(c, line.offsetX, line.offsetY - i * fontSize)
    })
  }

  run(timeStamp) {
    if (!this.t) {
      this.t = timeStamp
    } else {
      let tOffset = timeStamp - this.t
      let offsetY
      if (tOffset >= this.speed) {
        offsetY = this.fontSize
        this.t = timeStamp - (tOffset - this.speed)
        this.ctx.clearRect(0, 0, this.rects.width, this.rects.height)
        for (let i = 0; i < this.maxLines; i++) {
          if (!this.lines[i]) {
            this.lines[i] = new Line(this.rects, this.fontSize)
          } else {
            let l = this.lines[i]
            let y = l.offsetY - l.charts.length * l.zIndex * this.fontSize
            if (y > this.rects.height) {
              this.lines[i] = new Line(this.rects, this.fontSize)
            } else {
              l.offsetY += offsetY * l.zIndex
            }
          }
          this.drawLine(this.lines[i])
        }
      }
    }
    this.animation = window.requestAnimationFrame(this.run.bind(this))
  }

  stop() {
    window.cancelAnimationFrame(this.animation)
  }
}


let m = new Matrix(container).run()
