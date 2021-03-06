LiveModel = function() {

    var inputH = 480;
    var inputW = 632;// sizes from kinect


    var offh = inputH/2;
    var offw = inputW/2;

    var vh = 160;// make sure inpuH/W are evenly
    var vw = 158;// divisible by vh/vw


    // var vh = 200;
    // var vw = 200;

    // var vh = 200;// defines number of faces
    // var vw = 300;
    // var vh = 40;// defines number of faces
    // var vw = 50;


    var dy = inputH / (vh-1);
    var dx = inputW / (vw-1);


    var model = new THREE.Geometry();
    model.dynamic = true;

    var vertices;
    var i,j

    for (j=vh-1; j>=0; j--) {	// server loads points bottom to top
		for (i=0; i<vw; i++) {

		    var x = ((i*dx)-offw)*2;
		    var y = ((j*dy)-offh)*2;

		    model.vertices.push(new THREE.Vector3(x,y,0));
		}
    }

    var vertexCount = model.vertices.length;

    // var x;
    // var minx=inputW,maxx=-inputW,miny=inputH,maxy=inputH;
    // for (v=0; v<vertexCount; v++)
    // {
    // 	if (model.vertices[v].x < minx) minx = model.vertices[v].x;
    // 	if (model.vertices[v].x > maxx) maxx = model.vertices[v].x;
    // 	if (model.vertices[v].y < miny) miny = model.vertices[v].y;
    // 	if (model.vertices[v].y > maxy) maxy = model.vertices[v].y;
    // }

    // console.log("bounds: " + minx + " - " + maxx + ";" + miny + " - " + maxy);

    var minu=10,minv=10,maxu=-10,maxv=-10;

    for (j=0; j<vh-1; j++) {
     	for (i=0; i<vw-1; i++) {

	    var a = j*vw+i;
	    var b = (j+1)*vw+i;
	    var c = (j*vw+i+1);
	    var d = (j+1)*vw+i+1;
	    
	    var iu = 1/vw;
	    var ju = 1/vh;

	    model.faces.push( new THREE.Face3(a,b,c) );
	    model.faces.push( new THREE.Face3(c,b,d) );
	    
	    var _ax = 0.5*(model.vertices[a].x+inputW)/inputW;
	    var _ay = 0.5*(model.vertices[a].y+inputH)/inputH;
	    var _bx = 0.5*(model.vertices[b].x+inputW)/inputW;
	    var _by = 0.5*(model.vertices[b].y+inputH)/inputH;
	    var _cx = 0.5*(model.vertices[c].x+inputW)/inputW;
	    var _cy = 0.5*(model.vertices[c].y+inputH)/inputH;
	    var _dx = 0.5*(model.vertices[d].x+inputW)/inputW;
	    var _dy = 0.5*(model.vertices[d].y+inputH)/inputH;

	    
	    if (_ax < minu) minu=_ax;
	    if (_ax > maxu) maxu=_ax;
	    if (_bx < minu) minu=_bx;
	    if (_bx > maxu) maxu=_bx;
	    if (_cx < minu) minu=_cx;
	    if (_cx > maxu) maxu=_cx;
	    if (_ay < minv) minv=_ay;
	    if (_ay > maxv) maxv=_ay;
	    if (_by < minv) minv=_by;
	    if (_by > maxv) maxv=_by;
	    if (_cy < minv) minv=_cy;
	    if (_cy > maxv) maxv=_cy;
	    

	    // model.faceVertexUvs[0].push( [ new THREE.Vector2(0,0),
	    // 				   new THREE.Vector2(1,1),
	    // 				   new THREE.Vector2(1,0) ] );
	    // model.faceVertexUvs[0].push( [ new THREE.Vector2(0,0),
	    // 				   new THREE.Vector2(1,1),
	    // 				   new THREE.Vector2(1,0) ] );

	    // model.faceVertexUvs[0].push( [ new THREE.Vector2(-(vw-i)/vw,.5*(vh-j)/vh),
	    // 				   new THREE.Vector2(-(vw-i)/vw,.5*(vh-j-1)/vh),
	    // 				   new THREE.Vector2(-(vw-i-1)/vw,.5*(vh-j)/vh) ] );
	    // model.faceVertexUvs[0].push( [ new THREE.Vector2(-(vw-i-1)/vw,.5*(vh-j)/vh),
	    // 				   new THREE.Vector2(-(vw-i)/vw,.5*(vh-j-1)/vh),
	    // 				   new THREE.Vector2(-(vw-i-1)/vw,.5*(vh-j-1)/vh) ] );

	    model.faceVertexUvs[0].push( [ new THREE.Vector2(_ax,_ay),
	    				   new THREE.Vector2(_bx,_by),
	    				   new THREE.Vector2(_cx,_cy) ] );
	    model.faceVertexUvs[0].push( [ new THREE.Vector2(_cx,_cy),
	    				   new THREE.Vector2(_bx,_by),
	    				   new THREE.Vector2(_dx,_dy) ] );



		}
    }
    
    console.log("uv bounds: " + minu + " - " + maxu + ";" + minv + " - " + maxv);

    THREE.GeometryUtils.normalizeUVs(model);

    //model.computeBoundingSphere();
    // model.computeFaceNormals();
    // model.computeVertexNormals();
    // model.computeTangents();
    // model.tangentsNeedUpdate = true;
    // model.normalsNeedUpdate = true;
    // model.uvsNeedUpdate = true;
    

    // var material = new THREE.MeshBasicMaterial( { map : new THREE.Texture() } );
    //var material = new THREE.MeshBasicMaterial();
    // material.wireframe = true;
    // material.color=new THREE.Color(0x0F0F0F);
    // new THREE.DataTexture([], inputW, inputH, THREE.RGBFormat);

    var initColor = new THREE.Color( 0x00ff00 );
    // initColor.setHSV( 0.25, 0.85, 0.5 );

    var texture = THREE.ImageUtils.generateDataTexture(inputW, inputH, initColor );
    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(25,25);
    // texture.anisotropy = 16;

    var material = new THREE.MeshBasicMaterial( { map : texture });
    // var material = new THREE.MeshPhongMaterial( 
    // 	{ map : texture, color: 0xffffff, specular: 0x111111 }
    // );
    var faceMesh = new THREE.Mesh(model, material);
    // faceMesh.receiveShadow = true;

    this.sceneContents = function() {
	return faceMesh;
    };


    // WEBSOCKET STUFF

    var numVerts = vh* vw;
    var numData = inputH * inputW;

    // update geometry when data buffer arrives
    var dataCallback = function(e) {
    	var bytes = new Uint8Array(e.data);

    	pd = [bytes[1], bytes[2], bytes[3], bytes[4]];


    	var pIdx = 0;
    	var byteIdx = 5;
    	var rgbByteIdx = numData+5;

		// image data to texture the mesh
		texture.image.data = bytes.subarray(rgbByteIdx);
		// console.log("image data: " + texture.image.data.length );

		texture.needsUpdate = true;
		//material.needsUpdate = true;
		

		var v=0;
		var x,y;

		var skipY = numData/vh;
		var skipX = inputW / vw;
		//console.log("skipX: " + skipX + "; skipY: " + skipY);
		var mindepth=1000;
		var maxdepth=-1000;

		for (y=0; y<vh; y++) {
		    for (x=0; x<vw; x++) {
			
			var abyte= bytes[byteIdx+x*skipX];

			var depth = abyte/128 * 1000;

			if (abyte > maxdepth) maxdepth=abyte;
			if (abyte < mindepth) mindepth=abyte;
			
			model.vertices[v].setZ(1000-depth);
			v = v+1;
		    }
		    
		    byteIdx+=skipY;
		}

    	model.verticesNeedUpdate = true;
    	return true;
    };

    var ws;
    this.connect = function(url) {
		var reconnectDelay, OF_BACKEND, opt;

	    OF_BACKEND = true;
	    
	    opt = {
			url: 'localhost',
			port: '9001',
			protocol: 'of-protocol',
			on_update: undefined,
			on_open: undefined,
			on_close: undefined
	    };    	

	    reconnectDelay = 10;
    	console.log("Connecting to " + url + " ...");
		
    	if(OF_BACKEND)
		    ws = new WebSocket('ws://'+opt.url+':'+opt.port+'/', opt.protocol );
    	else
    	    ws = new WebSocket(url);

    	ws.binaryType = 'arraybuffer';
    	seenKeyFrame = false;
    	ws.onopen = function() {
    	    return console.log('Connected');
    	};
    	ws.onclose = function() { // TODO: fix the reconnect
    	    console.log("Disconnected: retrying in " + reconnectDelay + "s");
    	    return setTimeout(this.connect, 10);
    	};
    	console.log('.');
    	ws.onmessage = dataCallback;
    };

    this.sendSlider = function(sliderValue){
	  var msg = {
		    type: "message",
		    depthCenter: parseInt(sliderValue),
					};
    	ws.send(JSON.stringify(msg));

    }
    var framerate_value = 10;
    var depthfocus_value = 5000;

 	var StreamController = function() {
		  this.framerate = framerate_value;
		  this.depthfocus = depthfocus_value;

		  this.displayOutline = false;
	};
	console.log(ws);
	window.onload = function() {
		var text = new StreamController();
		var gui = new dat.GUI(); 
		var sc_directives = {
			type: "message",
			depthfocus: depthfocus_value,
			framerate: framerate_value
		}
		var depth_controller = gui.add(text, 'depthfocus', 1, 10000);
		var framerate_controller = gui.add(text, 'framerate', 1,30);

		depth_controller.onFinishChange(function(value) {
		  // Fires when a controller loses focus.
		  value = Math.floor(value);
		  depthfocus_value = value;
		  sc_directives.depthfocus = depthfocus_value;
		  console.log('sending msg', sc_directives)
		  ws.send(JSON.stringify(sc_directives));
		});	

		framerate_controller.onFinishChange(function(value) {
		  // Fires when a controller loses focus.
		  value = Math.floor(value);
		  framerate_value = value;
		  sc_directives.framerate = framerate_value;
		  console.log('sending msg', sc_directives)
		  ws.send(JSON.stringify(sc_directives));
		});	
	};


    
    var pd=[];			// pan data -- TODO: get rid of this
    this.panData = function() { return pd; }


}