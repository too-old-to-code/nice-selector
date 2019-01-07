class NiceSelector {
  constructor(id, items, text) {
    this.id = id
    this.items = items
    this.text = text

    // if it's not an array of values, we can take a number as a string
    // in the format 0-12. If we want to keep the leading zero on numbers
    // under 10 we write a preceding 0 like so 00-59
    if (typeof items === 'string'){
      this.createRange(items)
    }

    this.element = document.getElementById(id)
    this.listLength = this.items.length
    this.topPos = 20
    this.time = 0
    this.index = 0
    this.value = this.items[0]
    this.element.onmousedown = this.handleMousedown.bind(this)
    this.element.onmouseup = this.handleMouseup.bind(this)

    this.renderSelector()
  }

  createRange (str) {
    let precedeWithZero = false
    let rangeInstruction = str.split('-')

    // this is where we determine if leading zeros are to be kept for numbers
    // under 10
    if (rangeInstruction[0].length > 1 && rangeInstruction[0].charAt(0) === '0') {
      precedeWithZero = true
    }
    let range = rangeInstruction.map(num => Number(num))
    this.items = []

    for (let i = range[0]; i < range[1]; i ++){
      let entry = precedeWithZero && i < 10 ? `0${i}` : i
      this.items.push(entry)
    }
  }

  startTimer () {
    this.timer = setInterval(() => {
      if (this.time > 1) {
        this.element.querySelector('.ns-interface').classList.add('ns-long-press')
      }
      this.time ++
    }, 120)
  }

  endTimer () {
    this.element.querySelector('.ns-interface').classList.remove('ns-long-press')
    clearInterval(this.timer)
    this.time = 0
  }

  handleMousedown (e) {
    this.startTimer()
  }

  handleMouseup (e) {
    let increment = this.time > 1 && this.listLength > 10 ? 10 : 1
    let direction = e.target.dataset.btn

    if (direction === 'down'){
      this.index -= increment
    } else if (direction === 'up') {
      this.index += increment
    }

    this.index = this.index < 0
      ? this.index + this.listLength
      : this.index >= this.listLength
        ? this.index - this.listLength
        : this.index

    this.endTimer()

    this.topPos = this.index * 60
    this.value = this.items[this.index]
    this.element.querySelectorAll('.ns-display')[0].style.top = `${-this.topPos + 20}px`
    this.element.getElementsByTagName('input')[0].value = this.value
  }

  renderSelector () {
    this.element.innerHTML = `
      <div class="ns-interface">
        ${this.text ? `<span class="ns-display-text">${this.text}</span>` : '' }
        <div class="ns-display" style="top:${this.topPos}px;${this.text ? 'padding-top:5px' : ''};">
          ${this.items.map(item => `<div>${item}</div>` ).join('')}
        </div>
        <input type="hidden" name="${this.id}" value="${this.value}"/>
        <div class="ns-btn ns-btn-top" data-btn="up">▲</div>
        <div class="ns-btn ns-btn-bottom" data-btn="down">▲</div>
      </div>
    `
  }
}