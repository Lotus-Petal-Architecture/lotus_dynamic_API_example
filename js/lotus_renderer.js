var camera, scene, raycaster, renderer, parentTransform
var mouse = new THREE.Vector2()
var r = 100,
  dot = 0

  var scene = new THREE.Scene()

  var camera = new THREE.PerspectiveCamera(  
    12, // This variable controls size -- the lower the value the larger the rendering. Original value was 27.
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  var container = document.getElementById('container')

  containerWidth = window.innerWidth
  containerHeight = window.innerHeight

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  var controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.minDistance = 0
  controls.maxDistance = 100
  controls.maxPolarAngle = Math.PI / 2
  controls.addEventListener( 'change', () => renderer.render( scene, camera ) );


  var light = new THREE.PointLight(0xffffff)
  light.position.set(-100, 200, 100)
  scene.add(light)

  var group
  group = new THREE.Group()
  group.position.set( 0, -.085, -5);
  group.rotation.set(1,0,0);
  scene.add(group)

  var link_order_length = 0


// sample arrays for testing purposes


  var link_order = [] // list of all link values in the module, with k values assigned to each index position
  var k_values = [] // list of all k values generated for corresponding module chart lines
  var active_links = [] //index values of active links
  var active_links2 = [] //index values of active links
  var active_array = [] // placeholder for array values being filtered
  var coin_names = [] //list of coin names. uses the same index ranking as link_order
  var coin_prices = []
  var coin_change_24h = []
  var coin_change_1h = []
  var coin_change_1w = []
  var volume = []
  var market_cap = []
  var cap_rank = []
  var xmlhttp = new XMLHttpRequest()




  


// -------------------------------------------- //

init()

function init () {
  container = document.createElement('div')
  document.body.appendChild(container)

function spacer () {
          //top8Transform.visible = false 
          //topTransform.visible = false
          document.getElementById("intro").innerHTML = '';
          document.getElementById("nowplaying").innerHTML = `<span></span>`
  }


function assignLinks () //this assigns k values to the ranked link ids, so that the highest values occur at the highest chart points for each concentric ring.

  {
  var interval = 50;

  for (var i = 0; i < 12; i++) { //link ids for the innermost petal ring
    k = (i * interval )+ 25;
    link_order.push([k]);
  }
  for (var h = 0; h < 24; h++) {
    for (var j = 0; j < 12; j++) {
      k = link_order[j];
      k1 = k - 2 - h;
      k2 = k - (-1) + h;
      link_order.push(k1);
      link_order.push(k2);
    }
  }

  var link_order_length = link_order.length;
  var stop= link_order_length + 14

  for (var i = 0; i < 14; i++) {  //link ids for the middle petal ring
    k = (i * interval )+ 25;
    k = k + 600;
    link_order.push([k]);
  }
  for (var h = 0; h < 24; h++) {
    for (var j = link_order_length; j < stop; j++) {
      k = link_order[j];
      k1 = k - 2 - h;
      k2 = k - (-1) + h;
      link_order.push(k1);
      link_order.push(k2);
    }
  }

  var link_order_length = link_order.length;
  var stop= link_order_length + 16

  for (var i = 0; i < 16; i++) {  //link ids for the outer petal ring
    k = (i * interval )+ 25;
     k = k + 1300;
    link_order.push([k]);
  }
  for (var h = 0; h < 24; h++) {
    for (var j = link_order_length; j < stop; j++) {
      k = link_order[j];
      k1 = k - 2 - h;
      k2 = k - (-1) + h;
      link_order.push(k1);
      link_order.push(k2);
    }
  }


}

assignLinks();


//console.log(link_order)
//console.log(coin_names)



//Petal Constructor - draws outline of petal
function drawPetal (
    x,
    y,
    z,
    x0,
    y0,
    z0,
    x1,
    y1,
    z1,
    petalheight,
    ctrlpt,
    color_code,
  ) {
    var curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(x, ctrlpt, z),
      new THREE.Vector3(x0, y0 + petalheight, z0)
    )

    var points = curve.getPoints(50)
    var geometry = new THREE.BufferGeometry().setFromPoints(points)
    var material = new THREE.LineBasicMaterial({ color: color_code })
    var curveObject = new THREE.Line(geometry, material)
    group.add(curveObject)

    var curve2 = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x0, y0 + petalheight, z0),
      new THREE.Vector3(x1, ctrlpt, z1),
      new THREE.Vector3(x1, y1, z1)
    )

    var points = curve2.getPoints(50)
    var geometry = new THREE.BufferGeometry().setFromPoints(points)
    var material = new THREE.LineBasicMaterial({ color: color_code })

    var curveObject = new THREE.Line(geometry, material)
    group.add(curveObject)
  }


  //Chart Position Arc - returns points for top of chart lines
  function chartTop (
    x,
    y,
    z,
    x0,
    y0,
    z0,
    x1,
    y1,
    z1,
    petalheight,
    ctrlpt,
    color_code
  ) {
    var curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(x, ctrlpt, z),
      new THREE.Vector3(x0, y0 + petalheight, z0)
    )

    var points1 = curve.getSpacedPoints(25)
    var geometry = new THREE.BufferGeometry().setFromPoints(points1)
    var material = new THREE.LineBasicMaterial({ color: color_code })
    var curveObject = new THREE.Line(geometry, material)
    group.add(curveObject)

    var curve2 = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x0, y0 + petalheight, z0),
      new THREE.Vector3(x1, ctrlpt, z1),
      new THREE.Vector3(x1, y1, z1)
    )

    var points2 = curve2.getSpacedPoints(25)
    var geometry = new THREE.BufferGeometry().setFromPoints(points2)
    var material = new THREE.LineBasicMaterial({ color: color_code })
    var curveObject = new THREE.Line(geometry, material)
    group.add(curveObject)

    var points = points1.concat(points2)
    return points
  }


  //Chart Position - draws chart lines within petal arc
  function chartPosition (x, y, z, x0, y0, z0, petalheight, ctrlpt, color_code) {
    var cPcurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(x, ctrlpt, z),
      new THREE.Vector3(x0, y0, z0)
    )

    var points = cPcurve.getPoints(50)
    var geometry = new THREE.BufferGeometry().setFromPoints(points)
    var material = new THREE.LineBasicMaterial({ color: color_code })
    var curveObject = new THREE.Line(geometry, material)
    group.add(curveObject)
  }


