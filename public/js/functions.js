async function getReady(array) {   

   const mensagem = document.querySelector('.mensagem');
   const texto = document.querySelector('.texto');
   //const empr = document.querySelector('.empr').Value;
   const emp = document.getElementById('idemp').textContent;
   const token = localStorage.getItem('token');
   const lote = document.getElementById('lote').textContent;   
   var select = document.getElementById('lot_cli');
   var cli = select.options[select.selectedIndex].value; 
   var nome = select.options[select.selectedIndex].text;  

   await axios.all([
      axios.get(`http://api-paulinhomonteiro-com.umbler.net/reserva/${token}/${lote}`),
      axios.get(`http://api-paulinhomonteiro-com.umbler.net/venda/${token}/${cli}/${emp}`)
      ]).then(axios.spread((reservasRes, cotasRes) => {

         let reservas = reservasRes.data[0].cliente;
         let cotas = cotasRes.data[0].total;
         mensagem.style.visibility = "visible";

         texto.textContent = '';

         if (reservas !== 'Não Encontrado') {
            texto.textContent = 'ATENÇÃO! Cliente ' + reservas + ' possui reserva para este lote! ';
         } else {
            texto.textContent = 'Nenhuma reserva encontrada para este lote. ';
         };

         if (reservas !== 0) {
            texto.insertAdjacentHTML('beforeend', 'Cliente ' + nome + ' possui ' + cotas + ' cota(s) para este empreendimento.');
         } else {
            texto.insertAdjacentHTML('beforeend', 'Cliente ' + nome + ' não possui cotas para este empreendimento.');
         };
         //console.log('Reserva: ' + reservas + ' - Cotas: ' + cotas);
   }))
      
} 

function getRadio() {
   // INÍCIO - Gestão de mudança entre CATEGORIA/CONTA/CAIXA nos Relatórios
   const cattab = document.getElementById('cattab');
   const catgra = document.getElementById('catgra');
   const contab = document.getElementById('contab');
   const congra = document.getElementById('congra');
   const caxtab = document.getElementById('caxtab');
   const caxgra = document.getElementById('caxgra');

   const cat = document.getElementById('cat');
   const con = document.getElementById('con');
   const cax = document.getElementById('cax');    

   caxtab.addEventListener("click", (event) => {      
      cax.style.display = "block";
      cat.style.display = "none";
      con.style.display = "none";
   });
   caxgra.addEventListener("click", (event) => {
      cax.style.display = "block";
      cat.style.display = "none";
      con.style.display = "none";
   });
   cattab.addEventListener("click", (event) => {      
      cat.style.display = "block";
      cax.style.display = "none";
      con.style.display = "none";
   });
   catgra.addEventListener("click", (event) => {
      cat.style.display = "block";
      cax.style.display = "none";
      con.style.display = "none";
   });
   contab.addEventListener("click", (event) => {      
      con.style.display = "block";
      cax.style.display = "none";
      cat.style.display = "none";
   });
   congra.addEventListener("click", (event) => {
      con.style.display = "block";
      cax.style.display = "none";
      cat.style.display = "none";
   });
}   
   // FIM - Gestão de mudança entre CATEGORIA/CONTA/CAIXA nos Relatórios

      
   function getCheck () {
      // INÍCIO - Controle de exibição da CONTA pelo checkbox, na vende de COTAS e LOTES      
      const chk = document.getElementById('check');
      const con = document.querySelector('.con');
      const cax = document.querySelector('.cax');
      const cat = document.querySelector('.cat');
      const slcon = document.querySelector('.slcon');
      const slcax = document.querySelector('.slcax');  
      const slcat = document.querySelector('.slcat');      

      chk.addEventListener("click", (event) => {
         if (chk.checked) {               
            con.style.display = "inline-block"; 
            cax.style.display = "inline-block"; 
            cat.style.display = "inline-block";
            slcon.required = true; 
            slcax.required = true;
            slcat.required = true;
         } else {  
            con.style.display = "none";
            cax.style.display = "none";
            cat.style.display = "none";
            slcon.required = false;    
            slcax.required = false;
            slcat.required = false;          
         }
      });   
   } 

   // Função que pesquisa cliente da reserva do lote.
   async function getRes(array) { 
      const texto = document.querySelector('.texto');
      const mensagem = document.querySelector('.mensagem');
      const check = document.querySelector('.check');
      const reserva = document.querySelector('.reserva');
      const cancela = document.querySelector('.cancela');
      const cliente = document.querySelector('.cliente');
      const token = localStorage.getItem('token');
      const lote = document.getElementById('lote').textContent;  
   
      let resultado = await axios.get(`http://api-paulinhomonteiro-com.umbler.net/reserva/${token}/${lote}`)
      let idreserva = resultado.data[0].id 
      let reservas = resultado.data[0].cliente      
      texto.textContent = '';
      //console.log('Reserva: ' + reservas);

         if (reservas !== 'Não Encontrado') {
            reserva.style.display = "inline-block";
            mensagem.style.visibility = "visible";
            texto.textContent = 'ATENÇÃO! Cliente ' + reservas + ' possui reserva para este lote! ';
            
         } else {
            mensagem.style.visibility = "visible";            
            texto.textContent = 'Nenhuma reserva encontrada para este lote. ';
         };

         for(var i = 0; i < cliente.length; i++) {
            if(cliente.options[i].text === reservas) {
              cliente.selectedIndex = i;
            }
          }             
            check.addEventListener("click", (event) => {  
               if (check.checked) {    
                  cliente.selectedIndex = 0;
                  //confirma.style.display = "inline-block";
               } else {
                  for(var i = 0; i < cliente.length; i++) {
                     if(cliente.options[i].text === reservas) {
                       //confirma.style.display = "none";
                       cliente.selectedIndex = i;
                     }
                   }
               }
         });
         
         cancela.addEventListener("click", (event) => {  
            if (check.checked) {    
               check.checked = false;
               for(var i = 0; i < cliente.length; i++) {
                  if(cliente.options[i].text === reservas) {
                    //confirma.style.display = "none";
                    cliente.selectedIndex = i;
                  }
                }
            } else {
               
            }
         });         
   } 

      // INÍCIO - Função de máscara de campo TELEFONE
      function mask(o, f) {
         setTimeout(function() {
           var v = mphone(o.value);
           if (v != o.value) {
             o.value = v;
           }
         }, 1);
       }
       
       function mphone(v) {
         var r = v.replace(/\D/g, "");
         r = r.replace(/^0/, "");
         if (r.length > 10) {
           r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
         } else if (r.length > 5) {
           r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
         } else if (r.length > 2) {
           r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
         } else {
           r = r.replace(/^(\d*)/, "($1");
         }
         return r;
       }  
       // FIM - Função de máscara de campo TELEFONE

//  function formataValores() {
//         var box = document.querySelectorAll('.card')
//            box.forEach(function(p){
//               let tipo = p.textContent.substring(0,3)
//               tipo == 'Des' ? p.classList.add("text-red-600") : p.classList.add("text-blue-600")
//            })
//       }        
       