const menuBtn = document.querySelector(".menu__btn__icon");
window.addEventListener("scroll", changeNavColor);
console.log(menuBtn);
function changeNavColor() {
  if (window.scrollY > menuBtn.offsetHeight + 150) {
    menuBtn.classList.add("menu__btn__icon-active");
  } else {
    menuBtn.classList.remove("menu__btn__icon-active");
  }
}
// menu__btn__icon-active

////////////////////////////////////////////////
// LOCAL STORAGE CONTRAL
function checkLS() {
  // check local storage
  let dataLS;
  if (localStorage.getItem("dataLS") === null) {
    dataLS = [];
  } else {
    dataLS = JSON.parse(localStorage.getItem("dataLS"));
  }
  return dataLS;
}

// ADD PRODUCT COUNT TO CART NAVIGATION
let products = checkLS();
$(".navigation").text(products.length);

////////////////////////////////////////////////
// product-details page
if (document.body.getAttribute("data-page") == "product-details") {
  ///////////////////////////
  // image animation
  document
    .querySelector(".product-details__pucturs__small-box")
    .addEventListener("click", (e) => {
      const bigImg = document.querySelector(
        ".product-details__pucturs__big-img"
      );

      if (e.target.classList.contains("product-details__pucturs__small-img")) {
        bigImg.src = e.target.src;
      }
    });
  // ADD ENENT TO BUTTON ADD TO CART
  document.getElementById("addToCart").addEventListener("click", (e) => {
    //devine vars
    const pId = new Date().getTime(),
      pImg = document.querySelector(".pImg").getAttribute("src"),
      pName = document.querySelector(".pName").textContent,
      pPrice = document.querySelector(".pPrice").textContent,
      pSize = document.querySelector(".pSize").value,
      pCount = parseFloat(document.querySelector(".pCount").value),
      alrtSelSize = document.querySelector(".alert-select-size");

    // create product data list
    const pData = [];

    // check size is not default value
    if (pSize == "select size") {
      // alrtSelSize.style.display = "block";
      // setTimeout(() => {
      //   alrtSelSize.style.display = "none";
      // }, 3000);
      $(".alert-select-size").fadeIn(500).delay(3000).fadeOut(500);
    } else {
      // add data to product data list
      pData.push({
        id: pId,
        image: pImg,
        name: pName,
        price: pPrice,
        size: pSize,
        count: pCount,
      });

      // ADD PRODUCTS DATA TO LOCAL STORAGE
      let dataLS = checkLS();
      dataLS.push(...pData);
      // add new data to local storage
      localStorage.setItem("dataLS", JSON.stringify(dataLS));

      $(".alert-added").fadeIn(500).delay(2000).fadeOut(500);

      // ADD PRODUCT COUNT TO CART NAVIGATION
      $(".navigation").text(dataLS.length);

      // window.location.assign("http://127.0.0.1:5500/cart.html");
    }

    e.preventDefault();
  });

  ////////////////////////////////////////////////
  // cart page
} else if (document.body.getAttribute("data-page") == "cart") {
  // GET PRODUCTS FROM LOCAL STORAGE
  let dataLS = checkLS();
  // define vars
  const pInCart = document.querySelector(".products-in-cart");

  let newProduct;
  // const products = pDataStore;
  const products = dataLS;
  products.forEach((product) => {
    newProduct = `
        <tr data-id="${product.id}" class="product-card">
          <td>
            <div class="cart__product">
              <div class="cart__img-box">
                <img
                  src="${product.image}"
                  alt="product image"
                  class="cart__img"
                />
              </div>
              <div class="cart__info">
                <h4 class="heading-6 heading-6__dark cart__info__name">
                  ${product.name}
                </h4>
                <p class="cart__size"> size: ${product.size}</p>
                <p class="cart__price">price:<span class="init-price">${
                  product.price
                }</span> </p>
                <a href="#" class="cart__link delete"
                  > remove &rarr;</a
                >
              </div>
            </div>
          </td>
          <td>
            <input type="number" min="1" max="20" value="${
              product.count
            }" class="input-number pCount" />
          </td>
          <td class="cart__price last-price">${(
            product.price * product.count
          ).toFixed(2)}</td>
        </tr>
      `;

    pInCart.innerHTML += newProduct;
  });

  // DELETE PRODUCT FROM CART PAGE
  const productsCart = document.querySelector(".products-in-cart");
  productsCart.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      const delProduct = $(e.target).parents(".product-card");
      delProduct.remove();
      const delProductId = delProduct.attr("data-id");

      products.forEach((product, index) => {
        if (product.id == delProductId) {
          products.splice(index, 1);
        }
      });

      // UPDATA LOCAL STORAGE
      let dataLS = checkLS();
      dataLS = products;
      // add new data to local storage
      localStorage.setItem("dataLS", JSON.stringify(dataLS));
      // ADD PRODUCT COUNT TO CART NAVIGATION
      $(".navigation").text(products.length);
      window.location.reload();
    }

    ////////////////////////////
    // collect subtotal
    if (e.target.classList.contains("pCount")) {
      $(this).on("change click", function () {
        const product = $(e.target).parents(".product-card"),
          initPrice = product.find(".init-price").text(),
          pCount = product.find(".pCount").val(),
          lastPrice = product.find(".last-price");
        $(lastPrice).text(
          (parseFloat(initPrice) * parseFloat(pCount)).toFixed(2)
        );
      });
    }
  });
  ////////////////////////////
  // collect total price
  const lastPrice = $(".product-card .last-price"),
    allSubtotal = $(".allSubtotal"),
    tax = $(".tax"),
    total = $(".total");

  function loop() {
    let subtotal = 0;
    for (let i = 0; i < lastPrice.length; i++) {
      subtotal += parseFloat(lastPrice[i].innerHTML);
    }
    $(allSubtotal).text(subtotal.toFixed(2));
    let cTax = (subtotal * 0.14).toFixed(2);
    $(tax).text(cTax);
    let cTotal = (parseFloat(subtotal) + parseFloat(cTax)).toFixed(2);
    $(total).text(cTotal);
  }

  loop();
  ///////////////////////////////
  $(".pCount").on("change click keyup", function () {
    loop();
  });
}
