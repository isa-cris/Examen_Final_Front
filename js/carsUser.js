const urlApi2 = "http://localhost:8088";

function listarCarsUser(user_id) {
    validaToken();
    $("#table_users").hide();
    $("#table_cars").hide();
    $("#table_cars_of_user").show();
  
    var settings = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.token,
        },

    };
    fetch(urlApi2 + "/user/"+user_id, settings)
        .then((response) => response.json())
        .then(function (response) {
            var cadena = "";
            for (const car of response.data.cars) {
                cadena += `
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
                      <a href="#" onclick="eliminarCarUser('${car.id}','${user_id}')" class="btn btn-outline-danger">
                          <i class="fa-solid fa-minus"></i>
                      </a>
                      </td>
                  </tr>`;
            }
            document.getElementById("listarCarsUser").innerHTML = cadena;
        }
        );
}

function eliminarCarUser(id,user_id) {
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
        .then(function (response) {
            listarCarsUser(user_id)
            alertas("Se ha eliminado el vehiculo exitosamente!", 2);
            
});
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
    fetch(urlApi2 + "/car/" + id, settings)
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
      document.getElementById("datoscaruser").innerHTML = alerta;
    }

    function verModificarCar(id,user_id) {
        validaToken();
        var settings = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.token,
          },
        };
        fetch(urlApi2 + "/car/" + id, settings)
          .then((response) => response.json())
          .then(function (response) {
            var cadena = "";
            var car = response.car;
            var user = response.user;
      
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
                      <label for="carro" class="form-label">Carro</label>
                      <input type="text" class="form-control" name="car" id="car" required value="${car.car}"> <br>
                      <label for="price"  class="form-label">Precio</label>
                      <input type="text" class="form-control" name="price" id="price" required value="${car.price}"> <br>
                      <label for="availability" class="form-label">Disponibilidad</label>
                      <select id="availability" name="availability" class="form-control" required>
                        <option value"${car.availability}"selected>${car.availability}</option>
                        <option value"${car.availability}"> true</option>
                        <option value"${car.availability}"> false</option>
                      </select>
                      <br>
                      <button type="button" class="btn btn-outline-warning" 
                          onclick="modificarCar('${car.id}', '${user.user_id}')">Modificar
                      </button>
                  </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById("modalUsuario"));
            myModal.toggle();
          });
      }
      
      async function modificarCar(id, user_id) {
        validaToken();
        var myForm = document.getElementById("modificar");
        var formData = new FormData(myForm);
        var jsonData = {};
        for (var [k, v] of formData) {
          //convertimos los datos a json
          jsonData[k] = v;
        }
        const request = await fetch(urlApi2 + "/car/"+id, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.token,
          },
          body: JSON.stringify(jsonData),
        });
        
        if (request.ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'se ha atualizado con exiso el vehiculo',
            showConfirmButton: false,
            timer: 1500
          })
          const respuesta = await request.json();
          setTimeout(function () {
            listarCarsUser(user_id);
            document.getElementById("contentModal").innerHTML = "";
        var myModalEl = document.getElementById("modalUsuario");
        var modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
        modal.hide();
        }, 2000);
        }else{
          Swal.fire({
              position: 'top-end',
              icon: 'error',
              text: 'no se actualizo el vehiculo',
              showConfirmButton: false,
              timer: 3000
            });
      }
        
      }