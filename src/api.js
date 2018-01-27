const getRandomNum = function(start = 0, end = 1){
	let num = Math.random()*(end - start);
	num = start + num;
	num = ~~num;
	return num;
}

const getRgba = function(){
	const r = getRandomNum(0,255);
	const g = getRandomNum(0,255);
	const b = getRandomNum(0,255);
	return `rgba(${r},${g},${b},.8)`;
}

const getStatus = function(){
	const num = Math.random();
	if(num >= 0.7){
		return 1;
	} else if(num >= 0.3){
		return -1;
	} else {
		return 0;
	}
}
export default{
	getRandomNum,
	getRgba,
	getStatus,
}
