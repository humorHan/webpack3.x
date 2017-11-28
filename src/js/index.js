/**
 * Created by humorHan on 2017/11/22.
 */
import printMe from './print.js';
import 'index.scss';
let testTpl = require('index.tpl');

let main = {
    init: function () {
        $("body").append(testTpl([1, 2, 3]));
    }
};

$(function () {
    main.init();
});

if (module.hot) {
    module.hot.accept('./print.js', function () {
        console.log('Accepting the updated printMe module!');
        printMe();
    })
}