window.addEventListener('load', iniciarReproductor);

let idFrame, boton = [], deslizador = [], reproductor, audio, cancion, caratula, duracion, duracionDOM,
    caratulaDOM, listadoCanciones = ['A Veces se Gana, a Veces se Pierde', 'Indie Explicit',
                                    'Quien Sepa lo Que es Correcto, Hará lo Correcto'];
    icono = [], uris = {musica: 'Musica/', caratula: 'Caratulas/'}, reproduciendo = 0;

icono['pausa'] = 'fa-pause';
icono['reproducir'] = 'fa-play';
icono['volumenSilenciado'] = 'fas fa-volume-mute';
icono['volumenBajo'] = 'fas fa-volume-down';
icono['volumenAlto'] = 'fas fa-volume-up';

function iniciarReproductor(){
  boton['reproducirPausa'] = document.querySelector('.controles__reproduccion .' + icono['reproducir']).parentElement;
  boton['cancionSiguiente'] = document.querySelector('.controles__reproduccion .fa-step-forward').parentElement;
  boton['cancionAnterior'] = document.querySelector('.controles__reproduccion .fa-step-backward').parentElement;
  boton['volumen'] = document.querySelector('.controles__volumen button');
  deslizador['volumen'] = document.querySelector('.controles__volumen input');
  deslizador['progresoCancion'] = document.querySelector('.reproduccion__progreso input');

  caratulaDOM = document.querySelector('.cancion__caratula img');
  duracionDOM = document.querySelector('.reproduccion__progreso time');
  reproductor = document.querySelector('.reproductor');

  boton['reproducirPausa'].addEventListener('click', alternarReproduccion);
  boton['cancionSiguiente'].addEventListener('click', () => cargarCancion(1));
  boton['cancionAnterior'].addEventListener('click', () => cargarCancion(-1));
  boton['volumen'].addEventListener('click', alternarDeslizadorVolumen);
  document.addEventListener('click', alternarDeslizadorVolumen);
  deslizador['volumen'].addEventListener('input', moverVolumen);
  deslizador['progresoCancion'].addEventListener('input', moverProgreso);

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
  else if(cambiarA < 0) reproduciendo = listadoCanciones.length - 1;
  else reproduciendo = cambiarA;

  cancion = uris.musica + listadoCanciones[reproduciendo] + '.mp3';
  caratula = uris.caratula + listadoCanciones[reproduciendo] + '.jpg';

  audio.src = cancion;
  caratulaDOM.src = caratula;
  caratulaDOM.classList.remove('oculto');
  deslizador['progresoCancion'].value = 0;

  setTimeout( () => cambiarCancion(), 5000);
}

function cambiarCancion(){
  duracion = duracionCancion(audio.duration);

  duracionDOM.innerText = `00:00/${duracion.minutos}:${duracion.segundos}`;
  deslizador['progresoCancion'].max = audio.duration;

  document.querySelector('.cancion__titulo').innerText = listadoCanciones[reproduciendo];

  if(boton['reproducirPausa'].firstChild.classList.contains(icono['pausa'])) audio.play();
}

function duracionCancion(duracionS){
  let minutos, segundos;
  minutos = Math.floor(duracionS/60).toString().padStart(2, '0');
  segundos = Math.floor(duracionS - minutos*60).toString().padStart(2, '0');

  return({minutos, segundos});
}

function actualizarReproductor(){
  idFrame = requestAnimationFrame(actualizarReproductor);

  let momentoActual = duracionCancion(audio.currentTime);
  duracionDOM.innerText = `${momentoActual.minutos}:${momentoActual.segundos}/${duracion.minutos}:${duracion.segundos}`;
  deslizador['progresoCancion'].value = audio.currentTime;
}

function alternarReproduccion(){
  let pausar = boton['reproducirPausa'].firstChild.classList.toggle(icono['reproducir']);
  boton['reproducirPausa'].firstChild.classList.toggle(icono['pausa']);

  if(!pausar){
    idFrame = requestAnimationFrame(actualizarReproductor);
    audio.play();
  } else {
    window.cancelAnimationFrame(idFrame);
    audio.pause();
  }
}

function alternarDeslizadorVolumen(e){
  e.stopPropagation();
  if(e.target == boton['volumen'] || e.target == boton['volumen'].firstChild){
    deslizador['volumen'].classList.toggle('oculto');
  } else {
    deslizador['volumen'].classList.add('oculto');
  }
}

function moverVolumen(e){
  let volumen = e.target.value;

  audio.volume = volumen/100;

  let iconoVolumen = boton['volumen'].querySelector('i');

  if(volumen == 0) iconoVolumen.className = icono['volumenSilenciado'];
  else if(volumen <= 50) iconoVolumen.className = icono['volumenBajo'];
  else iconoVolumen.className = icono['volumenAlto'];
}