//Invisible Spaghetti - add TubeGeometry objects that sheath chart lines representing active geometric links.
function invisibleSpaghetti (k, x, y, z, x0, y0, z0, petalheight, ctrlpt) {
    var link_curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(x, ctrlpt, z),
      new THREE.Vector3(x0, y0, z0)
    )

    var geometry = new THREE.TubeGeometry(link_curve, 8, 0.002, 4, false)  //previous values: 64, 0.004, 8,
    var material = new THREE.MeshBasicMaterial()
    var object = new THREE.Mesh(geometry, material)
    material.transparent = true
    material.opacity = 0
    object.label = k
    parentTransform.add(object)
  }

//Visible Spaghetti - visible TubeGeometry objects represent highlighted links.
function visibleSpaghetti (k, x, y, z, x0, y0, z0, petalheight, ctrlpt, color_code) {
    var link_curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(x, ctrlpt, z),
      new THREE.Vector3(x0, y0, z0)
    )

    var geometry = new THREE.TubeGeometry(link_curve, 16, 0.004, 4, false)  //previous values: 32, 0.004, 4,
    var material = new THREE.MeshBasicMaterial({ color: color_code })
    var object = new THREE.Mesh(geometry, material)
    material.transparent = true
    material.opacity = 1
    object.label = k
    parentTransform.add(object)
  }

