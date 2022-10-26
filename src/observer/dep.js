 class Dep {
    constructor () {
        this.subs = [];
    }
    depend(){
        this.subs.push(Dep.target);
    }
    notify(){
        this.subs.forEach((watcher) => watcher.update());
    }
}


export function pushTarget (watcher) {
    Dep.target = watcher; //保留watcher
}

export function popTarget () {
    Dep.target = null;// 删除watcher
}

// 多对多 一个属性有一个dep  （dep 是 用来收集watcher的）
// dep 可以存 多个 watcher 
//  一个watcher 可以 对应 多个 dep

export default Dep;
