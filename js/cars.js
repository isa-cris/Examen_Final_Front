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