import "./sass/main.scss"
const btnsList = document.querySelector(".extsions-control-buttons");
const table = document.querySelector(".extsions-list");
const lightBtn = document.querySelector('.toggle-logo-light');
const darkBtn = document.querySelector('.toggle-logo-dark');
let Theme ;
async function loadData() {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();   
    return data;
  } catch (error) {
    console.error('Error loading JSON:', error);
    return null;
  }
}
let data = await loadData();



function genrateMarkup(data){  
   return `<div class="extsions-list_item extsions-list_item-${Theme}">

          <div class="extsions-list_item-head">
            <img src="src${data.logo.slice(1)}" type="image/svg+xml" class="logo"></img>
            <div class="extsions-list_item-head-text extsions-list_item-head-text-${Theme}">
              <h2>${data.name}</h2>
              <p>${data.description}</p>
            </div>

          </div>
          <div class="extsions-list_item-remove">
            <button data-name="${data.name}" class="extsions-list_item-remove-btn extsions-list_item-remove-btn-${Theme}">Remove</button>
            <label class="extsions-list_item-switch">
              <input type="checkbox" ${data.isActive?'checked':''} data-name="${data.name}">
              <span class="slider round"></span>
            </label>
          </div>
        </div>`
}
function Diaplay(option="all"){
  let newRR=data;
  if(option==="false"){
    newRR = data.filter(e=> !e.isActive )
  }
  if(option==="true"){
    newRR = data.filter(e=> e.isActive )
  }
  
  table.innerHTML=" "; 
  newRR.forEach((item, index) => {
      setTimeout(() => {
      let ht = genrateMarkup(item);
        table.insertAdjacentHTML("beforeend",ht);
        toggleExtension(); 
        remvoeExtension();
      }, 200 * (index + 1)); // Delay increases with each item
    }); 
    
}

btnsList.addEventListener('click',(e)=>{
  if(e.target.dataset.active){
    let btn =e.target.closest('.extsions-control_button');
    Diaplay(btn.dataset.active);
    document.querySelector(".active").classList.remove("active")
    e.target.classList.add("active")
  } 
})
function remvoeExtension(){
  const btnsRemove = document.querySelectorAll(".extsions-list_item-remove-btn"); 
  btnsRemove.forEach((btn)=>{
    btn.addEventListener('click',()=>{      
      btn.closest(".extsions-list_item").classList.add("extsions-list_item-removed");
      data = data.filter(e=> e.name!==btn.dataset.name);
      })
  })
}
function toggleExtension(){
  document.querySelectorAll('input').forEach((inp)=>{
    inp.addEventListener('change',()=>{
      if(inp.dataset.name){
        data[data.findIndex(e=> e.name == inp.dataset.name)].isActive=inp.checked        
      }
    })
  })

}
////////////////////

function toggleTheme(){
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  function handleThemePreference() {
    if (prefersDarkScheme.matches) {
      // User prefers dark theme: hide dark toggle button, show light toggle
      darkBtn.style.display = "none";
      lightBtn.style.display = "block";
      Theme="dark"      
      setTheme(Theme);     
    } else {
      // User prefers light theme: hide light toggle button, show dark toggle
      lightBtn.style.display = "none";
      darkBtn.style.display = "block";
      Theme="light" 
      setTheme(Theme);     
    }
  }
  // Set initial theme preference
  handleThemePreference();
  // Listen for changes in the system theme preference
  prefersDarkScheme.addEventListener("change", (event) => {
    if (event.matches) {
      // Switched to dark: hide dark toggle, show light toggle
      lightBtn.style.display = "block";
      darkBtn.style.display = "none";
      Theme="dark"      
      setTheme(Theme);
      // Apply dark theme styles if needed  
    } else {
      // Switched to light: hide light toggle, show dark toggle
      darkBtn.style.display = "block";
      lightBtn.style.display = "none";
      Theme="light"
      setTheme(Theme);
      // Apply light theme styles if needed
    }
  });
  
}

function setTheme(theme=Theme){
  Theme=theme;
    const body = document.querySelector('body');
    const head = document.querySelector('.head');
    const toggle = document.querySelector('.toggle-mode');
    const controhead = document.querySelector('.extsions-control-header');
    const btns = document.querySelectorAll('.extsions-control_button');
    const tableItems = document.querySelectorAll('.extsions-list_item');
    const headExt = document.querySelectorAll('.extsions-list_item-head-text');
    const removeBtns = document.querySelectorAll('.extsions-list_item-remove-btn');
    const logo = document.querySelector('.head-logo');   
    
    const list = [body,head,toggle,controhead,...btns,...tableItems,...headExt,...removeBtns];
    list.forEach(el=>{
      if(el.className.includes('active')){
        el.className = el.className.split(' ')[0] + ' active';
      }
      if(el.className.includes('-dark') || el.className.includes('-light')){
          el.className = el.className.split(' ')[0];
      }

      if(theme==="dark"){
        logo.setAttribute('src','src/assets/images/logo-light.svg')
        lightBtn.style.display = "block";
        darkBtn.style.display = "none";
        el.classList.add(el.className.split(' ')[0]+'-dark');
        
      }else if(theme==="light"){
        logo.setAttribute('src','src/assets/images/logo.svg');
        lightBtn.style.display = "none";
        darkBtn.style.display = "block";
        el.classList.add(el.className.split(' ')[0]+'-light');
        
      }


    })
}

document.querySelector('.toggle-mode').addEventListener('click',()=>{
  if(Theme==="dark"){
    Theme="light"
    setTheme(Theme);   
  }else{
    Theme="dark"
    setTheme(Theme);    
  }
})
function Initialize(){
  toggleTheme();
  Diaplay();
}
Initialize()