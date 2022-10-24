// ast 可以描述 dom css js (ast 描述代码)
// 虚拟dom 只能描述 dom 层面不一样

export function compileToFunctions(template) {
	// 1. 需要将 html 转换成ast 抽象语法树

	// 前端要掌握的数据结构 (树)
	let ast = parseHTML(template); //
	console.log(ast);
	// 2. 需要将ast树重新生成 html
}

const ncname = `[a-zA-Z ][\\-\\.0-9_a-zA-Z]*`; // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?: 匹配但不捕获
const startTagOpen = new RegExp(`^<${qnameCapture}`); // // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const defaultTagRE = /\{\{((?:|\r?\n)+?)\}\}/g; // 匹配 {{}} 内容
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的
const attribute =
	/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^’]*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

// 生成 ast
function parseHTML(html) {
	let root;
	// // 解析开始标签
	function start(tagName, attrs) {
		console.log(tagName, attrs, "解析开始标签");
		let element = createASTElement(tagName, attrs);
		if (!root) {
			root = element;
		}
	}

	// 结束标签
	function end(endTag) {
		console.log(endTag, "结束标签");
	}

	// //文本
	function chars(text) {
		console.log(text, "文本");
	}

	function createASTElement(tagName, attrs) {
		return {
			tag: tagName,
			type: 1,
			children: [],
			attrs,
			parent: null,
		};
	}

	// html 存在一直执行
	while (html) {
		let textEnd = html.indexOf("<");
		if (textEnd == 0) {
			// 肯定是标签 处理开始
			let startTagMatch = parseStartTag();
			if (startTagMatch) {
				start(startTagMatch.tagName, startTagMatch.attrs);
				continue;
			}
			// 处理结束
			const endTagMatch = html.match(endTag);
			if (endTagMatch) {
				advance(endTagMatch[0].length);
				end(endTagMatch[1]);
				continue;
			}
		}
		let text;
		// 处理文本
		if (textEnd > 0) {
			text = html.substring(0, textEnd);
		}
		if (text) {
			advance(text.length);
			chars(text);
		}
		break;
	}
	// 截取字符串
	function advance(n) {
		html = html.substring(n);
	}
	function parseStartTag() {
		const start = html.match(startTagOpen);
		if (start) {
			const match = {
				tagName: start[1], // 标签名
				attrs: [],
			};
			advance(start[0].length);
			console.log(html);
			let end;
			let attr;
			while (
				!(end = html.match(startTagClose)) &&
				(attr = html.match(attribute))
			) {
				match.attrs.push({
					name: attr[1],
					value: attr[3] || attr[4] || attr[5],
				});
				advance(attr[0].length); // 去掉属性
			}
			if (end) {
				advance(end[0].length);
				return match;
			}
		}
	}
	return root;
}
