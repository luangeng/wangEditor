import Editor from '../../../editor/index'
import $, { DomElement } from '../../../utils/dom-core'
import { isTodo, isAllTodo } from '../util'
import createTodo from '../todo'

/**
 * todolist 内部逻辑
 * @param editor
 */
function bindEvent(editor: Editor) {
    /**
     * todo的自定义回车事件
     * @param e 事件属性
     */
    function todoEnter(e: Event) {
        // 判断是否为todo节点
        if (isAllTodo(editor)) {
            console.log(editor.selection.getSelectionContainerElem())

            // e.preventDefault()
            const $topSelectElem = editor.selection.getSelectionRangeTopNodes(editor)[0]
            const $selectElem = editor.selection.getSelectionContainerElem() as DomElement
            const todo = createTodo($selectElem)
            const $newTodo = todo.getTodo()
            $newTodo.insertAfter($topSelectElem)
            editor.selection.moveCursor($newTodo.getNode())
            $selectElem.remove()

            // if ($topSelectElem.text() === '') {
            //     const $p = $(`<p><br></p>`)
            //     $p.insertAfter($topSelectElem)
            //     editor.selection.moveCursor($p.getNode(), 0)
            //     $topSelectElem.remove()
            //     return
            // }
            // // console.log(editor.selection.getRange())
            // // console.log($selectElem)
            // const selectionNode = editor.selection.getSelection()?.anchorNode as Node
            // console.log(editor.selection.getSelection()?.anchorNode)
            // console.log(selectionNode)
            // const $p = $(`<p></p>`)
            // const p = $p.getNode() as Node
            // dealText(selectionNode, p)
            // console.log(p)
            // console.log(selectionNode?.nextSibling)
            // const cursorPos: number =
            //     selectionNode?.nodeName === '#text'
            //         ? (editor.selection.getCursorPos() as number)
            //         : 0
            // console.log(cursorPos)
            // let content
            // // 处理回车后光标有内容的部分
            // if ($selectElem?.text().length !== cursorPos && cursorPos >= 0) {
            //     console.log($selectElem?.text().length)
            //     const txt = $selectElem?.text().slice(cursorPos)
            //     const orginTxt = $selectElem?.text().slice(0, cursorPos) as string
            //     const textNode = $selectElem?.childNodes()?.getNode(1)
            //     // 不带样式的文本内容需要特殊处理
            //     textNode ? (textNode.nodeValue = orginTxt) : $selectElem?.text(orginTxt)
            //     content = $(`<p>${txt}</p>`)
            // } else if ($topSelectElem.text() === '') {
            //     const $p = $(`<p><br></p>`)
            //     $p.insertAfter($topSelectElem)
            //     editor.selection.moveCursor($p.getNode(), 0)
            //     $topSelectElem.remove()
            //     return
            // }
            // const todo = createTodo(content)
            // const $newTodo = todo.getTodo()
            // const $newTodoChildren = $newTodo.childNodes()?.getNode() as Node
            // if (!content) {
            //     const $input = $newTodo.childNodes()?.childNodes() as DomElement
            //     const $br = $(`<br>`)
            //     $br.insertAfter($input)
            // }

            // $newTodo.insertAfter($topSelectElem)
            // !content
            //     ? editor.selection.moveCursor($newTodoChildren, 1)
            //     : editor.selection.moveCursor($newTodoChildren)
        }
    }
    /**
     * todo的自定义删除事件
     * @param e 事件属性
     */
    function todoDel(e: Event) {
        const $topSelectElem = editor.selection.getSelectionRangeTopNodes(editor)[0]
        if (isTodo($topSelectElem)) {
            if ($topSelectElem.text() === '') {
                console.log($topSelectElem)
                e.preventDefault()
                const $p = $(`<p><br></p>`)
                $p.insertAfter($topSelectElem)
                editor.selection.saveRange()
                // 兼容firefox下光标位置问题
                editor.selection.moveCursor($p.getNode())
                $topSelectElem.remove()
            }
        }
    }

    /**
     * 删除事件up时，对处于第一行的todo进行特殊处理
     */
    function delUp() {
        const $topSelectElem = editor.selection.getSelectionRangeTopNodes(editor)[0]
        const nodeName = $topSelectElem.getNodeName()
        if (nodeName === 'UL') {
            if ($topSelectElem.text() === '' && !isTodo($topSelectElem)) {
                $(`<p><br></p>`).insertAfter($topSelectElem)
                $topSelectElem.remove()
            }
        }
    }

    editor.txt.eventHooks.enterUpEvents.push(todoEnter)
    editor.txt.eventHooks.deleteDownEvents.push(todoDel)
    editor.txt.eventHooks.deleteUpEvents.push(delUp)
}

export default bindEvent
