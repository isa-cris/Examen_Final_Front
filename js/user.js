const urlApi = "http://localhost:8088";

async function login() {
  var myForm = document.getElementById("loginForm");
  var formData = new FormData(myForm);
  var jsonData = {};
  for (var [k, v] of formData) {
    //convertimos los datos a json
    jsonData[k] = v;
  }
  var settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  };
  const request = await fetch(urlApi + "/auth/login", settings);

  if (request.ok) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'logeado exitosamente',
      showConfirmButton: false,
      timer: 1500
    })
    const respuesta = await request.json();
    localStorage.token = respuesta.data.token;

    //localStorage.token = respuesta;
    localStorage.email = jsonData.email;
    //consultarUser();
    setTimeout(function () {
      location.href= "dashboard.html";
  }, 2000);
  }else{
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        text: 'los datos del usuario no son validos',
        showConfirmButton: false,
        timer: 3000
      });
}
}

function listarUsuarios() {
  validaToken();
  $("#table_users").show();
  $("#table_cars").hide();
  $("#table_cars_of_user").hide();
  var settings = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
  };
  fetch(urlApi + "/user", settings)
    .then((response) => response.json())
    .then(function (users) {
      var usuarios = "";
      for (const usuario of users.data) {
        var date = usuario.birthday+"";
                //console.log(date)
                var dato =date.split('T');
        usuarios += `
                <tr>
                    <th scope="row">${usuario.user_id}</th>
                    <td>${usuario.firstName}</td>
                    <td>${usuario.lastName}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.address}</td>
                    <td>${dato[0]}</td>
                    <td>
                    <a href="#" onclick="registerFormCarsUserId('${usuario.user_id}')" class="btn btn-outline-success">
                    <i class="fa-solid fa-cart-plus"></i>
                    </a>
                    <a href="#" onclick="registerFormCarsUser('${usuario.user_id}')" class="btn btn-outline-success">
                    <i class="fa-solid fa-cart-plus"></i>
                    </a>
                    </td>
                    <td>
                    <a href="#" onclick="listarCarsUser('${usuario.user_id}')" class="btn btn-outline-success">
                        <i class="fa-solid fa-car"></i>
                    </a>
                    <a href="#" onclick="verModificarUsuario('${usuario.user_id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verUsuario('${usuario.user_id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#" onclick="eliminarUsuario('${usuario.user_id}')" class="btn btn-outline-danger">
                        <i class="fa-solid fa-minus"></i>
                    </a>
                    
                    </td>
                </tr>`;
      }
      document.getElementById("listarUsers").innerHTML = usuarios;
    });
}

function alertas(mensaje, tipo) {
    var color = "";
    if (tipo == 1) {
      //success verde
      color = "success";
    } else {
      //danger rojo
      color = "danger";
    }
    var alerta = `<div class="alert alert-${color} alert-dismissible fade show" role="alert">
                      <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                          ${mensaje}
                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                   </div>`;
    document.getElementById("datosuser").innerHTML = alerta;
  }
  
  function registerFormUsers() {
    cadena = `
    <div class="container">
      <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Usuario</h1>
  
      <form action="" method="post" id="registerForm">
          <input type="hidden" name="user_id" id="user_id">
  
          <div class="mb-3">
              <label for="firstName" class="form-label">First Name</label>
              <input type="text" class="form-control" name="firstName" id="firstName" required>
          </div>
  
          <div class="mb-3">
              <label for="lastName" class="form-label">Last Name</label>
              <input type="text" class="form-control" name="lastName" id="lastName" required>
          </div>
  
          <div class="mb-3">
              <label for="address" class="form-label">Address</label>
              <input type="text" class="form-control" name="address" id="address" required>
          </div>
  
          <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" name="email" id="email" required>
          </div>
  
          <div class="mb-3">
              <label for="birthday" class="form-label">Date of Birth</label>
              <input type="date" class="form-control" name="birthday" id="birthday" required>
          </div>
  
          <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" name="password" required>
          </div>
  
          <button type="button" class="btn btn-outline-info" onclick="registrarUsuario()">Registrar</button>
      </form>
  </div>`;
    document.getElementById("contentModal").innerHTML = cadena;
    var myModal = new bootstrap.Modal(document.getElementById("modalUsuario"));
    myModal.toggle();
  }
  
  async function registrarUsuario() {
    var myForm = document.getElementById("registerForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {
      //convertimos los datos a json
      jsonData[k] = v;
    }
    const request = await fetch(urlApi + "/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    
    if(localStorage.token == undefined){
          console.log(request.status);
          if(request.status=='201'){
              Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Un usuario registrado exitosamente',
                  showConfirmButton: false,
                  timer: 1500
                })   
                document.getElementById("contentModal").innerHTML = '';
                var myModalEl = document.getElementById('modalUsuario')
                var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
                modal.hide();       
             
          }else{
              Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  text: 'ingrese los datos de manera correcta',
                  showConfirmButton: false,
                  timer: 3000
                });
          }
      }else{
          if(request.status=='201'){
              listarUsuarios();
              alertas("Se ha registrado el usuario exitosamente!",1)
              document.getElementById("contentModal").innerHTML = '';
              var myModalEl = document.getElementById('modalUsuario')
              var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
              modal.hide();
          }else{
              Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  text: 'ingrese los datos de manera correcta',
                  showConfirmButton: false,
                  timer: 2000
                });
          }
      }
  }
  
  function modalConfirmacion(texto, funcion) {
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(
      document.getElementById("modalConfirmacion")
    );
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
  }
  
  async function consultarUser(){
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/user/correo/"+localStorage.email,settings)
    .then(response => response.json())
    .then(function(usuario){
        console.log(usuario);
            if(usuario){  
              localStorage.user_id=usuario.data.user.user_id;
              
            }
            
    })
  }
  
  function salir() {
    localStorage.clear();
    location.href = "index.html";
  }
  
  function validaToken() {
    if (localStorage.token == undefined) {
      salir();
    }
  }

  