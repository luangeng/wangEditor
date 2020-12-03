import $, { DomElement } from '../../utils/dom-core'
export class todo {
    template: string
    checked: boolean
    $todo: DomElement
    $child: DomElement
    constructor($orginElem?: DomElement) {
        this.template = `<ul style="margin:0 0 0 20px;position:relative;"><li style="list-style:none;"><span style="position: absolute;left: -18px;top: 2px;" contenteditable="false"><input type="checkbox" style="margin-right:3px;"></span></li></ul>`
        this.checked = false
        this.$todo = $(this.template)
        this.$child = $orginElem?.childNodes()?.clone(true) as DomElement
    }

    public init() {
        let checked = this.checked
        const $input = this.getInput()
        const $child = this.$child
        const $inputContainer = this.getInputContainer()

        if ($child) {
            $child.insertAfter($inputContainer)
        }

        $input.on('click', () => {
            if (checked) {
                $input?.removeAttr('checked')
            } else {
                $input?.attr('checked', '')
            }
            checked = !checked
        })
    }

    public getInput() {
        const $todo = this.$todo
        const input = $todo.childNodes()?.childNodes()?.childNodes()?.getNode()
        return $(input)
    }

    public getInputContainer() {
        const $todo = this.$todo
        const inputContainer = $todo.childNodes()?.childNodes()?.getNode()
        return $(inputContainer)
    }

    public getTodo() {
        return this.$todo
    }
}

function createTodo($orginElem?: DomElement) {
    const t = new todo($orginElem)
    t.init()
    return t
}

export default createTodo
