import {contextBridge, ipcRenderer, IpcRendererEvent} from "electron";
import Channel from "../../common/Channel";
import {CleanGameMonitorEnum, GameMonitorType, ProfileInfoType} from "../../common/webview";


const gameMonitor: GameMonitorType = {
    stats: {
        fps: {start: 0, count: 0, value: 0, avg: 0, list: [], lowFpsList: []},
        frame: {start: 0, end: 0, value: 0, avg: 0, list: []},
        logic: {start: 0, end: 0, value: 0, avg: 0, list: []},
        physics: {start: 0, end: 0, value: 0, avg: 0, list: []},
        render: {start: 0, end: 0, value: 0, avg: 0, list: []},
        draws: 0,
        instances: 0,
        triCount: 0,
        textureMemory: 0,
        bufferMemory: 0,
        renderer: ""
    },
    messageList: []
};

const maxListLength = 40;

const gameListen = {
    beforeUpdate() {
        const now = performance.now();
        gameMonitor.stats.frame.start = now;
        gameMonitor.stats.logic.start = now;
    },
    afterUpdate(isGamePaused: boolean) {
        const now = performance.now();
        if (isGamePaused) {
            gameMonitor.stats.frame.start = now;
        } else {
            calculateProfile(gameMonitor.stats.logic, now);
        }
    },
    beforePhysics() {
        gameMonitor.stats.physics.start = performance.now();
    },
    afterPhysics() {
        calculateProfile(gameMonitor.stats.physics, performance.now());
    },
    beforeDraw() {
        gameMonitor.stats.render.start = performance.now();
    },
    afterDraw(draws: number, instances: number, bufferMemory: number, textureMemory: number, triCount: number, renderer: string) {
        const now = performance.now();
        calculateProfile(gameMonitor.stats.frame, now);
        calculateProfileFps(now);
        calculateProfile(gameMonitor.stats.render, now);
        gameMonitor.stats.draws = draws;
        gameMonitor.stats.instances = instances;
        gameMonitor.stats.bufferMemory = bufferMemory;
        gameMonitor.stats.textureMemory = textureMemory;
        gameMonitor.stats.triCount = triCount;
        gameMonitor.stats.renderer = renderer;
    }
}

function calculateProfile(profile: ProfileInfoType, end: number) {
    profile.end = end;
    const value = profile.end - profile.start;

    if (profile.list.length >= maxListLength) {
        profile.list.shift();
    }

    profile.list.push({
        value: value,
        time: formatterTime(new Date())
    });

    calculateProfileAvg(profile);

    profile.value = value;
}

function formatterTime(date: Date) {
    const minutes = (date.getMinutes() + "").padStart(2, "0");
    const seconds = (date.getSeconds() + "").padStart(2, "0");
    return `${date.getHours()}:${minutes}:${seconds}`
}

function calculateProfileAvg(profile: ProfileInfoType) {
    const total = profile.list.map(item => item.value).reduce((a, b) => a + b);
    profile.avg = total / profile.list.length;
}

function calculateProfileFps(now: number) {
    if (gameMonitor.stats.fps.start == 0) {
        gameMonitor.stats.fps.start = now;
        return;
    }

    gameMonitor.stats.fps.count++;

    const time = now - gameMonitor.stats.fps.start;
    if (time < 1000) {
        return;
    }

    const ratio = 1000 / time;
    const fps = Math.round((ratio * gameMonitor.stats.fps.count));
    gameMonitor.stats.fps.count = 0;
    gameMonitor.stats.fps.start = now;

    if (gameMonitor.stats.fps.list.length >= maxListLength) {
        gameMonitor.stats.fps.list.shift();
    }

    gameMonitor.stats.fps.list.push({
        value: fps,
        time: formatterTime(new Date())
    });

    if (fps < 20) {
        gameMonitor.stats.fps.lowFpsList.push({
            value: Number(fps.toFixed(0)),
            time: new Date().toLocaleString()
        });
    }

    calculateProfileAvg(gameMonitor.stats.fps);

    gameMonitor.stats.fps.value = fps;
}

contextBridge.exposeInMainWorld("electron", {
    on(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) {
        ipcRenderer.on(channel, listener)
    },
    ipc: ipcRenderer,
    gameListen: gameListen,
});

ipcRenderer.on(Channel.REGISTER_WEBVIEW_INFO, (_, webviewId: number, webContentsId: number) => {
    ipcRenderer.send(Channel.UPDATE_WEBVIEW_INFO, webviewId, webContentsId, gameMonitor);
})

window.addEventListener("load", () => {

    //叫electron通知webview註冊資訊
    ipcRenderer.send(Channel.REGISTER_WEBVIEW_INFO);

    //1秒傳送30次gameMonitor 資訊
    setInterval(() => {
        ipcRenderer.send(Channel.GAME_MONITOR, gameMonitor);
    }, 1000 / 30);

    ipcRenderer.on(Channel.CLEAN_GAME_MONITOR,
        (_: IpcRendererEvent, type: CleanGameMonitorEnum) => {
            switch (type) {
                case CleanGameMonitorEnum.lowFpsList:
                    gameMonitor.stats.fps.lowFpsList = [];
                    break;
                case CleanGameMonitorEnum.messageList:
                    gameMonitor.messageList = [];
                    break;
            }
        });
});
