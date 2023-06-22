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