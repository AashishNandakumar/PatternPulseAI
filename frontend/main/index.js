// function copy1(){
//     // const element=document.querySelector('#texta1');
//     // element.select();
//     // element.setSelectionRange(0, 99999);
//     // document.execCommand('copy');
//    let text=document.getElementById('#texta1').innerText;
//    navigator.clipboard.writeText(text);
// }

let text = document.getElementById("texta1").value;
const copy1 = async () => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Content copied to clipboard");
    console.log(text);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

// function copy1(){
//     let text=document.getElementById('texta1');
//     text.ariaSelected();
//     text.setSelectionRange(0,99999);
//     navigator.clipboard.writeText(text.value);
// }

// function toggleimg(){
//     let img=document.querySelector('#button').src;
//     if(img.indexOf(Light.png)!=-1){
//         document.getElementById('button').src='Images/Light.png';
//     }

//     else {
//             document.getElementById('button').src = 'Images/Dark.png';
//      }

// }

function toggleimg() {
  let initialImg = document.getElementById("button").src;
  let srcTest = initialImg.includes("/Images/Light.png");
  let newImg = {
    true: "/Images/Dark.png",
    false: "/Images/Light.png",
  }[srcTest];

  return newImg;
}
