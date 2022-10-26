
const ncname = `[a-zA-Z ][\\-\\.0-9_a-zA-Z]*`; // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?: 匹配但不捕获
const startTagOpen = new RegExp(`^<${qnameCapture}`); // // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^’]*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

// 生成 ast
export function parseHTML(html) {
	let root;
	let currentParent;
	let stack = [];
	// // 解析开始标签
	function start(tagName, attrs) {
		let element = createASTElement(tagName, attrs);
		if (!root) {
			root = element;
		}
		currentParent = element;
		stack.push(element);
	}
 
	// 结束标签 创建父子关系 
	function end(endTag) {
        let element = stack.pop();
		currentParent = stack[stack.length - 1]; // 吧子元素 = currentParent
		if(currentParent){
			element.parent = currentParent; // 标签的 父元素
			currentParent.children.push(element); // 子元素
		}
	}

	// //文本
	function chars(text) {
		text = text.trim();
		if(text){
			currentParent.children.push({
				type:3,
				text
			});
		}
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

	// html 存在一直执行 这里负责吧 html 处理成 ast 树 
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
	}
	// 截取字符串
	function advance(n) {
		html = html.substring(n);
	}

    // 处理自定义属性 和 tagName
	function parseStartTag() {
		const start = html.match(startTagOpen);
		if (start) {
			const match = {
				tagName: start[1], // 标签名
				attrs: [],
			};
			advance(start[0].length);
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
