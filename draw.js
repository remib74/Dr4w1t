// configs
const CENTERED = true;
let COLOR = '#33AACC80';
let THICKNESS = 50;

function tThick(){
th=document.getElementById('range').value;

THICKNESS=th;
}
function tOpak(){
    opa=document.getElementById('opak').value;

    
    COLOR=opa;
    }

let width, height, currentPath, lastDraw;
const svg = document.querySelector('svg');
const setSize = (w, h) => {
	width = w, height = h;
	svg.setAttribute('width', width);
	svg.setAttribute('height', height);
	svg.setAttribute('viewBox', `${CENTERED ? width * -0.5 : 0} ${CENTERED ? height * -0.5 : 0} ${width} ${height}`);
};
svg.addEventListener('mousedown', () => {
	currentPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	currentPath.setAttribute('stroke', COLOR);
	currentPath.setAttribute('stroke-width', THICKNESS);
	currentPath.setAttribute('fill', 'none');
	svg.appendChild(currentPath);
});
svg.addEventListener('mouseup', () => currentPath = null);
svg.addEventListener('mousemove', ({ clientX, clientY }) => {
	if(!currentPath) return;
	let d = currentPath.getAttribute('d');
	const x = CENTERED ? clientX - width * 0.5 : clientX;
	const y = CENTERED ? clientY - height * 0.5 : clientY;
	currentPath.setAttribute('d', d ? d + ` L${x},${y}` : `M${x},${y}`);
});
const onResize = () => setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', onResize);
window.addEventListener('load', onResize);

/*save function*/
const createStyleElementFromCSS = () => {
	// JSFiddle's custom CSS is defined in the second stylesheet file
	const sheet = document.styleSheets[1];
  
	const styleRules = [];
	for (let i = 0; i < sheet.cssRules.length; i++)
	  styleRules.push(sheet.cssRules.item(i).cssText);
  
	const style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode(styleRules.join(' ')))
  
	return style;
  };
  const style = createStyleElementFromCSS();
  
  const download = () => {
	// fetch SVG-rendered image as a blob object
	const svg = document.querySelector('svg');
	svg.insertBefore(style, svg.firstChild); // CSS must be explicitly embedded
	const data = (new XMLSerializer()).serializeToString(svg);
	const svgBlob = new Blob([data], {
	  type: 'image/svg+xml;charset=utf-8'
	});
	  style.remove(); // remove temporarily injected CSS
  
	// convert the blob object to a dedicated URL
	const url = URL.createObjectURL(svgBlob);
  
	// load the SVG blob to a flesh image object
	const img = new Image();
	img.addEventListener('load', () => {
	  // draw the image on an ad-hoc canvas
	  const bbox = svg.getBBox();
  
	  const canvas = document.createElement('canvas');
	  canvas.width = bbox.width;
	  canvas.height = bbox.height;
  
	  const context = canvas.getContext('2d');
	  context.drawImage(img, 0, 0, bbox.width, bbox.height);
  
	  URL.revokeObjectURL(url);
  
	  // trigger a synthetic download operation with a temporary link
	  const a = document.createElement('a');
	  a.download = 'image.png';
	  document.body.appendChild(a);
	  a.href = canvas.toDataURL();
	  a.click();
	  a.remove();
	});
	img.src = url;
  };