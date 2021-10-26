const page = document.getElementById("page");
const body = document.getElementById("body");
const main = document.getElementById("main");
const form = document.getElementById("form");
const nav = document.getElementById("nav");
const blog = document.getElementById("blog");

function getReady() {
  var user = document.getElementById("user").value;
  var pass = document.getElementById("pass").value;
  var tokenid = ""

  register.innerHTML = "";

  if (user === "" || pass === "") {
    register.innerHTML = 
      `<div class="row mt-2 mb-2 justify-content-center">
      <div class="alert alert-warning justify-content-center" role="alert">
      <span>Usuário não autenticado! Favor fazer login.</span>
      </div>
      </div>`;
  } else {
    fetch("http://www.dgpincorporacoes.com.br/login", {
      method: "post",
      headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        pwd: pass,
      }),
    })
      .then(async (response) => {
        await response.text().then(function (result) {
          const obj = JSON.parse(result);
          tokenid = obj.token;          
           if (obj.auth !== true) {
            register.innerHTML = 
            `<div class="row mt-2 mb-2 justify-content-center">
            <div class="alert alert-warning justify-content-center" role="alert">
            <span>Erro de login: favor verificar suas credenciais junto à 
            DGP Empreendimentos!</span>
            </div>
            </div>`;
            return;
          }
          
          blog.style.visibility = 'hidden'; 
          register.innerHTML = `
          <div class="row mt-2 mb-2 justify-content-center">
          <div class="alert alert-success justify-content-center" role="alert">
          <span>Seja Bem-Vindo, ${user}.</span>
          </div>
          </div>`
          localStorage.setItem('token',tokenid);
          window.location.href = ("http://www.dgpincorporacoes.com.br/admin/" + tokenid);
        });
        // => processamentos aqui!           
       })
      .catch(function (err) {
        console.error(err);
      });
  }
}

function array_unique(array) {
  return array.filter(function (el, index, arr) {
    return index == arr.indexOf(el);
  });
}

const btn = document.getElementById("btn");
btn.addEventListener("click", (event) => {
  getReady();
});
