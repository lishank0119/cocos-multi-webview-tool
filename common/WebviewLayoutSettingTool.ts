const heightList = [25, 50, 100];
const colsList = [1, 2, 3, 4, 6, 8];

export type WebviewLayoutSettingType = {
    heightKey: number
    colCountKey: number
}

const defaultSetting: WebviewLayoutSettingType = {
    colCountKey: 0,
    heightKey: 2
}

export default {
    heightList,
    colsList,
    defaultSetting,
}