import serve from 'rollup-plugin-serve';
import babel from 'rollup-plugin-babel';

export default {
    input:'./src/index.js',
    output:{
        format:'umd', // 表示模块化的类型
        name:'Vue' , // 全局变量名字
        file:'dist/umd/vue.js',
        sourcemap:true
    },
    plugins:[
        babel({
            exclude:'node_modules/**'
        }),
        serve({
            // open:true
            port:3000,
            contentBase:'',
            openPage:'/index.html'
        })
    ]
}