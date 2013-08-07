			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var camera, scene, renderer;	// already in scene
			var meshObj, geometry, material, mesh;	// mesh obj
			var planeObj, pgeometry, pmaterial, plane, wireplane; // plane obj
			var lights, spotLight1, spotLight2, ambientLight, hemisphereLight, directionalLight; 
			var enviro;

			// CAM MOUSE VARZ
			var mouseX = 0, mouseY = 0;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			
			bg = document.body.style;
			bg.background = "#fff";
			var bgcode; // for console

			cnsl = document.getElementById('mcnsl').style;
			cnsl.opacity = 0.8;

			var CUSTOM_TEXTURE; // for including custom texturez via proxy


			// ---------------------------------------------------------------------------------------------------------------------------
			//
			//     DAT.GUI
			//
			// ---------------------------------------------------------------------------------------------------------------------------


			function addDatGui() {
				var gui = new dat.GUI();


			//                                    __________________
			// __________________________________/					\
			// 									    CODE FOLDER 	|
			// 	

			var c = gui.addFolder('code');
			c.add(codez,'selectMeshCode').name('select_code');
			c.add(codez,'background').onChange(function(v){
				if(v==true){
					var c = document.getElementById('mcnsl').style;
					c.background = "#fff";
				} else {
					var c = document.getElementById('mcnsl').style;
					c.background = "none";
				}
			});
			c.add(cnsl,'opacity',0,1);






			//                                    __________________
			// __________________________________/					\
			// 									    MESH FOLDER 	|
			// 														|
				var m = gui.addFolder('mesh');
				m.add(meshObj, 'geometry',{cube:0,sphere:1,icosahedron:2,octahedron:3,tetrahedron:4,cylinder:5,torus:6,knot:7,lathe:8,plane:9,circle:10,ring:11,randomConvex:12}).onChange(function(v) {
						meshObj.make();
						geometriezGUI(meshObj.geometry);
						if(matgui!=undefined){materialzGUI(meshObj.material);}
				});
				m.add(meshObj, 'material',{normal:0,basic:1,lambert:2,phong:3}).onChange(function(v) {
						meshObj.make();
						materialzGUI(meshObj.material);
				});
				m.add(meshObj,'openGeo').name('OPEN_GEOMETRY_CNTRL');
				m.add(meshObj,'openMat').name('OPEN_MATERIAL_CNTRL');

				m.add(meshObj,"smooth").onChange(function(){				
					meshObj.make(); 
				});
				m.add(meshObj,"castShadow").onChange(function(v){
					if(v==true){
						renderer.shadowMapEnabled = true;
						meshObj.make();
						if(planeObj.togglePlane==true){planeObj.makePlane();}	
						if(planeObj.toggleWireframe==true){ planeObj.makeWireframe(); }	
						if(lights.AmbientLight==true){lights.makeAmbient();}		
						if(lights.HemisphereLight==true){lights.makeHem();}				
						if(lights.DirectionalLight==true){lights.makeDir();}				
						if(lights.SpotLight1==true){lights.makeSpot1();}				
						if(lights.SpotLight2==true){lights.makeSpot2();}				

					} else {
						renderer.shadowMapEnabled = false;
						meshObj.make();
						if(planeObj.togglePlane==true){planeObj.makePlane();}	
						if(planeObj.toggleWireframe==true){ planeObj.makeWireframe(); }	
						if(lights.AmbientLight==true){lights.makeAmbient();}		
						if(lights.HemisphereLight==true){lights.makeHem();}				
						if(lights.DirectionalLight==true){lights.makeDir();}				
						if(lights.SpotLight1==true){lights.makeSpot1();}				
						if(lights.SpotLight2==true){lights.makeSpot2();}	
					}
					updateEnviroCode();
				});
				m.add(meshObj,"scale",0.1,2).onChange(function(){
					mesh.scale.x = mesh.scale.y = mesh.scale.z = meshObj.scale;
					updateMeshCode();
				});
				m.add(meshObj,"posy",0,200).onChange(function(){
					mesh.position.y = meshObj.posy; 
					updateMeshCode();
				});
				m.add(meshObj,"rotx",0,8).onChange(function(){
					mesh.rotation.x = meshObj.rotx;
					updateMeshCode();
				});
				m.add(meshObj,"roty",0,8).onChange(function(){
					mesh.rotation.y = meshObj.roty;
					updateMeshCode();
				});
				m.add(meshObj,"rotz",0,8).onChange(function(){
					mesh.rotation.z = meshObj.rotz;
					updateMeshCode();
				});
				m.open();




			//                                    __________________
			// __________________________________/					\
			// 									    PLANE FOLDER 	|
			// 														|
				var p = gui.addFolder('plane');
				var wftog = false, ptog = false;
				p.add(planeObj,'toggleWireframe').onChange(function(v){
					if(v==true){ planeObj.makeWireframe(); }
					else { scene.remove( wireplane ); }
					updateEnviroCode();

					if(planeObj.toggleWireframe == true && wftog == false){
						p.add(planeObj,'w_scale',1,30).onChange(function(){
							if(planeObj.toggleWireframe==true){ planeObj.makeWireframe(); }
							updateEnviroCode();
						});
						// p.add(planeObj,'w_line',1,10).onChange(function(){
						// 	if(planeObj.toggleWireframe==true){ planeObj.makeWireframe(); }
						// });	
						wftog = true;				
					}
				});

				p.add(planeObj,'togglePlane').onChange(function(v){
					if(v==true){ planeObj.makePlane(); }
					else { scene.remove( plane ); }
					updateEnviroCode();

					if(planeObj.togglePlane == true && ptog == false){
						p.add(planeObj, 'texture', {mario:0,linen:1,crate:2,dots:3,rock_tile:4,water:5,wood:6,white:7,brillo:8,soup:9}).onChange(function() {
							if(planeObj.togglePlane==true){ planeObj.makePlane(); }
							updateEnviroCode();
						});
						p.add(planeObj,'scale',1,30).onChange(function(){
							if(planeObj.togglePlane==true){ planeObj.makePlane(); }
							updateEnviroCode();
						});
						p.add(planeObj,'repeat',1,160).onChange(function(){
							if(planeObj.togglePlane==true){ planeObj.makePlane(); }
							updateEnviroCode();
						});		
						ptog = true;	
					}
				});






			//                                    __________________
			// __________________________________/					\
			// 									    ENVIRO FOLDER 	|
			// 														|
				var e = gui.addFolder('environment');
				var edeetz = false;
				// ****BUG**** Firefox throwing an error: 
				//uncaught exception: Failed to interpret color arguments
				if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){/*IS FIREFOX*/}
				else{
					e.addColor(bg, 'background').onChange(function(v){
						bgcode = v;
						updateEnviroCode();
					});
				}

				// e.add(enviro,'renderShadows').onChange(function(v){
				// 	if(v==true){
				// 		renderer.shadowMapEnabled = true;
				// 		meshObj.make();
				// 		if(planeObj.togglePlane==true){planeObj.makePlane();}	
				// 		if(planeObj.toggleWireframe==true){ planeObj.makeWireframe(); }					
				// 	} else {
				// 		renderer.shadowMapEnabled = false;
				// 		if(planeObj.togglePlane==true){planeObj.makePlane();}	
				// 		if(planeObj.toggleWireframe==true){ planeObj.makeWireframe(); }	
				// 	}
				// 	updateEnviroCode();
				// });
				e.add(enviro,'fog').onChange(function(v){
					if(v==true){
						enviro.ffar = 9000;
						enviro.makeFog();
						if(edeetz == false){
							e.addColor( enviro, 'fclr').name('color').onChange( function() {
							  	scene.fog.color.setHex( dec2hex(enviro.fclr) ); 
							  	updateEnviroCode();
							}); 
							e.add(enviro,'fnear',1,10000).name('near').onChange(function(){
								enviro.makeFog();
								updateEnviroCode();
							});
							e.add(enviro,'ffar',1,10000).name('far').onChange(function(){
								enviro.makeFog();
								updateEnviroCode();
							});
							edeetz = true;
						}
					} else {
						enviro.ffar = enviro.reset;
						enviro.makeFog();
					}
					updateEnviroCode();
				});




			//                                    __________________
			// __________________________________/					\
			// 									    LIGHTS FOLDER 	|
			// 														|
				var l = gui.addFolder('lights');
				// l.add(lights,'resetLights');
				l.add(lights,'AmbientLight').onChange(function(v){
					if(v==true){
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						lights.makeAmbient();
						lightGUI();
					} else {
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						scene.remove(ambientLight);
					}
					updateLightCode();
				});
				l.add(lights,'HemisphereLight').onChange(function(v){
					if(v==true){
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						lights.makeHem();
						lightGUI();
					} else {
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						scene.remove(hemisphereLight);
					}
					updateLightCode();
				});
				l.add(lights,'DirectionalLight').onChange(function(v){
					if(v==true){
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						lights.makeDir();
						lightGUI();
					} else {
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						scene.remove(directionalLight);
					}
					updateLightCode();
				});
				l.add(lights,'SpotLight1').onChange(function(v){
					if(v==true){
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						lights.makeSpot1();
						lightGUI();
					} else {
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						scene.remove(spotLight1);
					}
					updateLightCode();
				});
				l.add(lights,'SpotLight2').onChange(function(v){
					if(v==true){
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						lights.makeSpot2();
						lightGUI();
					} else {
						if(lightgui!=undefined){lightgui.destroy(); lightgui = undefined;}
						scene.remove(spotLight2);
					}
					updateLightCode();
				});
				l.add(lights,'open').name('OPEN_LIGHT_CONTROL');

			}


			// ---------------------------------------------------------------------------------------------------------------------------
			//
			//     XTRA DAT.GUI[s]
			//
			// ---------------------------------------------------------------------------------------------------------------------------


			// MATERIALZ GUI
			// --------------------------------------------------------
			var matgui;
			function materialzGUI(v) {

				if(matgui!=undefined){ matgui.destroy(); matgui = undefined; }
				
				matgui = new dat.GUI();

				if(v==1 || v==2 || v==3){
					matgui.addColor( meshObj, 'color').onChange( function() {
						mesh.material.color.setHex( dec2hex(meshObj.color) ); 
						updateMeshCode();
					}); 
				}
				if(v==3){
					matgui.addColor( meshObj, 'ambient').onChange( function() {
					  	mesh.material.ambient.setHex( dec2hex(meshObj.ambient) ); 
					  	updateMeshCode();
					}); 
					matgui.addColor( meshObj, 'emissive').onChange( function() {
					  	mesh.material.emissive.setHex( dec2hex(meshObj.emissive) ); 
					  	updateMeshCode();
					}); 
					matgui.addColor( meshObj, 'specular').onChange( function() {
					  	mesh.material.specular.setHex( dec2hex(meshObj.specular) ); 
					  	updateMeshCode();
					}); 
					matgui.add(meshObj,'shininess',-30,100).onChange( function() {
					  	mesh.material.shininess = meshObj.shininess; 
					  	updateMeshCode();
					});
				} 

				matgui.add(meshObj,'wireframe').onChange(function(v) {
					meshObj.make();
					if(matgui!=undefined){ materialzGUI(meshObj.material); }
				}); 
				if(meshObj.wireframe == true){
					matgui.add(meshObj,'linewidth',1,8).onChange(function(v) {
						meshObj.make(); 
					}); 
				}

				matgui.add(meshObj,'transparent').onChange(function(v) {
					meshObj.make();
					if(matgui!=undefined){ materialzGUI(meshObj.material); }
				}); 
				if(meshObj.transparent==true){
					matgui.add(meshObj,'opacity',0,1).onChange(function(v) {
						meshObj.make(); 
					}); 					
				}

				if(meshObj.geometry == 5){
					matgui.add(meshObj,'cyliOE').name('openEnded').onChange(function(){
						meshObj.make();
					});
				}
				matgui.add(meshObj,"sided",{FrontSide:0,BackSide:1,DoubleSide:2}).onChange(function(){				
					meshObj.make(); 
				});
				if(v==1 || v==2 || v==3){
					matgui.add(meshObj,"texture").onChange(function(){				
						meshObj.make(); 
						if(matgui!=undefined){ matgui.destroy(); matgui = undefined; }
						meshObj.openMat();
					});
				}
				if(meshObj.texture==true){
					matgui.add(meshObj, 'txt', {white:0, mario:1,linen:2,crate:3,dots:4,rock_tile:5,water:6,wood:7, brillo:8,soup:9}).onChange(function() {
						CUSTOM_TEXTURE = undefined;
						meshObj.make();
					}).name('texture');
					matgui.add(meshObj,'txtRepeat',1,10).onChange(function(){
						meshObj.make();
					});
					matgui.add(meshObj,'customTexture').name('custom_texture');

				}

				matgui.add(meshObj,'closeMat').name('[X]-CLOSE');

			}


			// GEOMETRIEZ GUI
			// --------------------------------------------------------
			var geogui;
			function geometriezGUI(v) {

				if(geogui!=undefined){ geogui.destroy(); geogui = undefined; }
				
				geogui = new dat.GUI();

				if(v==0){
					geogui.add(meshObj,'cubeW',1,500).name('width').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'cubeH',1,500).name('height').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'cubeD',1,500).name('depth').onChange(function(){
						meshObj.make();
					});
				}
				else if(v==1){
					geogui.add(meshObj,'sphereR',1,200).name('radius').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'sphereSW',3,150).name('segmentsWidth').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'sphereSH',2,150).name('segmentsHeight').onChange(function(){
						meshObj.make();
					});
				}
				else if(v==2 || v==3 || v==4){
					geogui.add(meshObj,'radius',1,200).onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'detail',0,4).step(1).onChange(function(){
						meshObj.make();
					});
				}
				else if(v==5){
					geogui.add(meshObj,'cyliRT',1,200).name('radiusTop').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'cyliRB',1,200).name('radiusBottom').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'cyliH',1,400).name('height').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'cyliRS',2,75).step(1).name('radiusSegments').onChange(function(){
						meshObj.make();
					});
					// geogui.add(meshObj,'cyliHS',2,75).step(1).name('heightSegments').onChange(function(){
					// 	meshObj.make();
					// });
				}
				else if(v==6){
					geogui.add(meshObj,'torusR',1,200).name('radius').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'torusT',1,200).name('tube').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'torusRS',1,40).name('radialSegments').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'torusTS',2,40).step(1).name('tubularSegments').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'torusA',1,15).step(1).name('arc').onChange(function(){
						meshObj.make();
					});
				}
				else if(v==7){
					geogui.add(meshObj,'knotR',1,200).name('radius').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'knotT',1,200).name('tube').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'knotRS',2,100).step(1).name('radialSegments').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'knotTS',2,100).step(1).name('tubularSegments').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'knotP',1,15).name('p').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'knotQ',1,15).name('q').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'knotH',1,15).name('heightScale').onChange(function(){
						meshObj.make();
					});
				}
				else if(v==8){
					geogui.add(meshObj,'latheP',1,100).name('points').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'latheS',2,50).step(1).name('segments').onChange(function(){
						meshObj.make();
					});
				}
				else if(v==9){
					geogui.add(meshObj,'planeW',1,400).name('width').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'planeH',2,400).name('height').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'planeWS',1,400).step(1).name('widthSegments').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'planeHS',2,400).step(1).name('heightSegments').onChange(function(){
						meshObj.make();
					});
				}
				else if(v==10){
					geogui.add(meshObj,'circleR',1,400).name('radius').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'circleS',2,400).step(1).name('segments').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'circleTS',1,400).step(1).name('thetaStart').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'circleTL',2,400).step(1).name('thetaLength').onChange(function(){
						meshObj.make();
					});
				}
				else if(v==11){
					geogui.add(meshObj,'ringIR',1,400).name('innerRadius').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'ringOR',2,400).name('outerRadius').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'ringTS',1,400).step(1).name('thetaSegments').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'ringPS',2,400).step(1).name('phiSegments').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'ringTSt',2,400).step(1).name('thetaStart').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'ringTL',2,400).step(1).name('thetaLength').onChange(function(){
						meshObj.make();
					});
				}
				else if(v==12){
					geogui.add(meshObj,'convexP',5,400).step(1).name('vertices').onChange(function(){
						meshObj.make();
					});
					geogui.add(meshObj,'make').name('randomize');
				}
				geogui.add(meshObj,'closeGeo').name('[X]-CLOSE');

			}



			// LIGHTZ GUI
			//--------------------------------------------------------
			var lightgui;
			function lightGUI() {

				lightgui = new dat.GUI();
				if(lights.AmbientLight==true){
					var amb = lightgui.addFolder('AmbientLight');
					amb.addColor( lights, 'aclr').onChange( function() {
					  	ambientLight.color.setHex( dec2hex(lights.aclr) ); 
					  	updateLightCode();
					}); 
					amb.open();
				}
				if(lights.HemisphereLight==true){
					var hem = lightgui.addFolder('HemisphereLight');
					hem.addColor( lights, 'hs').onChange( function() {
					  	hemisphereLight.color.setHex( dec2hex(lights.hs) ); 
					  	updateLightCode();
					}); 
					hem.add(lights,'hi',0,10).name('intensity').onChange(function(){
						hemisphereLight.intensity = lights.hi;
						updateLightCode();
					});
					hem.addColor( lights, 'hg').onChange( function() {
					  	hemisphereLight.groundColor.setHex( dec2hex(lights.hg) );
					  	updateLightCode(); 
					}); 
					hem.open();
				}
				if(lights.DirectionalLight==true){
					var dir = lightgui.addFolder('DirectionalLight');
					dir.addColor( lights, 'dclr').onChange( function() {
					  	directionalLight.color.setHex( dec2hex(lights.dclr) ); 
					  	updateLightCode();
					}); 
					dir.add(lights,'di',0,1).name('intensity').onChange(function(){
						directionalLight.intensity = lights.di;
						updateLightCode();
					});
					dir.add(lights,'dx',-5,10).name('position.x').onChange(function(){
						directionalLight.position.x = lights.dx;
						updateLightCode();
					});
					dir.add(lights,'dy',-5,10).name('position.y').onChange(function(){
						directionalLight.position.y = lights.dy;
						updateLightCode();
					});
					dir.add(lights,'dz',-5,10).name('position.z').onChange(function(){
						directionalLight.position.z = lights.dz;
						updateLightCode();
					});
					dir.open();
				}
				if(lights.SpotLight1==true){
					var sp1 = lightgui.addFolder('SpotLight1');
					sp1.addColor( lights, 's1clr').onChange( function() {
					  	spotLight1.color.setHex( dec2hex(lights.s1clr) ); 
					  	updateLightCode();
					}); 
					sp1.add(lights,'s1i',0,10).name('intensity').onChange(function(){
						spotLight1.intensity = lights.s1i;
						updateLightCode();
					});
					sp1.add(lights,'s1x',-1000,1000).name('position.x').onChange(function(){
						spotLight1.position.x = lights.s1x;
						updateLightCode();
					});
					sp1.add(lights,'s1y',-1000,1000).name('position.y').onChange(function(){
						spotLight1.position.y = lights.s1y;
						updateLightCode();
					});
					sp1.add(lights,'s1z',-1000,1000).name('position.z').onChange(function(){
						spotLight1.position.z = lights.s1z;
						updateLightCode();
					});
					sp1.add(lights,'s1sd',-1,1).name('shadowDarkness').onChange(function(){
						spotLight1.shadowDarkness = lights.s1sd;
						updateLightCode();
					});
					sp1.open();
				}
				if(lights.SpotLight2==true){
					var sp2 = lightgui.addFolder('SpotLight2');
					sp2.addColor( lights, 's2clr').onChange( function() {
					  	spotLight2.color.setHex( dec2hex(lights.s2clr) ); 
					  	updateLightCode();
					}); 
					sp2.add(lights,'s2i',0,10).name('intensity').onChange(function(){
						spotLight2.intensity = lights.s2i;
						updateLightCode();
					});
					sp2.add(lights,'s2x',-1000,1000).name('position.x').onChange(function(){
						spotLight2.position.x = lights.s2x;
						updateLightCode();
					});
					sp2.add(lights,'s2y',-1000,1000).name('position.y').onChange(function(){
						spotLight2.position.y = lights.s2y;
						updateLightCode();
					});
					sp2.add(lights,'s2z',-1000,1000).name('position.z').onChange(function(){
						spotLight2.position.z = lights.s2z;
						updateLightCode();
					});
					sp2.add(lights,'s2sd',-1,1).name('shadowDarkness').onChange(function(){
						spotLight2.shadowDarkness = lights.s2sd;
						updateLightCode();
					});
					sp2.open();
				}


				lightgui.add(lights,'close').name('[X]-CLOSE');

			}