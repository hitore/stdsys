const fs = require('fs');
const dirName = 'index';  // your new dir name
const url = `./src/view/${dirName}`;
const init = [
				{
					url: `${url}/${dirName}.vue`,
					content: '<template></template>\r<script></script>\r<style></style>',
				}
			];

fs.mkdir(url, function(err) {
	if (err) {
		console.log(err);
	}
	console.log(`目录${url}创建成功`);
	init.forEach(item => {
		fs.writeFile(item.url, item.content, function(err) {
			if (err) {
				console.log(err);
			}
			console.log(`${item.url}已创建,${item.url}已初始化`);
		});
	});
});
