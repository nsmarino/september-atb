import gsap from "gsap";

// print updates to game state below battle div, to help with dev
function log(text) {
    const para = document.createElement("p")
    para.innerText = text
    const logEl = document.querySelector(".log")
    logEl.insertBefore(para, logEl.firstChild)
}

export default class BattleController {
    constructor() {
        this.members = []
        this._phase = "start"
        this._activeMember = null

        this.draftPlayerAction = null // makes it possible to select a target. selecting a target adds the draft action to this.actions

        this.actionInProgress = false
        this.actions = [] // queue of actions, both by players and enemies; atb does not increase when actions are being handled.

        document.querySelectorAll(".actionBtn")
            .forEach((btn) =>
                btn.addEventListener("click", this.handleButtonClick.bind(this)));

        document.querySelectorAll(".battleMember .avatar")
            .forEach((avatar) =>
                avatar.addEventListener("click", this.handleAvatarClick.bind(this)));

        this.bindMethods()
        this.initMembers()
        this.loop()

    }
    bindMethods() {
        ['initMembers', 'update', 'handleButtonClick', 'handleAvatarClick', 'handleAction', 'handleNPC', 'loop']
            .forEach(fn => this[fn] = this[fn].bind(this));
    }

    initMembers() {
        const memberEls = document.querySelectorAll(".battleMember")
        memberEls.forEach(el => {
            const member = new BattleMember(el)
            this.members.push(member)
        })
    }

    update() {
        switch(this._phase) {
            case "start":
                log("The battle has started.")
                this._phase = "check"
                break;
            case "check":
                if (this.members.find(mem=>mem.hp == 0)) {
                    this._phase = "endBattle"
                    return;
                } else if (this.actions.length>0 && this.actionInProgress) {
                    return;
                } else if (this.actions.length>0 && !this.actionInProgress) {
                    this.handleAction(this.actions[0]);
                } else {
                    this._phase = "update"
                }
                break;
            case "update": // only runs if no actions in queue and no one has died
                this.members.forEach(member=>{
                    if (member.ready && !member.player) this.handleNPC(member)
                    member.updateMeter()
                })  
                this._phase = "check"                      
                break;
            case "endBattle":
                break;
            default:
                console.log("default")
        }
    }

    handleAction(action) {
        this.actionInProgress = true
        const actor = this.members.find(mem => mem.id == action.actor)
        const target = this.members.find(mem => mem.id == action.target)
        actor.updateAttribute("mp", action.mp)
        target.updateAttribute("hp", action.dmg)
        log(`${actor.name} has struck ${target.name} with ${action.name} for ${action.dmg} damage. Cost: ${action.mp} MP`)

        setTimeout(() => {
            actor.ready = false
            actor.progress = 0
            this.actions.shift() // Lol this feels like a bad idea
            this.actionInProgress = false
            actor.closeActionList()
        }, 2000)

    }

    handleNPC(member) {
        member.selectNPCAction((action) => {
            this.actions.push(action)
        })
    }

    handleButtonClick(e) {
        const id = e.target.closest(".battleMember").dataset.id
        this.draftPlayerAction = {
            name: e.target.dataset.name,
            dmg: e.target.dataset.dmg,
            mp: e.target.dataset.mp,
            actor: id,
        }
        log("Player has selected an action. Click on an enemy to attack them.")
    }

    handleAvatarClick(e) {
        const id = e.target.closest(".battleMember").dataset.id
        const actor = this.members.find(mem => mem.id == this.draftPlayerAction.actor)
        actor.closeActionList()
        const action = {...this.draftPlayerAction, target: id}
        this.actions.push(action)
        this.draftPlayerAction = null
    }

    loop() {
        if (this._phase !== "endBattle") {
            this.update()
            window.requestAnimationFrame(this.loop)
        } else {
            log("The battle has ended.")
        }
    }
}

class BattleMember {
    constructor(elem) {
        this.elem = elem
        this.name = this.elem.querySelector(".avatar").innerText

        this.id = this.elem.dataset.id
        this.hp = this.elem.dataset.hp
        this.mp = this.elem.dataset.mp
        this.speed = this.elem.dataset.speed
        this.progress = 0

        this.elem.querySelector(".total-hp").innerText = this.hp
        this.elem.querySelector(".current-hp").innerText = this.hp
        this.elem.querySelector(".total-mp").innerText = this.mp
        this.elem.querySelector(".current-mp").innerText = this.mp

        this.progressBar = this.elem.querySelector(".progress")
        gsap.set(this.progressBar, { width: `${this.progress}%`})

        this.actionList = this.elem.querySelector(".actionList")
        this.player = this.elem.dataset.player=="true" ? true : false
        this.ready = false

        this.closeActionList()
    }
    bindMethods() {
        ['updateMeter', 'updateAttribute', 'selectNPCAction', 'openActionList', 'closeActionList', 'handleReady']
            .forEach(fn => this[fn] = this[fn].bind(this));
    }

    updateMeter() {
        const increment = this.speed / 100
        this.progress = this.progress + increment
        if (this.progress >= 100) {
            gsap.set(this.progressBar, { width: `100%`})
            this.ready = true
            if (this.player) this.openActionList()

        } else {
            gsap.set(this.progressBar, { width: `${this.progress}%`})
        } 
    }

    updateAttribute(type, value) {
        const updatedAttribute = this[type] - value <= 0 ? 0 : this[type] - value
        this[type] = updatedAttribute
        this.elem.dataset[type] = updatedAttribute
        this.elem.querySelector(`.current-${type}`).innerText = updatedAttribute
    }

    selectNPCAction(sendAction){
        // hardcoded for dev
        const action = {
            name: "NPC Attack",
            dmg: 2,
            mp: 0,
            actor: this.id,
            target: "1"
        }
        sendAction(action)
    }

    openActionList() {
        gsap.to(this.actionList, {autoAlpha: 1})
    }
    closeActionList() {
        gsap.set(this.actionList, {autoAlpha: 0})
    }

}