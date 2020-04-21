//全局方法
import Vue from "vue";
import { Toast } from "vant";
Vue.use(Toast);

/* Toast 提示窗
 * @param {string} message
 * @param {Number | null} duration
 * @param {string | null} icon
 */
export function msg(message, duration = 1500, icon = "none") {
	if (Boolean(message) === false) {
		return;
	}
	Toast(message, {
		duration,
		icon
	});
}