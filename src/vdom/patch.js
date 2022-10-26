
// 将虚拟节点转换为真实节点
export function patch (oldVnode , vnode) {

   let el = createEle(vnode);
   let parentEl = oldVnode.parentNode;
   parentEl.insertBefore(el , oldVnode.nextSibling);
   parentEl.removeChild(oldVnode); // 删除老的节点
   return el;
}

// 生成真实dom
function createEle (vnode){
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

function updatePropertions (vnode) {
    const { el , data:newProps } = vnode;
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