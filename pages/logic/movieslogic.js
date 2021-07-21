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
      title: "Il film è già in vendita.",
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
      title: "Non puoi eliminare il film perchè ancora non è in vendita",
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

export const getLocalOrders = (businessName) => {
  if (checkLocalOrders) {
    const orders = JSON.parse(localStorage.getItem(ORDERS));
    return orders[
      orders.findIndex((vendor) => vendor.businessName === "businessName")
    ].orders;
  }
  return [];
};

export const hasOrders = (businessName) =>
  getLocalOrders(businessName).length > 0;

export const addToCart = (
  cart,
  setCart,
  id,
  title,
  type,
  businessName,
  price
) => {
  const tempCart = {
    id,
    title,
    type,
    businessName,
    price,
    createdAt: new Date(),
  };
  setCart((c) => [...c, tempCart]);
};

export const removeFromCart = (title, cart, setCart) => {
  var flag = true;
  setCart(
    cart.filter((item) => {
      if (item.title === title && flag) {
        flag = false;
        return item.title !== title;
      }
      return item.title;
    })
  );
};

export const createOrder = (user, cart) => {
  console.log(user);
  console.log(user.info);
  console.log(user.info.email);

  if (
    localStorage.getItem("orders") &&
    JSON.parse(localStorage.getItem("orders")).length > 0
  ) {
    const orders = JSON.parse(localStorage.getItem("orders"));
    orders.push({
      user: user.info.email,
      cart,
    });
    localStorage.setItem("orders", JSON.stringify(orders));
  } else {
    localStorage.setItem(
      "orders",
      JSON.stringify([
        {
          user: user.info.email,
          cart,
        },
      ])
    );
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
