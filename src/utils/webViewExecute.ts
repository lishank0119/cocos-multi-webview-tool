export const WebViewExecute = () => {

    return js;
}

const js = `
    try {
      setTimeout(()=>{
        ${gameProfileJS()}   
      },1000)
    }catch (e) {
                
    }
`;

function gameProfileJS() {
    return `
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, () => {
            window.electron.gameListen.beforeUpdate();
        });
        
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, () => {
            window.electron.gameListen.afterUpdate(cc.director.isPaused());
        });
        
        cc.director.on(cc.Director.EVENT_BEFORE_PHYSICS, () => {
            window.electron.gameListen.beforePhysics();
        });
        
        cc.director.on(cc.Director.EVENT_AFTER_PHYSICS, () => {
            window.electron.gameListen.afterPhysics();
        });
        
        cc.director.on(cc.Director.EVENT_BEFORE_DRAW, () => {
            window.electron.gameListen.beforeDraw();
        });
        
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, () => {
            const draws = cc.director.root.device.numDrawCalls;
            const instances = cc.director.root.device.numInstances;
            const bufferMemory = cc.director.root.device.memoryStatus.bufferSize / (1024 * 1024);
            const textureMemory = cc.director.root.device.memoryStatus.textureSize / (1024 * 1024);
            const triCount = cc.director.root.device.numTris;
            
            window.electron.gameListen.afterDraw(draws, instances, bufferMemory, textureMemory, triCount, cc.director.root.device.renderer);
        });
    `
}
