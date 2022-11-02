
// 将虚拟节点转换为真实节点
export function patch (oldVnode , vnode) {
    // 默认初始化时 是用虚拟节点 创建真实的节点
    if(oldVnode.nodeType == 1){ 
        let el = createEle(vnode);
        let parentEl = oldVnode.parentNode;
        parentEl.insertBefore(el , oldVnode.nextSibling);
        parentEl.removeChild(oldVnode); // 删除老的节点
        return el;
    }else{
    // 更新时用老的虚拟节点 和新的 虚拟节点作对比 将不同的地方 更新真实dom 
        // 1. 比较两个 元数的 标签
        if(oldVnode.tag !== vnode.tag){
            return oldVnode.el.parentNode.replaceChild( createEle(vnode) , oldVnode.el ); // 不一样替换
        }
        // 2.标签一样 两个文本 虚拟节点的 tag 是相等的
        if(!oldVnode.tag){ // 文本的比对
            if(oldVnode.text !== vnode.text){
                return oldVnode.el.textContent = vnode.text;
            }
        }

        //3. 标签一样 并且需要开始比对标签属性和儿子了
        // 标签可以直接复用
        let el = vnode.el = oldVnode.el;

        // 更新属性 用新的虚拟节点属性 和老的 比较 去更新节点 新老属性作对比
        updatePropertions(vnode , oldVnode.data);



        // 儿子的比较 步骤
        let oldChildren = oldVnode.children || [];
        let newChildren = vnode.children || [];
        // 老的 有children 新的 也有 
        if(oldChildren.length > 0 && newChildren.length > 0){
            updateChildren(oldChildren , newChildren , el );
        }else if(oldChildren.length > 0){   
            // 新的没有 
            el.innerHTML = '';
        }else if(newChildren.length > 0){
            // 老的没有
            for (let index = 0; index < newChildren.length; index++) {
                el.appendChild(createEle(newChildren[index]));
            }
        }


    }
}

function isSameVnode(oldVnode , newVnode) {
    return (oldVnode.tag == newVnode.tag) && (oldVnode.key == newVnode.key);
}


// 儿子的diff 比较
function updateChildren (oldChildren , newChildren , parent){
    // vue 中的diff 处理了很多优化

    // 循环 同时循环老的和新的 那个先结束 循环就停止 将多的删除 或者添加

    // 开头指针
    let oldStartIndex = 0; // 老的索引
    let oldStartVnode = oldChildren[0]; // 老的索引指向 的 节点
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex]; 

    let newStartIndex = 0; // 新的索引
    let newStartVnode = newChildren[0]; // 新的索引指向 的 节点
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex]; 


    let map = makeIndexbyKey(oldChildren);

    // 比较谁先循环完 停止
    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){    
        if(!oldStartVnode){ 
            // oldStartVnode 当前值为null 跳过当次 
            oldStartVnode = oldStartVnode[++oldStartIndex]; 
        }else if(!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex]; 
        }else
        // 1. 老头部 和 新头去比较
        if(isSameVnode(oldStartVnode , newStartVnode)){// 如果两个是 一样的 元素
            patch(oldStartVnode ,newStartVnode ); //更新属性和再去递归更新子节点
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else
        // 2. 老尾部 和 新尾去比较
        if(isSameVnode(oldEndVnode,newEndVnode)){
            patch(oldEndVnode ,newEndVnode ); //更新属性和再去递归更新子节点
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        }else 
        // 3. 老的头 和 新的尾去比
        if(isSameVnode(oldStartVnode , newEndVnode)){
            patch(oldStartVnode ,newEndVnode );
            parent.insertBefore(oldStartVnode.el , oldEndVnode.el.nextSibling); // 插入 old 紧跟的下一个
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        }else
        // 4. 老的尾 和 新的头去比较
        if(isSameVnode(oldEndVnode , newStartVnode)){
            patch(oldEndVnode ,newStartVnode );
            parent.insertBefore(oldEndVnode.el , oldStartVnode.el); // 插入 old 紧跟的下一个
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];
        }
        // 儿子之间没关系 暴力比对
        else{
            let moveIndex = map[newStartVnode.key]; // 拿倒开头的虚拟节点的key  去老的中找


            // 不需要移动 没有复用的 key 
            if(moveIndex == undefined){
                parent.insertBefore(createEle(newStartVnode) , oldStartVnode.el); // 插入 old 紧跟的下一个
            }else{
                let moveVNode = oldChildren[moveIndex]; // 这个老的虚拟节点需要移动 
                oldChildren[moveIndex] = null;
                parent.insertBefore(moveVNode.el , oldStartVnode.el); // 插入 old 紧跟的下一个
                patch(moveVNode , newStartVnode); // 比较属性
            }

            newStartVnode = newChildren[++newStartIndex];
        }
    }   
    if(newStartIndex <= newEndIndex){
        // 当 oldStartIndex 或者 newStartIndex 循环结束得到结束往后的索引的值进行处理
        for (let index = newStartIndex; index <= newEndIndex; index++) {
            // parent.appendChild(createEle(newChildren[index]));
            let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
            parent.insertBefore(createEle(newChildren[index]) , ele);
        }
    }

    // 老的节点剩余未处理的 说明 新的节点不存在 该节点 
    if(oldStartIndex <= oldEndIndex){
        for (let index = oldStartIndex; index <= oldEndIndex; index++) {
            let child = oldChildren[index];
            if(child != undefined) {
                parent.removeChild(child.el);
            }
        }
    }

    // old key 映射表
    function makeIndexbyKey (oldChildren) {
        let map = {};
        oldChildren.forEach((item , index) => {
            if(item.key){
                map[item.key] = index;
            }
        });
        return map;
    }

}

// 生成真实dom
export function createEle (vnode ){
    const {tag , data , children , text} = vnode;
    if( typeof tag === 'string'){
        vnode.el = document.createElement(tag);
        
        // 处理样式
        updatePropertions(vnode);

        children.forEach(element => {
            vnode.el.appendChild(createEle(element));
        });
    } else {
        vnode.el = document.createTextNode(text);
        
    }
    return vnode.el;
}

 function updatePropertions (vnode ,oldProps = {}) {
    const { el , data:newProps = {} } = vnode;

    // 样式处理
    let newStyle = newProps.style || {};
    let oldStyle = oldProps.style || {};

    // 老的有 新的没有
    for (const key in oldProps) {
        if(!newProps[key]){
            el.removeAttribute(key); // 删除真实 dom 的属性
        }
    }

    // 老的样式中有  新的没有  删除老的样式
    for (const key in oldStyle) {
        if(!newStyle[key]){
            el.style[key] = ''; // 删除老的样式
        }
    }

    for (const key in newProps) {
        // 设置样式
        if(key === 'style'){
            for (const styleKey in newProps[key]) {
                el.style[styleKey] = newProps[key][styleKey];
            }
        } else if(key === 'class'){
            el.className = newProps[key];
        }else{
            el.setAttribute(key, newProps[key]);
        }
    }
}

// vue 渲染流程  1. 初始化数据  2. 模板编译  3. 生成 render 函数  4. 生成虚拟节点  5.生成真实节点  6.替换页面