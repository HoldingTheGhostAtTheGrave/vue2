const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配 {{}} 内容

function genProps (attrs) {
    let str = '';
    for (let index = 0; index < attrs.length; index++) {
        let attr = attrs[index];
        if(attr.name ==='style'){
            let obj = {};
            attr.value.split(';').forEach(element => {
                let [key , value] = element.split(':');
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${ attr.name }:${ JSON.stringify(attr.value) },`;
    }
    return `{${str.slice(0,-1)}}`;
}

function gen (node){
    if(node.type == 1){
        return generate(node); //生成元素节点
    }else{
        let text = node.text;
        // 如果是普通文本 直接返回处理
        if(defaultTagRE.test(text)){
            let tokens = []; // 存放每一段代码
            let lastIndex = defaultTagRE.lastIndex = 0; // 如果正则是全局模式 每次使用前都需要更改 为 0 （不然会导致匹配不到）
            let match , index;

            // defaultTagRE.exec(text) 捕获到 是否存在匹配到的值
            while (match = defaultTagRE.exec(text)) {
                index = match.index; // 保存匹配到的索引
                if(index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex , index)));
                }
                tokens.push(`_s(${ match[1].trim() })`);
                lastIndex = index + match[0].length;
            }

            if(lastIndex < text.length){
                tokens.push(JSON.stringify( text.slice(lastIndex) ));
            }
            return `_v(${ tokens.join('+') })`;
        }else{
            return `_v(${ JSON.stringify(text) })`;
        }
        
    }
}


function genChildren (children) {
    if(children){
        return children.map((child) => gen(child)).join(',');
    }
}

export function generate (ast) {
    let children = genChildren(ast.children);
    let code = `_c('${ast.tag}',${ 
        ast.attrs.length ? `${genProps(ast.attrs)}` : 'undefined'
    }${
        ast.children ? `,${children}` : ''
    })`;

    return code;
}