/**
 * @description video 菜单 panel tab 配置
 * @author tonghan
 */

import Editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'
import post from '../../editor/upload/upload-core'
import Progress from '../../editor/upload/progress'
import { ResType } from '../img/upload-img'

export default function (editor: Editor, video: string): PanelConf {
    // panel 中需要用到的id
    const inputIFrameId = getRandom('input-iframe')
    const btnOkId = getRandom('btn-ok')

    const upTriggerId = getRandom('up-trigger-id')
    const upFileId = getRandom('up-file-id')
    const config = editor.config
    const hooks = config.uploadMp4Hooks

    let uploadMp4Server = editor.config.uploadMp4Server
    let videoAttr = editor.config.uploadVideoAttr

    /**
     * 插入链接
     * @param iframe html标签
     */
    function insertVideo(video: string): void {
        var v =
            `<p><video ` +
            videoAttr +
            `width="60%"><source src="` +
            video +
            `" type="video/mp4"></video><br></p>`
        editor.cmd.do('insertHTML', v)
    }

    const conf = {
        width: 300,
        height: 0,

        // panel 中可包含多个 tab
        tabs: [
            {
                // tab 的标题
                title: '上传视频',
                // 模板
                tpl: `<div class="w-e-up-img-container">
                <div id="${upTriggerId}" class="w-e-up-btn">
                    <i class="w-e-icon-upload2"></i>
                </div>
                <div style="display:none;">
                    <input id="${upFileId}" type="file" multiple="multiple" accept="video/mp4"/>
                </div>
            </div>`,
                // 事件绑定
                events: [
                    // 触发选择
                    {
                        selector: '#' + upTriggerId,
                        type: 'click',
                        fn: () => {
                            const $file = $('#' + upFileId)
                            const fileElem = $file.elems[0]
                            if (fileElem) {
                                fileElem.click()
                            } else {
                                // 返回 true 可关闭 panel
                                return true
                            }
                        },
                    },
                    // 选择完毕
                    {
                        selector: '#' + upFileId,
                        type: 'change',
                        fn: () => {
                            const $file = $('#' + upFileId)
                            const fileElem = $file.elems[0]
                            const timeout = 10 * 60 * 1000
                            if (!fileElem) {
                                // 返回 true 可关闭 panel
                                return true
                            }

                            // 获取选中的 file 对象列表
                            const fileList = (fileElem as any).files
                            const formData = new FormData()
                            formData.append('file', fileList[0])
                            formData.append('filename', fileList[0].name)
                            if (fileList.length) {
                                const xhr = post(uploadMp4Server, {
                                    timeout,
                                    formData,
                                    headers: undefined,
                                    withCredentials: true,
                                    beforeSend: xhr => {
                                        if (hooks.before) return hooks.before(xhr, editor, fileList)
                                    },
                                    onTimeout: xhr => {
                                        window.alert('上传视频超时')
                                    },
                                    onProgress: (percent, e) => {
                                        const progressBar = new Progress(editor)
                                        if (e.lengthComputable) {
                                            percent = e.loaded / e.total
                                            progressBar.show(percent)
                                        }
                                    },
                                    onError: xhr => {
                                        window.alert('上传视频出错：' + xhr.status)
                                    },
                                    onFail: (xhr, resultStr) => {
                                        window.alert(
                                            '上传视频出错：' + xhr.status + ' ' + resultStr
                                        )
                                    },
                                    onSuccess: (xhr, result: ResType) => {
                                        if (result.errno != '0') {
                                            window.alert('上传视频出错：' + result.errno)
                                            return
                                        }
                                        const data = result.data
                                        insertVideo(data[0])
                                        // 钩子函数
                                        if (hooks.success) hooks.success(xhr, editor, result)
                                    },
                                })
                                if (typeof xhr === 'string') {
                                    // 上传被阻止
                                    window.alert(xhr)
                                }
                            }

                            // 返回 true 可关闭 panel
                            return true
                        },
                    },
                ],
            },
            {
                // tab 的标题
                title: editor.i18next.t('menus.panelMenus.video.插入视频'),
                // 模板
                tpl: `<div>
                    <input 
                        id="${inputIFrameId}" 
                        type="text" 
                        class="block" 
                        placeholder="请输入视频地址"/>
                    </td>
                    <div class="w-e-button-container">
                        <button id="${btnOkId}" class="right">
                            ${editor.i18next.t('插入')}
                        </button>
                    </div>
                </div>`,
                // 事件绑定
                events: [
                    // 插入视频
                    {
                        selector: '#' + btnOkId,
                        type: 'click',
                        fn: () => {
                            // 执行插入视频
                            const $video = $('#' + inputIFrameId)
                            let video = $video.val().trim()
                            // 视频为空，则不插入
                            if (!video) return
                            insertVideo(video)
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        },
                    },
                ],
            }, // tab end
        ], // tabs end
    }

    return conf
}
