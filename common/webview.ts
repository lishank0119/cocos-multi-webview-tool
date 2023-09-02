export type WebviewType = {
    url: string
    id: number
    pid?: number
    webContentID?: number
    frameID?: number
    gameMonitor?: GameMonitorType
    cpuUsage: ProfileInfoType
    memoryUsage: ProfileInfoType
}

export type ProfileRecord = {
    value: number
    time: string
};

export type GameMonitorType = {
    stats: StatsType
    messageList: string[]
}

export type ProfileInfoType = {
    start: number
    end?: number
    value: number
    avg: number
    count?: number
    list: ProfileRecord[]
}

export type AppMetricsType = {
    key: string
    pid: number
    name: string
    processType: string
    creationTime: string
    percentCPUUsage: string
    percentMemoryUsage: string
    webviewId?: number
    gameMonitor?: GameMonitorType
    cpuUsage?: ProfileInfoType
    memoryUsage?: ProfileInfoType
}

export type StatsType = {
    fps: ProfileInfoType & { lowFpsList: ProfileRecord[] } & Required<Pick<ProfileInfoType, "count">>
    frame: ProfileInfoType
    logic: ProfileInfoType
    physics: ProfileInfoType
    render: ProfileInfoType
    draws: number
    instances: number
    triCount: number
    textureMemory: number
    bufferMemory: number
    renderer: string
}

export enum CleanGameMonitorEnum {
    lowFpsList,
    messageList
}

