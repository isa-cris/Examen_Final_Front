const urlApi1 = "http://localhost:8088";

function listarCars() {
    validaToken();
    $("#table_users").hide();
    $("#table_cars").show();
    $("#table_cars_of_user").hide();
  
    var settings = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.token,
      },
    };
    fetch(urlApi1 + "/car", settings)
      .then((response) => response.json())
      .then(function (users) {
        var cars = "";
        for (const car of users.data) {
          cars += `
                  <tr>
                      <th scope="row">${car.id}</th>
                      <td>${car.car}</td>
                      <td>${car.car_model}</td>
                      <td>${car.car_color}</td>
                      <td>${car.car_model_year}</td>
                      <td>${car.car_vin}</td>
                      <td>${car.price}</td>
                      <td>${car.availability}</td>
                      <td>
  
                      <a href="#" onclick="verModificarCar('${car.id}')" class="btn btn-outline-warning">
                          <i class="fa-solid fa-user-pen"></i>
                      </a>
                      <a href="#" onclick="verCar('${car.id}')" class="btn btn-outline-info">
                          <i class="fa-solid fa-eye"></i>
                      </a>
                      <a href="#" onclick="eliminarCar('${car.id}')" class="btn btn-outline-danger">
                          <i class="fa-solid fa-minus"></i>
                      </a>
                      </td>
                  </tr>`;
        }
        document.getElementById("listarCars").innerHTML = cars;
      });
}
  
function eliminarCar(id) {
  validaToken();
  var settings = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
  };
  fetch(urlApi1 + "/car/" + id, settings)
    .then((response) => response.json())
    .then(function (data) {
      listarCars();
      alertas("Se ha eliminado el car exitosamente!", 2);
    });
}

function verModificarCar(id) {
  validaToken();
  var settings = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
  };
  fetch(urlApi1 + "/car/" + id, settings)
    .then((response) => response.json())
    .then(function (response) {
      var cadena = "";
      var car = response.car;
      if (car) {
        cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Car</h1>
                </div>
              
                <form action="" method="post" id="modificar">
                    <input type="hidden" name="id" id="id" value="${car.id}">
                    <input type="hidden" name="car_model" id="car_model" value="${car.car_model}">
                <input type="hidden" name="car_model_year" id="car_model_year" value="${car.car_model_year}">
                <input type="hidden" name="car_vin" id="car_vin" value="${car.car_vin}">
                <input type="hidden" name="car_color" id="car_color" value="${car.car_color}">
                    <label for="car" class="form-label">Carro</label>
                    <input type="text" class="form-control" name="car" id="car" required value="${car.car}"> <br>
                    <label for="price"  class="form-label">Precio</label>
                    <input type="text" class="form-control" name="price" id="price" required value="${car.price}"> <br>
                    <label for="availibility" class="form-label">Disponibilidad</label>
                    <select id="availability" name="availability" class="form-control" required>
                      <option value"${car.availability}"selected>${car.availability}</option>
                      <option value"${car.availability}"> true</option>
                      <option value"${car.availability}"> false</option>
                    </select>
                    <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarCar('${car.id}')">Modificar
                    </button>
                </form>`;
      }
      document.getElementById("contentModal").innerHTML = cadena;
      var myModal = new bootstrap.Modal(
        document.getElementById("modalUsuario")
      );
      myModal.toggle();
    });
}

async function modificarCar(id) {
  validaToken();
  var myForm = document.getElementById("modificar");
  var formData = new FormData(myForm);
  var jsonData = {};
  for (var [k, v] of formData) {
    //convertimos los datos a json
    jsonData[k] = v;
  }
  const request = await fetch(urlApi + "/car/"+id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
    body: JSON.stringify(jsonData),
  });
  if(request.status=='202'){
    listarCars();
    alertas("Se ha modificado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}
}

function verCar(id) {
  validaToken();
  var settings = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.token,
    },
  };
  fetch(urlApi1 + "/car/" + id, settings)
    .then((response) => response.json())
    .then(function (response) {
      var cadena = "";
      var car = response.car;
      if (car) {
        cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Carro</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Carro: ${car.car}</li>
                    <li class="list-group-item">Color: ${car.car_color}</li>
                    <li class="list-group-item">Modelo: ${car.car_model}</li>
                </ul>`;
      }
      document.getElementById("contentModal").innerHTML = cadena;
      var myModal = new bootstrap.Modal(
        document.getElementById("modalUsuario")
      );
      myModal.toggle();
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
  document.getElementById("datoscar").innerHTML = alerta;
}

function registerForm() {
  cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Car</h1>
            </div>
              
            <form action="" method="post" id="registerForm">
            <label for="id" class="form-label">Id</label>
                <input type="hidden" name="id" id="id">
                <label for="firstName" class="form-label">First Name</label>
                <input type="text" class="form-control" name="firstName" id="firstName" required> <br>
                <label for="lastName"  class="form-label">Last Name</label>
                <input type="text" class="form-control" name="lastName" id="lastName" required> <br>
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" name="email" id="email" required> <br>
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarCar()">Registrar</button>
            </form>`;
  document.getElementById("contentModal").innerHTML = cadena;
  var myModal = new bootstrap.Modal(document.getElementById("modalUsuario"));
  myModal.toggle();
}

async function registrarCarUser() {
  var myForm = document.getElementById("registerForm");
  var formData = new FormData(myForm);
  var jsonData = {};
  for (var [k, v] of formData) {
    //convertimos los datos a json
    jsonData[k] = v;
  }
  const request = await fetch(urlApi1 + "/car", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  });
  listar();
  alertas("Se ha registrado el car exitosamente!", 1);
  document.getElementById("contentModal").innerHTML = "";
  var myModalEl = document.getElementById("modalUsuario");
  var modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
  modal.hide();
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

function salir() {
  localStorage.clear();
  location.href = "index.html";
}

function validaToken() {
  if (localStorage.token == undefined) {
    salir();
  }
}
