import { Modal } from "antd";

const MOVIES = "movies";
const ORDERS = "orders";

export const setMovies = (movies) => {
  localStorage.setItem(MOVIES, JSON.stringify(movies));
};

export const checkLocalMovies = () => {
  try {
    if (localStorage.getItem(MOVIES) === null) {
      return false;
    }
    return true;
  } catch (error) {
    Modal.error({
      title: "ERRORE NEL LOCALSTORAGE",
    });
  }
};

export const checkLocalOrders = () => {
  try {
    if (localStorage.getItem("orders") === null) {
      return false;
    }
    return true;
  } catch (error) {
    Modal.error({
      title: "ERRORE NEL LOCALSTORAGE",
    });
  }
};

export const getLocalMovies = () => {
  if (checkLocalMovies()) {
    return JSON.parse(localStorage.getItem(MOVIES));
  }

  return [];
};

export const getBusinessMovies = (busName) => {
  const movies = getLocalMovies();
  const businessMovies = movies.map((movie) => {
    const find =
      movie.vendors[
        movie.vendors.findIndex((item) => item.businessName === busName)
      ];
    if (find) {
      return {
        id: movie.id,
        sellPrice: find.sellPrice,
        rentPrice: find.rentPrice,
      };
    }
  });
  return businessMovies;
};

export const saveMovie = (id, busName, sellPrice, rentPrice, setReload) => {
  let movies = getLocalMovies();
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    movies.push({
      id,
      vendors: [
        {
          businessName: JSON.parse(localStorage.getItem("user")).info
            .businessName,
          sellPrice,
          rentPrice,
        },
      ],
    });
    localStorage.setItem("movies", JSON.stringify(movies));
  } else if (
    movies[movieIndex].vendors.findIndex((x) => x.businessName === busName) ===
    -1
  ) {
    movies[movieIndex].vendors.push({
      businessName: JSON.parse(localStorage.getItem("user")).info.businessName,
      sellPrice,
      rentPrice,
    });
    localStorage.setItem("movies", JSON.stringify(movies));
  } else {
    Modal.error({
      title: "Il film ?? gi?? in vendita.",
    });
  }
  setReload(movies);
};

export const deleteLocalMovie = (id, busName, setData) => {
  let movies = getLocalMovies();
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  const vendorIndex = movies[movieIndex].vendors.findIndex(
    (x) => x.businessName === busName
  );

  const haveMovie = vendorIndex !== -1;
  if (!haveMovie) {
    Modal.error({
      title: "Non puoi eliminare il film perch?? ancora non ?? in vendita",
    });
  } else {
    movies[movieIndex].vendors.splice(vendorIndex, 1);
  }
  if (movies[movieIndex].vendors.length > 0) {
    setMovies(movies);
  } else {
    movies.splice(movieIndex, 1);
    setMovies(movies);
  }
  setData(getLocalMovies());
};

export const getMoviePrices = (id) => {
  return getLocalMovies().filter((movie) => movie.id === id);
};

export const getLocalOrders = (userEmail) => {
  const orders = JSON.parse(localStorage.getItem(ORDERS));

  if (orders && orders.length > 0) {
    const final = orders.filter((order) => {
      return order.user === userEmail;
    });
    return final;
  } else {
    return [];
  }
};

export const createOrder = (user, businessName, movie, price, type) => {
  var currentDate = new Date(Date.now());
  if (localStorage.getItem("orders")) {
    JSON.parse(localStorage.getItem("orders"));
    //Se ci sono degli ordini
    const orders = JSON.parse(localStorage.getItem("orders"));
    //Vedo gli ordini: controllo se ho gi?? fatto un ordine per quel film e di che tipo
    orders.forEach((order) => {
      if (order.user === user) {
        //Se io ho degli ordini
        if (order.movie === movie) {
          //Se ho gi?? acquistato lo stesso film
          if (order.type === 1) {
            //Se si tratta di un noleggio
            if (currentDate - order.date > 259200000) {
              //Se il noleggio ?? terminato
              var date = new Date(Date.now());
              var final = { user, businessName, movie, price, type, date };
              localStorage.setItem("cart", JSON.stringify([final]));
            } else {
              //Se il noleggio ?? ancora in corso
              Modal.error({
                title:
                  "Hai gi?? noleggiato questo film ed ?? ancora disponibile per la visione",
              });
            }
          } else if (order.type === 0) {
            Modal.error({
              title: "Hai gi?? acquistato questo film",
            });
          }
        } else {
          var date = new Date(Date.now());
          var final = { user, businessName, movie, price, type, date };
          localStorage.setItem("cart", JSON.stringify([final]));
        }
      } else {
        //Se non ho ordini nessun problema
        var date = new Date(Date.now());
        var final = { user, businessName, movie, price, type, date };
        localStorage.setItem("cart", JSON.stringify([final]));
      }
    });
  } else {
    //Se non ci sono ordini
    var date = new Date(Date.now());
    var final = { user, businessName, movie, price, type, date };
    localStorage.setItem("cart", JSON.stringify([final]));
  }
};

export const completeOrder = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const orders = JSON.parse(localStorage.getItem("orders"));

  if (orders && orders.length > 0) {
    orders.push(orders);
    localStorage.setItem("orders", JSON.stringify(cart));
    localStorage.removeItem("cart");
  } else {
    localStorage.setItem("orders", JSON.stringify(cart));
    localStorage.removeItem("cart");
  }
};

export const getOrders = () => {
  if (checkLocalOrders()) {
    return JSON.parse(localStorage.getItem("orders"));
  }

  return [];
};

export const getOrdersByBusName = (busName) => {
  const orders = getOrders();
  const data = [];
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    for (let j = 0; j < order.cart.length; j++) {
      const item = order.cart[j];
      if (item.businessName === busName) {
        data.push({
          user: order.user,
          id: item.id,
          title: item.title,
          type: item.type,
          price: item.price,
          createdAt: item.createdAt,
        });
      }
    }
  }
  return data;
};
