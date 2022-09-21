enum Portrait {
    WORTH = 'worth',
    POST = 'post'
}

const portraitConfig = {
    worth: {
        title: '价值观画像',
        tableHeader: { 0: '价值观', 1: '价值观描述', 2: '价值观标签', 3: '操作' },
        addText: '添加价值观',
        fieldName: 'valuesList',
        placeholder: '请输入价值观（按Enter搜索）'
    },
    post: {
        title: '岗位画像',
        tableHeader: { 0: '岗位', 1: '岗位描述', 2: '岗位标签', 3: '操作' },
        addText: '添加岗位',
        fieldName: 'positions',
        placeholder: '请输入岗位（按Enter搜索）'
    }
}


export { portraitConfig }