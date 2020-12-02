import { createTodo } from '../../../src/menus/todo/create-todo-node'
import $ from '../../../src/utils/dom-core'

test('创建空todo', () => {
    const todo = createTodo()
    expect(todo.selector).toEqual(
        `<ul style="margin:0;"><li style="list-style:none;"><input type="checkbox" style="margin-right:3px;"></li></ul>`
    )
})

test('创建带内容todo', () => {
    const p = $(`<p>test</p>`)
    const todo = createTodo(p)
    expect(todo.elems[0].outerHTML).toEqual(
        `<ul style="margin:0;"><li style="list-style:none;"><input type="checkbox" style="margin-right:3px;">test</li></ul>`
    )
})

test('创建带样式的内容的todo', () => {
    const p = $(`<p><b>test</b></p>`)
    const todo = createTodo(p)
    expect(todo.elems[0].outerHTML).toEqual(
        `<ul style="margin:0;"><li style="list-style:none;"><input type="checkbox" style="margin-right:3px;"><b>test</b></li></ul>`
    )
})
