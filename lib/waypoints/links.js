// Definición del objeto con el enlace al script
const links = {
  js: 'lib/waypoints/waypoints.min.js'
};

// Carga dinámica del script
const script = document.createElement('script');
script.src = links.js;
script.onload = () => {
  console.log('Script cargado:', links.js);
};
document.head.appendChild(script);