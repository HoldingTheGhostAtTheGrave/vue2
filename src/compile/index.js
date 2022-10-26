// ast 可以描述 dom css js (ast 描述代码)
// 虚拟dom 只能描述 dom 层面不一样
import { generate } from "./generate";
import { parseHTML } from "./parse";

export function compileToFunctions(template) {
	// 1. 需要将 html 转换成ast 抽象语法树

	// 前端要掌握的数据结构 (树)
	let ast = parseHTML(template); //
	// 2. 需要将ast树重新生成 html
	let code = generate(ast);

	// 将字符串变成函数 限制取值范围 通过 with 来进行取值 通过改变this 让这个函数内部获取到结果
	let render = new Function(`with( this ){ return ${code} }`);

	return render;

}
