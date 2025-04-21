
export function getusuarioGuardado(){
    let usuario = localStorage.getItem('usuario');
    return JSON.parse(usuario);
}