
let id = 0;
class Dep {
    constructor () {
        this.subs = [];
        this.id = id++;
    }
    depend(){
        // this.subs.push(Dep.target);
        Dep.target.addDep(this); // 让watcher 记住 dep 让dep 记住 watcher
    }
    notify(){
        console.log(this.subs);
        this.subs.forEach((watcher) => {
            watcher.update();
        });
    }
    addSub(watcher){
        this.subs.push(watcher);
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
