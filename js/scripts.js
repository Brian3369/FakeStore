const url = "https://fakestoreapi.com/products";

async function getProducts(url, quantity) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Error en la petición: " + response.status);
      return;
    }
    const data = await response.json();
    return data.slice(0, quantity);
  } catch (error) {
    console.log("Error en la solicitud: " + error);
    return null;
  }
}

function htmlArticle(item) {
  return `
        <div class="col mb-4" >
            <div class="card h-100" style="width: 300px;">
            <img src="${item.image}" class="card-img-top" alt="${item.title} " style="height:200px; object-fit:contain;">
            <div class="card-body">
              <h5 onclick="showProductModal(${item.id}) class="card-title">${item.title}</h5>
              <p class="card-text">$${item.price}</p>
            </div>
            <div class="card-footer text-center">
              <button class="btn btn-outline-dark" onclick="showProductModal(${item.id})">Ver Detalles</button>
            </div>
          </div>
        </div>
  `;
}

function htmlArticleOfert(item) {
  let html = `
    <div class="col mb-5">
      <div class="card h-100">
        <img style=" class="card-img-top" src="${item.image}" alt="..." />
        <div class="card-body p-4">
          <div class="text-center">
            <h5 class="fw-bolder">${item.title}</h5>
            $${item.price}
          </div>
        </div>
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div class="text-center"><a class="btn btn-outline-dark mt-auto" onclick="showProductModal(${item.id})">Ver Detalles.</a></div>
        </div>
      </div>
    </div>
  `;
  if (item.id == 1) {
    return html;
  }
  if (item.id == 4) {
    return html;
  }
  if (item.id == 7) {
    return html;
  } else {
    return "";
  }
}

function createCarouselCaptions(data) {
  const carouselInner = document.querySelector(
    "#carouselExampleCaptions .carousel-inner"
  );
  if (!carouselInner) return;
  let html = "";
  data.forEach((item, index) => {
    html += `
      <div class="carousel-item${index === 0 ? " active" : ""}">
        <img src="${
          item.image
        }" class="d-block w-100" alt="..." style="height:400px; object-fit:contain;">
        <div class="carousel-caption d-none d-md-block">
          <h5>${item.title}</h5>
          <a type="button" class="btn btn-outline-primary" onclick="showProductModal(${
            item.id
          })">Ver Detalles.</a>
        </div>
      </div>
    `;
  });
  carouselInner.innerHTML = html;
}

let productsCache = null;

async function showProductModal(id) {
  if (!productsCache) {
    productsCache = await getProducts(url, 20);
  }
  const product = productsCache.find((p) => p.id === id);
  if (product) {
    const modalBody = document.getElementById("productModalBody");
    modalBody.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <img src="${product.image}" alt="${product.title}" class="img-fluid" style="max-height:300px; object-fit:contain;">
          </div>
          <div class="col-md-6">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <h4>$${product.price}</h4>
            <p><strong>Categoría:</strong> ${product.category}</p>
          </div>
        </div>
      `;
    const myModal = new bootstrap.Modal(
      document.getElementById("productModal")
    );
    myModal.show();
  }
}

function showArticle(data) {
  let articleList = document.getElementById("article-list");
  let articleListOfert = document.getElementById("ofert-list");
  data.forEach((element) => {
    articleList.innerHTML += htmlArticle(element);
    articleListOfert.innerHTML += htmlArticleOfert(element);
  });
}

function getRandomItems(data, quantity) {
  return data.sort(() => 0.5 - Math.random()).slice(0, quantity);
}

async function init() {
  const data = await getProducts(url, 20);
  if (!data) return;
  showArticle(data);
  const randomItems = getRandomItems(data, 3);
  createCarouselCaptions(randomItems);
}

init();
