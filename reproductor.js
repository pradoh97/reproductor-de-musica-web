window.addEventListener('load', iniciarReproductor);

let idFrame, boton = [], deslizador = [], reproductor, audio, cancion, caratula,
duracion, duracionDOM, caratulaDOM,
listadoCanciones = ['A Veces se Gana y a Veces se Pierde', 'Indie Explicit',
                    'Quien Sepa lo Que es Correcto, Hará lo Correcto'],
icono = [], uris = {musica: 'Musica/', caratula: 'Caratulas/'}, reproduciendo = 0;

icono['pausa'] = 'fa-pause';
icono['reproducir'] = 'fa-play';

function iniciarReproductor(){
  boton['reproducirPausa'] = document.querySelector('.controles__reproduccion .fa-play').parentElement;
  boton['reproducirPausa'].addEventListener('click', alternarReproduccion);

  boton['cancionSiguiente'] = document.querySelector('.controles__reproduccion .fa-step-forward').parentElement;
  boton['cancionSiguiente'].addEventListener('click', () => cargarCancion(1));

  boton['cancionAnterior'] = document.querySelector('.controles__reproduccion .fa-step-backward').parentElement;
  boton['cancionAnterior'].addEventListener('click', () => cargarCancion(-1));

  boton['volumen'] = document.querySelector('.controles__volumen button');
  boton['volumen'].addEventListener('click', alternarDeslizadorVolumen);
  document.addEventListener('click', alternarDeslizadorVolumen);

  deslizador['volumen'] = document.querySelector('.controles__volumen input');
  deslizador['volumen'].addEventListener('input', moverVolumen);
  
  deslizador['progresoCancion'] = document.querySelector('.reproduccion__progreso input');
  deslizador['progresoCancion'].addEventListener('input', moverProgreso);

  duracionDOM = document.querySelector('.reproduccion__progreso time');

  reproductor = document.querySelector('.reproductor');

  audio = new Audio();
  cargarCancion(reproduciendo);
}

function moverProgreso(e){
  let momento = e.target.value;
  audio.fastSeek(momento);
}

function cargarCancion(sentido){
  let cambiarA = reproduciendo + sentido;

  if(cambiarA >= listadoCanciones.length) reproduciendo = 0;
  else if(cambiarA < 0) reproduciendo = listadoCanciones.length-1;
  else reproduciendo += sentido;

  cancion = uris.musica + listadoCanciones[reproduciendo] + '.mp3';
  caratula = uris.caratula + listadoCanciones[reproduciendo] + '.jpg';

  audio.src = cancion;

  //Se le dá tiempo a que cargue, mejor con programación asíncrona
  caratulaDOM = document.querySelector('.cancion__caratula img');
  caratulaDOM.src = caratula;
  caratulaDOM.classList.remove('oculto');
  setTimeout( () => {
    cambiarCancion();
  }, 2000);
}

function cambiarCancion(){
  duracion = duracionCancion(audio.duration);

  duracionDOM.innerText = `00:00/${duracion.minutos}:${duracion.segundos}`;
  deslizador['progresoCancion'].max = audio.duration;

  document.querySelector('.cancion__titulo').innerText = listadoCanciones[reproduciendo];

  if(boton['reproducirPausa'].firstChild.classList.contains(icono['pausa'])) audio.play();
}



function duracionCancion(duracionMs){
  let minutos, segundos;
  minutos = Math.floor(duracionMs/60).toString().padStart(2, '0');
  segundos = Math.floor(duracionMs - minutos*60).toString().padStart(2, '0');

  return({minutos, segundos});
}

function alternarDeslizadorVolumen(e){
  e.stopPropagation();

  if(e.target == boton['volumen'] || e.target == boton['volumen'].firstChild){
    deslizador['volumen'].classList.toggle('oculto');
    console.log(e);
  }else{
    deslizador['volumen'].classList.add('oculto');
  }
}

function moverVolumen(e){
  let volumen = e.target.value;
  audio.volume = volumen/100;
}

function actualizarReproductor(){
  idFrame = requestAnimationFrame(actualizarReproductor);

  //Actualizar tiempo
  momentoActual = duracionCancion(audio.currentTime);
  duracionDOM.innerText = `${momentoActual.minutos}:${momentoActual.segundos}/${duracion.minutos}:${duracion.segundos}`;
  deslizador['progresoCancion'].value = audio.currentTime;
}

function alternarReproduccion(){
  let pausar = boton['reproducirPausa'].firstChild.classList.toggle(icono['reproducir']);
  boton['reproducirPausa'].firstChild.classList.toggle(icono['pausa']);

  if(!pausar){
    audio.play();
    idFrame = requestAnimationFrame(actualizarReproductor);
  }
  else {
    audio.pause();
    window.cancelAnimationFrame(idFrame);
  }
}
