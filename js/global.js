const learnMore = (parent)=>{
const list= document.createElement("li");
const moreInfo= document.createElement("a");
moreInfo.href="./information.html";
moreInfo.innerHTML=`<i class="fa-solid fa-book-open-reader"></i> Lär dig mer`
moreInfo.classList.add("nav-link");
list.appendChild(moreInfo);
list.style.marginRight="10px"
parent.appendChild(list)
}
const userIsLoggedOut =()=>{
    const navigation= document.querySelector("#navigation");
    navigation.innerHTML="";

    const loginList= document.createElement("li");
    const login=document.createElement("a");
    login.href="./login.html"
    login.classList.add("sign-in")
    login.innerHTML=`<i class="fa-solid fa-lock"></i> Login`
    loginList.appendChild(login);

    const registerList=document.createElement("li");
    const register=document.createElement("a");
    register.href="./register.html";
    register.classList.add("nav-link")
    register.innerHTML=`<i class="fa-solid fa-user"></i> Registrera`
    registerList.appendChild(register);
    learnMore(navigation)
    navigation.appendChild(loginList);
    navigation.appendChild(registerList)

}
export{userIsLoggedOut}