//Draw Petals - draws ring of lotus petals
function drawPetalRing (segmentCount, radius, depth, color_code, chartLines, divisor){
  var geometry = new THREE.Geometry(),
  material = new THREE.LineBasicMaterial({ color: color_code })

  for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2
    var iota = ((i + 0.5) / segmentCount) * Math.PI * 2
    var kappa = ((i + 1) / segmentCount) * Math.PI * 2
    drawPetal(
      Math.cos(theta) * radius,
      0,
      Math.sin(theta) * radius,
      Math.cos(iota) * (radius - depth),
      0,
      Math.sin(iota) * (radius - depth),
      Math.cos(kappa) * radius,
      0,
      Math.sin(kappa) * radius,
      0.5,
      0.45,
      color_code
    )
  }
  group.add(new THREE.Line(geometry, material))


  //Draws Chart Lines 
  var geometry = new THREE.Geometry(),
    material = new THREE.LineBasicMaterial({ color: color_code })

  for (var i = 0; i < chartLines; i++) {
    var k = 0
    var theta = (i / chartLines) * Math.PI * 2
    var iota = ((i + 0.5) / chartLines) * Math.PI * 2
    var kappa = ((i + 1) / chartLines) * Math.PI * 2
    var iota0 = ((i + divisor / 2) / chartLines) * Math.PI * 2
    var kappa0 = ((i + divisor) / chartLines) * Math.PI * 2
    var modulus = i % divisor

    var base_x = Math.cos(theta) * radius
    var base_y = 0
    var base_z = Math.sin(theta) * radius
    var petalheight = 0.5
    var ctrlpt = 0 //ctrl pt for chart lines (within petal)
    var arcpt = 0.45 //ctrl pt for petal arc (outline)

    if (modulus == 0) {

//this resets chart line variables for each new petal drawn

      var chartPoint = chartTop(
        Math.cos(theta) * radius,
        0,
        Math.sin(theta) * radius,
        Math.cos(iota0) * (radius - depth),
        0,
        Math.sin(iota0) * (radius - depth),
        Math.cos(kappa0) * radius,
        base_y,
        Math.sin(kappa0) * radius,
        petalheight,
        arcpt,
        0x00769d
      )

      for (var j = 1; j <= divisor; j++) {
        k = i + j
        k=k-1
        var theta0 = (k / chartLines) * Math.PI * 2
        var base_xk = Math.cos(theta0) * radius
        var base_yk = 0
        var base_zk = Math.sin(theta0) * radius
        if (chartLines==600) {  //this ensures that each k value is unique within the lotus flower
          k=k;
          }
        if (chartLines==700) {
          k=k+600;
          }
        if (chartLines==800) {
          k=k+1300;
          }
        

        chartPosition(
          chartPoint[j].x,
          chartPoint[j].y,
          chartPoint[j].z,
          base_xk,
          base_yk,
          base_zk,
          petalheight,
          ctrlpt,
          color_code
        )

        k_values.push([    //k values each define a unique curve in 3D space. They are not associated with a specific petal ring.
          k,
          chartPoint[j].x,
          chartPoint[j].y,
          chartPoint[j].z,
          base_xk,
          base_yk,
          base_zk,
          petalheight,
          ctrlpt,
        ])
      }
    }


    geometry.vertices.push(
      new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
    )
  }

  parentTransform = new THREE.Object3D()
  group.add(parentTransform)
  group.add(new THREE.Line(geometry, material));

}


  // -------------------------------- // 


function drawLotusChart()

{
    drawPetalRing (12, .65, .1, 0x00769d, 600, 50) //center petals

    drawPetalRing (14, .85, .1, 0x0289b6, 700, 50)  //middle petals

    drawPetalRing (16, 1, 0, 0x0099cc, 800, 50)  //outer petals
}




function getData() //processes JSON data and returns arrays for 5 main variables
  {
  drawLotusChart() 
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "./cryptocap.php", true);
  xmlhttp.send();
  document.getElementById("info").innerHTML = '<h1>&nbsp;<span style="font-size:15px;">Loading 2058 coin positions...</span></h3>';
  document.getElementById("intro").innerHTML = ''; 

  xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //console.log(this.responseText);
    myObj = JSON.parse(this.responseText);
    xmlhttp.addEventListener("load", getActiveLinks);
    xmlhttp.addEventListener("load", addLinks);
    xmlhttp.addEventListener("load", render);
    document.getElementById("info").innerHTML = '<h3 style="margin-left:-1.6%;">World Coin Trends: Change over 24 Hours</h3>';
    document.getElementById("intro").innerHTML = '';
    document.getElementById('nowplaying').innerHTML =
      '<br><br><br>Mouse over the colored lines <br> to begin.';
    
    //myObj = this.responseText;

