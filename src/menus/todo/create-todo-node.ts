import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor'

/**
 * 创建一个todo元素节点
 * @param $orginElem 需要别替换为todo的节点
 */
function createTodo($orginElem?: DomElement): DomElement {
    let checked = false
    let content: DomElement = $orginElem?.childNodes()?.clone(true) as DomElement

    const $targetElem = $(
        `<ul style="margin:0;"><li style="list-style:none;"><input type="checkbox" style="margin-right:3px;"></li></ul>`
    )
    const input = $targetElem.childNodes()?.childNodes()?.getNode()
    const $input = $(input)
    if (content) {
        content.insertAfter($input)
    }

    // 设置checkbox点击状态的保存
    $input.on('click', () => {
        if (checked) {
            $input?.removeAttr('checked')
        } else {
            $input?.attr('checked', '')
        }
        checked = !checked
    })

    return $targetElem
}

/**
 * 判断传入的单行顶级选区选取是不是todo
 * @param editor 编辑器对象
 */
function isTodo($topSelectElem: DomElement) {
    const topName = $topSelectElem?.getNodeName()
    if (topName === 'UL') {
        // input所在的dom节点位置
        const childName = $topSelectElem.childNodes()?.childNodes()?.getNodeName()
        return childName === 'INPUT'
    }
}
/**
 * 判断选中的内容是不是都是todo
 * @param editor 编辑器对象
 */
function isAllTodo(editor: Editor) {
    const $topSelectElems = editor.selection.getSelectionRangeTopNodes(editor)
    // 排除为[]的情况
    if ($topSelectElems.length === 0) return

    return $topSelectElems.every($topSelectElem => {
        const topName = $topSelectElem?.getNodeName()
        if (topName === 'UL') {
            // input所在的dom节点位置
            const childName = $topSelectElem.childNodes()?.childNodes()?.getNodeName()
            return childName === 'INPUT'
        }
    })
}

export { createTodo, isTodo, isAllTodo }
