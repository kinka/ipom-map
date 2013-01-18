/*
 * @description 生成各省中心坐标, 用于标注省名
 */
function getCenter(path, province) {
	var points = path.split(' '),
		cx = 0,
		cy = 0,
		trueLen = 0;
	for(var i=0, len=points.length; i<len; i++) {
		var p = points[i];
		if(p) {
			trueLen++;
			p = p.split(',');
			cx += parseFloat(p[0]);
			cy += parseFloat(p[1]);
		}
	}
	cx /= trueLen;
	cy /= trueLen;
	
	switch(province) {
		case 'beijing':
		cy -= 5;
		break;
		case 'hebei':
		cy += 20;
		cx -= 5;
		break;
		case 'tianjin':
		cx += 20;
		cy += 5;
		break;
		case 'neimenggu':
		cy += 20;
		break;
	}
	return {x: cx.toFixed(2), y: cy.toFixed(2)}
}

var paper = Raphael(0, 0, 800, 800);
var china = {};
var paths = kk.provincePath,
	centers = kk.provinceCenter,
	labels = kk.provinceLabel;

paper.ca.hue = function(num) {
	num = num % 1;
	var hsb = 'hsb(' + num + ', 0.75, 1)';
	return {fill: hsb, stroke: hsb};
}

for(var p in paths) {
	var path = paths[p],
		color = '',
		center = centers[p],
		text = null;

	switch(p) {
	case 'beijing':
		color = 'red';
		break;
	case 'tianjin':
		color = 'gold';
		break;
	default:
		color = Raphael.getColor();
	}
	var r = g = b = (Math.random()*1000).toFixed(0)%256;
	color = Raphael.rgb(255-r, 255-g, 255-b);
	
	china[p] = paper.path('M' + path).attr({
		// fill: color,
		hue: Math.random() % 0.5,
		// stroke: color,
		'stroke-opacity': 1,
		'stroke-width': 2,
		'fill-opacity': 0.8,
		title: labels[p]
	});

	text = paper.text(center.x, center.y, labels[p]+r).attr({
		'font-size': '16',
		'fill': 'black'
	}).hide();
	china[p].text = text;
}

var anim = Raphael.animation({'fill-opacity': 0.5}, 1e3, 'bounce', function() {
		this.animate({'fill-opacity': 0.8}, 1e3, 'bounce');
	});
function f_in() {
	this.attr({'stroke-width': 5}).toFront();	
	if(this==china.hebei) {
		china.tianjin.toFront();
		china.beijing.toFront();
	}
	this.animate(anim);
}

function f_out() {
	this.stop(anim);
	this.attr({'stroke-width': 2, 'fill-opacity': 0.8});
}

for(var p in china) {
	var province = china[p];

	province.hover(f_in, f_out);
}

function mouseover(a, b, c, d) {
	console.log(a, b, c, d)
	this.text.show();
}

/*
M300,200 h-150 a150,150 0 1,0 150,-150 z
指令a:
rx ry x-axis-rotation large-arg-flag sweep-flag x y
水平半径,垂直半径, 是否以X轴旋转,是否大弧, 是否顺时针, 最终X坐标,最终Y坐标
 */
function sector(cx, cy, r, startAngle, endAngle) {
    var rad = Math.PI / 180;
    var x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad);
    return ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"];
}

function fan(deg, gap) {
	var path = sector(200, 200, 100, deg-gap, deg);
	paper.path(path).attr({
		'fill': 'hsl('+deg+'deg, 1, 0.5)', 
		'stroke-width': 0,
		'stroke-opacity': 0
	});
}
/*
var gap = 2;
for(var i=0; i<360; i+=gap) {
	fan(i, gap);
}
for(var i=0; i<100; i+=gap) {
	paper.rect(0, i, 100, gap).attr({
		'fill': 'hsl('+(i/100)+', 0.75, 0.5)',
		'stroke-width': 0
	});
}
*/