if(myObj.data.length > 0) {
  for (var i = 0; i < myObj.data.length; i++) {
    var coin = myObj.data[i];
    //console.log(entry);
    var coin_name = coin.name;
    coin_name = coin_name.replace(/\s/g, "-");
    //console.log(coin.name);
    //console.log(coin.id);
    //var coin_priceusd = coin.quote.USD.price;
    //var percent_change_24h = percent_change_24h;
    //document.write(i+' - '+coin_name+' : $'+coin_priceusd+'<br />');
    //coin_name = String(coin_name);
    coin_names.push([coin_name]);
    //coin_names[coin_names.length]=coin_name;
    market_cap[market_cap.length] = coin.quote.USD.market_cap;
    coin_prices[coin_prices.length] = coin.quote.USD.price;
    coin_change_24h[coin_change_24h.length] = coin.quote.USD.percent_change_24h;
    coin_change_1h[coin_change_1h.length] = coin.quote.USD.percent_change_1h;
    coin_change_1w[coin_change_1w.length] = coin.quote.USD.percent_change_7d;
    volume[volume.length] = coin.quote.USD.volume_24h;
    }
  }
  }
  } 
}

getData();


function getActiveLinks()  //sorts for a given set of values from the data obtained above
{

    if (coin_change_time == "1h") 
      {
        var active_array = coin_change_1h;
      }

    if (coin_change_time == "24h") 
      {
        var active_array = coin_change_24h;
      }

    if (coin_change_time == "1w") 
      {
        var active_array = coin_change_1w;
      }

    var f = active_array.entries();

    for (x of f) {
      var coin =x;
      var coin_value = coin[1];
      var coin_index = coin[0];

      if (volume[coin_index] < volume_adj) 
      {
        coin = null;
      }

      else if (coin_value > 20) {
        
        active_links.push(coin_index);
      }

      else if (coin_value > 5) {
      coin_index = coin[0]
      active_links2.push(coin_index);
      }
    }
}


function addLinks() {  //adds links for selected values

  link_order_length = link_order.length
  console.log(link_order_length)

for (i = 0; i < link_order_length; i++) {

    if (active_links.includes(i)) {

      var k = link_order[i];
      var color_code = 0xe45e9d;

      visibleSpaghetti(
        k,
        k_values[k][1],
        k_values[k][2],
        k_values[k][3],
        k_values[k][4],
        k_values[k][5],
        k_values[k][6],
        k_values[k][7],
        k_values[k][8],
        color_code
      )
    }

    if (active_links2.includes(i)) {

      var k = link_order[i];
      var color_code = 0xffca85;

      visibleSpaghetti(
        k,
        k_values[k][1],
        k_values[k][2],
        k_values[k][3],
        k_values[k][4],
        k_values[k][5],
        k_values[k][6],
        k_values[k][7],
        k_values[k][8],
        color_code
      )
    }

    else

    var k = link_order[i];       

        invisibleSpaghetti(
        k,
        k_values[k][1],
        k_values[k][2],
        k_values[k][3],
        k_values[k][4],
        k_values[k][5],
        k_values[k][6],
        k_values[k][7],
        k_values[k][8],
        color_code
      )

  }
}


  // -- coin details code

  function showPointer () {
    document.body.style.cursor = 'pointer'
  }

  function nowPlaying (k) {
      l = link_order.indexOf(k)
      var coin_float = coin_prices[l]
      var coin_price = coin_float.toFixed(4);
      var coin_change_float=coin_change_24h[l]
      var coin_change = coin_change_float.toFixed(2);
      var coin_market_cap_float = market_cap[l];
      var coin_market_cap = coin_market_cap_float.toFixed(0);
      var rank_float = ((l / 2058) * 100) + .5;
      var rank_percent = rank_float.toFixed(0);

      if (coin_change_float > 20)
      {
        document.getElementById('nowplaying').innerHTML =
      '<b>Coin Name</b><br><br>' + coin_names[l] + '&nbsp; &nbsp;' + '$' + coin_price + '&nbsp; &nbsp;' + '<span style="color:#e45e9d; font-weight:bold;">' + coin_change + ' %</span>' 
      + '<br><span style="color:#fff;">Market Cap &nbsp; &nbsp;$</>' + coin_market_cap + ', </span>'
      + '<br><span style="color:#fff;">Ranked in Top &nbsp; </>' + rank_percent + '&nbsp;%</span>'
      }
      else if (coin_change_float > 5)
            {
        document.getElementById('nowplaying').innerHTML =
      '<b>Coin Name</b><br><br>' + coin_names[l] + '&nbsp; &nbsp;' + '$' + coin_price + '&nbsp; &nbsp;' + '<span style="color:#ffca85; font-weight:bold;">' + coin_change + ' %</span>'
      + '<br><span style="color:#fff;">Market Cap &nbsp; &nbsp;$</>' + coin_market_cap + ', </span>'
      + '<br><span style="color:#fff;">Ranked in Top &nbsp; </>' + rank_percent + '&nbsp;%</span>'
            }
      else
         document.getElementById('nowplaying').innerHTML =
      '<b>Coin Name</b><br><br>' + coin_names[l] + '&nbsp; &nbsp;' + '$' + coin_price + '&nbsp; &nbsp;' + '<span style="color:#0099cc; font-weight:bold;">' + coin_change + ' %</span>'
      + '<br><span style="color:#fff;">Market Cap &nbsp; &nbsp;$</>' + coin_market_cap + ', </span>'
      + '<br><span style="color:#fff;">Ranked in Top &nbsp; </>' + rank_percent + '&nbsp;%</span>'


            }

