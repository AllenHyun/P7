# Práctica Semana 7 IG

## Autora

María Cabrera Vérgez

## Enlaces

[- Sistema Solar, entrega prácticas 6/7, vídeo de su ejecución](https://drive.google.com/file/d/1auFrw4eGx5leOXFIyhFbm53c4RU-VgLW/view?usp=sharing)

[- Codesandbox con el código](https://codesandbox.io/p/sandbox/practica-7-t5nwsy)
## Tareas a realizar

Se pide como tarea la creación de un sistema planetario. Debe de contener al menos 5 planetas y alguna luna. Además, se debe de integrar lo aprendido sobre iluminación y texturas. Se podrá ver el sistema completo o alternar entre otras vistas, como la de una nave. Se entregará el código mediante un enlace a github. Se realizará un README descriptivo con un enlace al repositorio de codesandbox. Por último, debe incluirse un vídeo ejecutando la tarea realizada.

## Índice de contenidos

- [Diferentes vistas controladas por GUI](#diferentes-vistas-controladas-por-gui)
  * [Modo 0](#modo-0)
  * [Modo 1](#modo-1)
  * [Modo 2](#modo-2)
  * [Modo 3](#modo-3)
- [Elementos en escena](#elementos-en-escena)
  * [Planeta()](#planeta())
  * [Estrella()](#estrella())
  * [Luna()](#luna())
  * [Meteorito()](#meteorito())
- [Texturas](#texturas)
- [Luz y sombras](#luz-y-sombras)
- [Animación: movimientos](#animación:-movimientos)

## Tareas

### Diferentes vistas controladas por GUI

En la práctica se pide que se pueda alternar entre al menos dos vistas. En este trabajo, se tiene la opción de 4: General, nave de un alien (con movimiento), Tierra y un meteorito. Lo primero que se hizo fue crear un GUI que será el que de las opciones para cambiar entre los diferentes modos. Se tienen dos controles: OrbitControl y FlyControls. Este segundo es el que ayudará a que la nave espacial pueda desplazarse.

``` 
  flyControls = new FlyControls(camera, renderer.domElement);
  flyControls.movementSpeed = 2;       
  flyControls.rollSpeed = 0.5;         
  flyControls.dragToLook = true;      
  flyControls.autoForward = false;

  t0 = new Date();
```

Primero se le debe pasar la cámara a la que va a estar controlando. Se define la velocidad a la que la nave se va a mover, la velocidad de rotación, que solo se pueda mover la cámara si mantienes el botón izquierdo pulsado. Además, se evita que se avance automáticamente sola. Por último se guarda el tiempo inicial, puesto que esto será de ayuda en el momento de animar el movimiento, cosa que será vista más adelante.

Lo siguiente es mostrar los detalles que tendrá el GUI, la forma de cambiar entre vistas. Por defecto, empieza siendo el modo 0, que equivale al modo general desde el que se puede apreciar todo el sistema. 

```
 const camParams = { mode: 0 };
  gui.add(camParams, 'mode', { 'General': 0, 'Nave de Marvin el Marciano': 1, 'Tierra': 2, 'Meteorito': 3})
     .name('Vista')
     .onChange((value) => { mode = value; });

}
```

Existe una variable llamada mode, declarada más arriba, que es la que define el modo al que se accede. Cada vez que se pulse una vista, su valor cambiará. Se tiene:
  - 0: General
  - 1: Vista de la nave de Marvin el Marciano
  - 2: Tierra
  - 3: Meteorito

#### Modo 0
Dentro de la función animate, se especifica cada detalle de los modos. Para el primer modo, se tendrá una vista quieta, desde lo alto, en la que se pueden apreciar todos los detalles añadidos.

```
if (mode === 0) {
    camcontrols.enabled = true;
    flyControls.enabled = false;
    camera.position.set(0, 20, 30);
    camera.lookAt(0, 0, 0);
  }
```
#### Modo 1
En el modo 1, FlyControls permite que la nave se pueda desplazar. Actualiza el movimiento según el tiempo pasado para que sea suave. De esta forma, se desplaza correctamente y sin dar tirones. Las teclas para poder moverse son:
  - w avanzar
	- s retroceder
	- a izquierda
	- d derecha
	- r subir
	- f bajar
	- q rotación izquierda
	- e rotación derecha
	- botón derecho + ratón girar

 ```
else if (mode === 1){
    camcontrols.enabled = false;
    flyControls.enabled = true;
    let t1 = new Date();
    let dt = (t1 -t0) / 1000;
    flyControls.update(dt);
    t0 = t1;
  }
```

#### Modo 2

Para el tercer modo, teniendo en cuenta que se empieza desde 0, se decidió anclarlo a la Tierra para apreciar desde cerca sus características. Más adelante será explicado en profundidad todo lo que el planeta contiene, pero se puede apreciar las nubes encima, su textura, su movimiento y la luna girando. 

```
else if (mode == 2){
    const tierra = Planetas[3].planeta;
    camera.position.copy(tierra.position.clone().add(new THREE.Vector3(0, 1, 2)));
    camera.lookAt(tierra.position);
  }
```

#### Modo 3

El último modo es parecido al anterior, pero en lugar de acercarse a un planeta, lo que se hace es ver de cerca un meteorito que empieza algo alejado del sistema y se va acercando, por detrás del Sol, hasta salir del plano.

```
else if(mode == 3){
    camcontrols.enabled = false;
  flyControls.enabled = false;

  if (meteorito) {
      camera.position.copy(meteorito.position.clone().add(new THREE.Vector3(0, 1, 2)) 
    );
    camera.lookAt(meteorito.position); 
  }

  }
```

### Elementos en escena

Para que se vea como el Sistema Solar real, se crearon varios planetas, usando la función Planeta(), un sol, con Estrella(), una luna, con Luna() y un meteorito, con Meteorito().

#### Planeta()

Para poder crear un planeta, se le debe de pasar el radio del mismo, la distancia a la que está del sol, la velocidad, el color, la escala de la elipse y dos datos opcionales: la textura normal y el mapa de transparencia.

En cada caso, se crea una esfera con el radio que se le pase a la función. Luego, se crea un material que soporta la luz y sombras; además, se le asigna un color básico que se le pase. 

Como son datos opcionales, si se pasa una textura, se aplica. En caso contrario, ni se prueba ponerlo. Para el mapa de transparencias, se ve las partes que no se deben ver, se habilitan y se establece que el material se pueda ver desde ambos lados.

Se crea crea el planeta 3D y se guardan sus datos, puestos que serán importantes en la animación del mismo. 

Para mostrar el movimiento del planeta, se dibuja una elipse que señala el movimiento sobre el plano XY del cuerpo celeste Por último, se guarda cada uno en un array y se agregan tanto los planetas como sus órbitas a la escena que se está montando.

```
function Planeta(radio, dist, vel, col, f1, f2, texture = undefined, texalpha=undefined) {
  // Crear geometría de la esfera
  let geom = new THREE.SphereGeometry(radio, 32, 32); // más resolución para texturas
  // Crear material básico
  let mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture !== undefined) {
    mat.map = texture;
  }

  if (texalpha != undefined) {
    //Con mapa de transparencia
    mat.alphaMap = texalpha;
    mat.transparent = true;
    mat.side = THREE.DoubleSide;
    mat.opacity = 1.0;

    //Sin mapa de transparencia
    /*mat.transparent = true;
    mat.side = THREE.DoubleSide;
    mat.opacity = 0.8;
    mat.transparent = true;
    mat.depthWrite = false;*/
  }

  // Crear mesh del planeta
  let planeta = new THREE.Mesh(geom, mat);
  planeta.userData = { dist, speed: vel, f1, f2 };

  // Crear la órbita
  let curva = new THREE.EllipseCurve(0, 0, dist * f1, dist * f2);
  let puntos = curva.getPoints(50);
  let geome = new THREE.BufferGeometry().setFromPoints(puntos);
  let mate = new THREE.LineBasicMaterial({ color: 0xffffff });
  let orbita = new THREE.Line(geome, mate);
  orbita.rotation.x = Math.PI / 2;

  Planetas.push({
    planeta: planeta,
    orbita: orbita
  });

  scene.add(orbita);
  scene.add(planeta);
}
```

#### Estrella()

La creación de una estrella es parecida a la de un planeta, pero con menos datos. Los datos necesarios solo serán el radio, color y la textura básica a poner.

Se crea la esfera con el radio pasado y luego se crea el material con la posibilidad de responder ante la luz. Se le asigna un color básico por si no se pasara ninguna textura. Se crea la figura 3D y se añade a la escena para que pueda verse.

```
function Estrella(rad, col, texture = undefined) {
  let geometry = new THREE.SphereGeometry(rad, 10, 10);
  let mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture !== undefined) {
    mat.map = texture;
  }
  estrella = new THREE.Mesh(geometry, mat);
  scene.add(estrella);
}
```

#### Luna()

Esta función sirve para crear satélites alrededor de los planetas que se le indiquen. Se le debe de indicar el planeta al que pertenece, su radio, distancia del planeta, velocidad, color básico, ángulo de inclinación y la textura opcional que se puede poner.

Se va a rotar sobre en el plano X por el ángulo pasado. Este pivote que ha sido creado será añadido por su lado al planeta para el movimiento alrededor del mismo. Como en los casos anteriores, se debe crea la geometría y el material del satélite. Posteriormente, se le pondrá una textura si es que recibe una.

Se crea el objeto 3D, se coloca a una distancia y se establece su velocidad. Por último la luna se guarda en un array, por si se desea crear varias y se añade el pivote a la luna.

```
function Luna(planeta, radio, dist, vel, col, angle, texture=undefined) {
  var pivote = new THREE.Object3D();
  pivote.rotation.x = angle;
  planeta.add(pivote);
  var geom = new THREE.SphereGeometry(radio, 10, 10);
  let mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture !== undefined) {
    mat.map = texture;
  }
  var luna = new THREE.Mesh(geom, mat);
  luna.position.x = dist;
  luna.userData.speed = vel;

  Lunas.push(luna);
  pivote.add(luna);
}
```

#### Meteorito

Para el último caso de objeto creado, se tiene un meteorito. Este se hizo con la idea de plasmar, por ejemplo, el meteorito 3i Atlas. Se le pasa a la función su radio, color básico y una textura si se quiere. Se vuelve a crear su geometría y material, como en los casos anteriores, y se le pone una textura si se proporciona una.

Se crea el objeto 3D. Tendrá una coordenada iniciales algo alejadas del sistema para que pueda empezar desde fuera, pasar por este y luego salir del mismo. De esta forma, se ilustra mejor su movimiento. 

Para la animación, se guarda la velocidad. En este caso se indica el movimiento en los ejes x, z, pero no tiene en el eje y. Por último, se añade a la escena para que se pueda ver.

```
function Meteorito(rad, col, texture = undefined) {
  let geometry = new THREE.SphereGeometry(rad, 10, 10);
  let mat = new THREE.MeshPhongMaterial({ color: col });

  if (texture !== undefined) {
    mat.map = texture;
  }
  meteorito = new THREE.Mesh(geometry, mat);
  meteorito.position.set(-40, 5, -30); 
  meteorito.userData = { velocidad: new THREE.Vector3(0.005, 0, 0.003) };

  scene.add(meteorito);
}
```

### Texturas

Los planetas no se podían dejar simplemente con colores planos, se debían de usar texturas. Para ello, se cargan las imágenes que se usarán casi al inicio del init.

```
const space = new THREE.TextureLoader().load("src/2k_stars_milky_way.jpg");
scene.background = space;

// Se crean las diversas texturas de los planetas para ponérselas

  const sun = new THREE.TextureLoader().load("src/2k_sun.jpg");

  const mercury = new THREE.TextureLoader().load("src/2k_mercury.jpg");

  const venus = new THREE.TextureLoader().load("src/venus_2k.jpg");

  const earth = new THREE.TextureLoader().load("src/2k_earth_daymap.jpg");

  const mars = new THREE.TextureLoader().load("src/2k_mars.jpg");

  const jupiter = new THREE.TextureLoader().load("src/2k_jupiter.jpg");

  const saturno = new THREE.TextureLoader().load("src/2k_saturn.jpg");

  const urano = new THREE.TextureLoader().load("src/2k_uranus.jpg");

  const neptuno = new THREE.TextureLoader().load("src/2k_neptune.jpg");

  const moon = new THREE.TextureLoader().load("src/2k_moon.jpg");

  // nubes
  const cloud = new THREE.TextureLoader().load("src/2k_earth_clouds.jpg");

  const venus_atmos = new THREE.TextureLoader().load("src/2k_venus_atmosphere.jpg");

  //meteorito
  const meteorito_texture = new THREE.TextureLoader().load("src/meteorito.jpg");

```

Tanto el fondo como cada figura creada tendrá su propia textura. El fondo se verá como el espacio, para darle un ambiente algo más realista. Luego se carga cada planeta, nubes, atmósfera, etc. Las variables que han sido creadas serán añadidas en los parámetros de la creación de cada figura. El siguiente es un caso en el que se pasa la textura normal.

```
Planeta(0.5, 5.8, -4.2, undefined, 1.0, 1.0, venus);
```

En algunas casos, como fue mencionado anteriormente, lo que se quiere es ponerle una capa por encima con cierta transparencia. Para ello, se crea otro planeta en el que se deja la primera textura como undefined y se le añade en el campo de texalpha la transparente. A esta figura se le da un tamaño ligeramente mayor al planeta original.

```
Planeta(0.55, 5.8, -4.2, undefined, 1.0, 1.0, undefined, venus_atmos);
```

Echándole un vistazo al código, lo que se ve es que se hacen dos cosas:

Para la textura principal, se mira si se pasa. Si se pasa, se pondrá. En caso contrario, se puede ignorar, porque no hace falta hacer nada.

```
if (texture !== undefined) {
    mat.map = texture;
  }
```

Algo parecido pasa con la textura de, por ejemplo, las nubes, pero se trabaja con más cosas. Si se pasa una textura, si existe, lo que se hace es asignarla al mapa de transparencias, se activa esta misma, se permite que se pueda ver por ambos lados y se establece una opacidad. De esta forma, si tapa demasiado al planeta ni es casi invisible.

```
if (texalpha != undefined) {
    //Con mapa de transparencia
    mat.alphaMap = texalpha;
    mat.transparent = true;
    mat.side = THREE.DoubleSide;
    mat.opacity = 1.0;
  }
```

Todas las funciones asociadas a la creación de los elementos importantes del sistema solar llevarán texturas para darle cierto toque más realista, dentro de lo que es.

### Luz y sombras

En el sistema se añadió una luz ambiente, AmbientLight. Se encuentra iluminando todo de forma uniforme. 

```
const Lamb = new THREE.AmbientLight(0xffffff, 0.8);
   scene.add(Lamb);
```

Por otro lado, PointLight genera luz desde un punto hacia todas las direcciones. Es con solLuz, la luz generada de esta forma, que se plantea la iluminación que brinda el Sol. 

Se coloca en el punto (0,0,0) para que parezca salir de dentro de la estrella. Se espera que se produzcan sombras, así que se pone castShadow = true. Además, tendrán un radio de 4. Por último, se añaden a la escena planteada.

```
 const solLuz = new THREE.PointLight(0xffffff, 2, 200);
   solLuz.position.set(0, 0, 0); 
   solLuz.castShadow = true;
   solLuz.shadow.radius = 4;
   scene.add(solLuz);
```

### Animación: movimientos

Finalmente, el último punto a comentar es la función animate(). En ella es donde se va a controlar cosas como el movimiento de la cámara o de los propios planetas.

Lo primero que se hace es pedir que la función animate se ejecute una y otra vez, así se ve el movimiento sin interrupciones, creando un bucle.

Lo primero que se hace es el movimiento de rotación del Sol. Este girará lentamente (ya que el aumento es de 0.005) sobre su propio eje. 

```
estrella.rotation.y += 0.005;
```

Para las órbitas de los planetas, se deben de usar las funciones del coseno y seno para dar forma al movimiento circular. Cuando se tiene ya la orbita, se calcula la rotación del planeta sobre su propio eje, como sucedía con el Sol.

```
// Rotación y traslación
  Planetas.forEach((obj) => {
    obj.planeta.position.x =
      Math.cos(Date.now() * 0.0002 * obj.planeta.userData.speed) *
      obj.planeta.userData.dist;

    obj.planeta.position.z =
      Math.sin(Date.now() * 0.0002 * obj.planeta.userData.speed) *
      obj.planeta.userData.dist;

    obj.planeta.rotation.y += 0.01;
  });
```

Para la Luna el movimiento es acompañar a su padre. En el caso de la luna colocada, su padre es la Tierra. El satélite gira sobre un eje, pero no es el suyo propio como en otros casos, si no en el de su padre.
```
 // Traslación
  Lunas.forEach((luna) => {
    if (luna.parent) {
      luna.parent.rotation.y += 0.01; 
    }
  });
```

A continuación, se controlan los diferentes modos de cámara que se poseen. Ya durante el apartado de Diferentes vistas controladas por GUI se vió una explicación sobre esa parte del animate().
```
if (mode === 0) {
    camcontrols.enabled = true;
    flyControls.enabled = false;
    camera.position.set(0, 20, 30);
    camera.lookAt(0, 0, 0);
  } else if (mode === 1){
    camcontrols.enabled = false;
    flyControls.enabled = true;
    let t1 = new Date();
    let dt = (t1 -t0) / 1000;
    flyControls.update(dt);
    t0 = t1;
  } else if (mode == 2){
    const tierra = Planetas[3].planeta;
    camera.position.copy(tierra.position.clone().add(new THREE.Vector3(0, 1, 2)));
    camera.lookAt(tierra.position);
  } else if(mode == 3){
    camcontrols.enabled = false;
  flyControls.enabled = false;

  if (meteorito) {
      camera.position.copy(meteorito.position.clone().add(new THREE.Vector3(0, 1, 2)) 
    );
    camera.lookAt(meteorito.position); 
  }

  }
```

El meteorito rota sobre su eje y y además avanza a lo largo del espacio a la velocidad que se le fue indicada, solo si el meteorito existe. En su movimiento se le indica la dirección también hacia la que debe ir. Pasa por encima del sistema y desaparece de la escena.

```
if (meteorito) {
    meteorito.position.add(meteorito.userData.velocidad);
    meteorito.rotation.y += 0.01;
  }
```
