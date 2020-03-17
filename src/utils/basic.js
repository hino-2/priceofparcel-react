export const getSafe = fn => {
    try {
        if (fn() !== undefined) {
            return fn();
        } else {
            return "";
        }
    } catch (e) {
        return "";
    }
}

export const format = (num) => {
	var str = num.toString(), parts = false, output = [], i = 1, formatted = null;
	if(str.indexOf(".") > 0) {
		parts = str.split(".");
		str = parts[0];
	}
	str = str.split("").reverse();
	for(var j = 0, len = str.length; j < len; j++) {
		if(str[j] !== " ") {
			output.push(str[j]);
			if(i%3 === 0 && j < (len - 1)) {
				output.push(" ");
			}
			i++;
		}
	}
	formatted = output.reverse().join("");
	return(formatted + ((parts) ? "." + parts[1].substr(0, 2) : ""));
}

export const formatDate = (date, type) => {
	var dd = date.getDate();
	var mm = date.getMonth() + 1;
	var res;
	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;

	switch(type) {
	case 1:
		res = date.getFullYear() + '-' + mm + '-' + dd;
		break;
	case 2:
		res = dd + '.' + mm + '.' + date.getFullYear();
		break;
	default:
		res = date.getFullYear() + '-' + mm + '-' + dd;
	}
	return res;
}

export const replaceAll = (string, search, replacement) => {
    return string.split(search).join(replacement);
}
