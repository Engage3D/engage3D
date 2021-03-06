(function() {

    $(function() {
	var animate, bgColour, camT, camYRange, camZ, camZRange, camera, connect, currentOutArrayIdx, dataCallback, doCamPan, doCamZoom, down, drawControl, dvp, dynaPan, fgColour, h, i, inputH, inputW, k, kvp, outArrays, pLen, pMaterial, params, particle, particleSystem, particles, prevOutArrayIdx, projector, pvs, qbl, qbr, qtl, qtr, rawDataLen, renderer, scene, seenKeyFrame, setSize, startCamPan, stats, stopCamPan, sx, sy, togglePlay, useEvery, v, w, wls, x, xc, y, yc, _i, _len, _ref, _ref2, _ref3, _ref4;
	var iteration = 0;
	if (!(window.WebGLRenderingContext && document.createElement('canvas').getContext('experimental-webgl') && window.WebSocket && new WebSocket('ws://.').binaryType)) {
	    $('#noWebGL').show();
	    return;
	}
	params = {
	    stats: true,
	    fog: 0,
	    credits: 0,
	    ws: "ws://" + "localhost:9000"
	};
	console.log("debug: " + params.ws);
	wls = window.location.search;
	_ref = wls.substring(1).split('&');
	for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	    kvp = _ref[_i];
	    _ref2 = kvp.split('='), k = _ref2[0], v = _ref2[1];
	    params[k] = k === 'ws' ? v : parseInt(v);
	}
	if (params.credits) $('#creditOuter').show();
	if (true) {
	    stats = new Stats();
	    stats.domElement.id = 'stats';
	    document.body.appendChild(stats.domElement);
	} 
	bgColour = 0x000000;
	fgColour = 0xffffff;
	inputW = 632;
	inputH = 480;
	useEvery = 1;

	w = inputW / useEvery;
	h = inputH / useEvery;
	Transform.prototype.t = Transform.prototype.transformPoint;
	v = function(x, y, z) {
	    return new THREE.Vector3(x, y, z);
	};
	renderer = new THREE.WebGLRenderer({
	    antialias: true
	});
	camera = new THREE.PerspectiveCamera(60, 1, 1, 10000);
	dvp = (_ref3 = window.devicePixelRatio) != null ? _ref3 : 1;
	setSize = function() {
	    renderer.setSize(window.innerWidth * dvp, window.innerHeight * dvp);
	    renderer.domElement.style.width = window.innerWidth + 'px';
	    renderer.domElement.style.height = window.innerHeight + 'px';
	    camera.aspect = window.innerWidth / window.innerHeight;
	    return camera.updateProjectionMatrix();
	};
	setSize();
	$(window).on('resize', setSize);
	document.body.appendChild(renderer.domElement);
	renderer.setClearColorHex(bgColour, 1.0);
	renderer.clear();

	projector = new THREE.Projector();
	scene = new THREE.Scene();
	scene.add(camera);
	if (params.fog) scene.fog = new THREE.FogExp2(bgColour, 0.00033);
	pMaterial = new THREE.ParticleBasicMaterial({
	    //color: fgColour,
	    vertexColors:false,
	    size: useEvery * 3.5
	});

	//particles = new THREE.Geometry();
	var geom = new THREE.BufferGeometry();
	var numpoints = inputW*inputH;
	var numtris = (inputW-1)*(inputH-1)*2;
	geom.attributes = {
	    index: {
		itemSize: 1,
		array: new Uint16Array( numtris * 3),
		numItems: numtris * 3
	    },
	    position: {
		itemSize: 3,
		array: new Uint8Array( numpoints*3 ),
		numItems: numpoints*3
	    }
	    //,
	    // color: {
	    //     itemSize: 3,
	    //     array: new Float32Array( triangles * 3 * 3);
	    //     numItems: triangles * 3 * 3;
	    // }
	}

	geom.dynamic=true;


	var positions = geom.attributes.position.array;
	var i=0;
	// node x,y,0
	for (y = 0; y < h;  y++) {
	    for (x = 0; x < w; x++ ) {
		xc = (x - (w / 2)) * useEvery * 2;
		yc = ((h / 2) - y) * useEvery * 2;
		
		positions[i] = xc;
		positions[i+1] = yc;
		positions[i+2] = 0;

		i += 3;
	    }
	}
	console.log("positions filled: " + i + "/" + numpoints*3);

	var indices = geom.attributes.index.array;
	
	i=0;
	// build triangles
	for (y = 0; y < h-1;  y++) {
	    for (x = 0; x < w-1; x++ ) {
		yw = y*w;
		yw1 = (y+1)*w;
		x1 = x+1;

		indices[i] = yw+x;
		indices[i+1] = yw1+x;
		indices[i+2] = yw+x1;
		
		indices[i+3] = yw1+x;
		indices[i+4] = yw1+x1;
		indices[i+5] = yw+x1;
		
		for (var ind=0; ind <6; ind++)
		{
		    if (indices[i+ind] > positions.length)
			console.log("illegal index: "+ indices[i+ind])
		}
		
		i+=6;
	    }
	}
	console.log("indices filled: " + i + "/" + numtris*3);
	
	geom.offsets=[];
	geom.offsets.push({start:0, index:0, count:1});

	//mesh = new THREE.Mesh(geom);
	mesh = new THREE.ParticleSystem(geom, pMaterial);

	//particleSystem = new THREE.ParticleSystem(particles, pMaterial);
	// particleSystem = new THREE.ParticleSystem(particles);

	scene.add(mesh);
	togglePlay = function() {};

	down = false;
	dynaPan = 0;
	sx = sy = 0;
	camZRange = [2000, 200];
	camZ = 880;
	camYRange = [-600, 600];
	camT = new Transform();
	animate = function() {
	    var _ref4;
	    renderer.clear();
	    _ref4 = camT.t(0.01 * camZ * dynaPan, camZ), camera.position.x = _ref4[0], camera.position.z = _ref4[1];
	    camera.lookAt(scene.position);
	    renderer.render(scene, camera);
	    window.requestAnimationFrame(animate, renderer.domElement);
	    if (params.stats) return stats.update();
	};
	animate();
	startCamPan = function(ev) {
	    down = true;
	    sx = ev.clientX;
	    return sy = ev.clientY;
	};
	$(renderer.domElement).on('mousedown', startCamPan);
	stopCamPan = function() {
	    return down = false;
	};
	$(renderer.domElement).on('mouseup', stopCamPan);
	doCamPan = function(ev) {
	    var camY, dx, dy, rotation;
	    if (down) {
		dx = ev.clientX - sx;
		dy = ev.clientY - sy;
		rotation = dx * 0.0005 * Math.log(camZ);
		camT.rotate(rotation);
		camY = camera.position.y;
		camY += dy * 3;
		if (camY < camYRange[0]) camY = camYRange[0];
		if (camY > camYRange[1]) camY = camYRange[1];
		camera.position.y = camY;
		sx += dx;
		return sy += dy;
	    }
	};
	$(renderer.domElement).on('mousemove', doCamPan);
	doCamZoom = function(ev, d, dX, dY) {
	    camZ -= dY * 40;
	    camZ = Math.max(camZ, camZRange[1]);
	    return camZ = Math.min(camZ, camZRange[0]);
	};
	$(renderer.domElement).on('mousewheel', doCamZoom);
	seenKeyFrame = null;
	qtl = qtr = qbl = qbr = null;
	// pvs = particles.vertices;
	// pLen = pvs.length;
	rawDataLen = 5 + 4*pLen;
	//console.log(pLen);
	outArrays = (function() {
	    var _results;
	    _results = [];
	    for (i = 0; i <= 1; i++) {
		_results.push(new Uint8Array(new ArrayBuffer(rawDataLen)));
	    }
	    return _results;
	})();
	_ref4 = [0, 1], currentOutArrayIdx = _ref4[0], prevOutArrayIdx = _ref4[1];


    });

}).call(this);
