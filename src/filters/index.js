//全局过滤器，格式化工具
/**
 * 时间格式化
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null;
	}
	const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
	let date;
	if (typeof time === "object") {
		date = time;
	} else {
		if (typeof time === "string" && /^[0-9]+$/.test(time)) {
			time = parseInt(time);
		}
		if (typeof time === "number" && time.toString().length === 10) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	};
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if (key === "a") {
			return ["日", "一", "二", "三", "四", "五", "六"][value];
		}
		return value.toString().padStart(2, "0");
	});
	return time_str;
}

/**
 * 字符串超出显示省略号
 * @param {string} value
 * @param {Number | null} number
 */
export function ellipsis(value ,number){
	if (!value) return '';
	if (value.length > number) {
		return value.slice(0,number) + '...'
	}
	return value
}

/**
 * 距离格式化显示km
 * @param {Number} distance  
 * 弃用
 */
// export function distanceFormat(distance) {
// 	let dis = Math.round(distance);
// 	if (dis < 1000) {
// 		distance = dis + "m";
// 	} else {
// 		distance = Math.round(dis / 100) / 10 + "km";
// 	}
// 	return distance;
// }