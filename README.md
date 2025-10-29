# Práctica Semana 7 IG

## Autora

María Cabrera Vérgez

## Enlaces

[- Sistema Solar, entrega prácticas 6/7, vídeo de su ejecución](https://drive.google.com/file/d/1auFrw4eGx5leOXFIyhFbm53c4RU-VgLW/view?usp=sharing)

[- Codesandbox con el código](https://codesandbox.io/p/sandbox/practica-7-t5nwsy)
## Tareas a realizar

Se pide como tarea la creación de un sistema planetario. Debe de contener al menos 5 planetas y alguna luna. Además, se debe de integrar lo aprendido sobre iluminación y texturas. Se podrá ver el sistema completo o alternar entre otras vistas, como la de una nave. Se entregará el código mediante un enlace a github. Se realizará un README descriptivo con un enlace al repositorio de codesandbox. Por último, debe incluirse un vídeo ejecutando la tarea realizada.

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

#### Mode 3

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