/*function hideControls() {
  document.getElementById("genres").style.visibility  = "hidden";
  document.getElementById("message").style.visibility  = "hidden";
  document.getElementById("nowplaying").style.visibility  = "hidden";
  document.getElementById("thumb").style.visibility  = "hidden";
  document.getElementById("views").style.visibility  = "hidden";
  document.getElementById("rank").style.visibility  = "hidden";
  document.getElementById("share").style.visibility  = "hidden";
  document.getElementById("toggleControls").style.backgroundImage  = "url('examples/files/maximize_icon.png')";

}

function showControls() {
  document.getElementById("genres").style.visibility  = "visible";
  document.getElementById("message").style.visibility  = "visible";
  document.getElementById("share").style.visibility  = "visible";
  document.getElementById("toggleControls").style.backgroundImage  = "url('examples/files/minimize_icon.png')";
}

function toggleControls() {

  if (controlsVisible == true) {
    controlsVisible = false;
    hideControls();
  }
  else 
    {
      controlsVisible = true;
      showControls();
  }
}*/

  // --- raycaster code

  raycaster = new THREE.Raycaster()

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  window.addEventListener('click', onMouseClick, false)
  window.addEventListener('resize', onWindowResize, false)
  
  function onDocumentMouseMove (event) {
    event.preventDefault()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    var intersects = raycaster.intersectObjects(parentTransform.children, true)
    
    if (intersects.length > 0) {
      showPointer()
    }
    else {
      document.body.style.cursor = 'default'
      document.getElementById('nowplaying').innerHTML =
      '<br><br>'
    }

    for (var i = 0; i < intersects.length; i++) {
      var intersection = intersects[i],
      obj = intersection.object
      k = obj.label
      l = link_order.indexOf(k)   //connects the k value -- position on lotus petal graph -- to ID for link value
      nowPlaying(k)

      /*console.log(coin_names[l])
      console.log(coin_prices[l])
      console.log(coin_change_24h[l])*/
    }
  }


  function onMouseClick (event) {
    //event.preventDefault()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    var intersects = raycaster.intersectObjects(parentTransform.children, true)
    for (var i = 0; i < intersects.length; i++) {
      var intersection = intersects[i],
      obj = intersection.object
      k = obj.label
      l = link_order.indexOf(k)   //connects the k value -- position on lotus petal graph -- to ID for link value
      var URL = "https://coinmarketcap.com/currencies/" + coin_names[l]
      //console.log(coin_names[l])
      //console.log(coin_change_1h[l])
      window.open(URL, '_blank')
    }
  }

  function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  //animate and render

  camera.position.z = 5

  function animate () {
    requestAnimationFrame(animate)
    group.rotation.x += 0
    group.rotation.y += 0
  }
  animate()
  render()

  function render () {
    dot += 0
    renderer.render(scene, camera)
  }
}

//  ---- reference code ----- //  


//  ---- reference code ----- //  