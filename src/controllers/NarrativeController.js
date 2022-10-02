import gsap from "gsap"

class NarrativeController {
    constructor(content) {
        this.content = content
        this.ui = document.querySelector("#narrative-controller")
        this.textContainer = document.querySelector("#narrative-controller .text-container")

        this.index = 0
        this.currentNode = this.content[this.index]
        this.nextBtn = this.ui.querySelector(".next-btn")
        this.closeBtn = this.ui.querySelector(".close-btn")

        this.nextBtn.addEventListener("click", this.nextNode.bind(this))
        this.closeBtn.addEventListener("click", this.close.bind(this))
        this.init()
    }

    init() {
    }

    displayNode(node) {
        this.textContainer.innerHTML = ''
        const textWrapper = document.createElement("p")
        gsap.set(this.textContainer, { opacity: 0})
        textWrapper.innerHTML = node.text
        this.textContainer.appendChild(textWrapper)
        gsap.to(this.textContainer, {opacity: 1})
    }
    nextNode() {
        this.index += 1
        this.displayNode(this.content[this.index] || {text:`node ${this.index+1}`, id: "id"})
    }
    
    open() {
        this.displayNode(this.content[this.index])
        gsap.to(this.ui, {autoAlpha: 1, pointerEvents: "auto"})
    }

    close() {
        this.index = 0
        gsap.to(this.ui, {autoAlpha: 0, pointerEvents: "none"})
    }
}

export default NarrativeController