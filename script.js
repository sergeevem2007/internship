const storage = [
    {
      id: 1,
      name: 'ролл угорь стандарт',
      price: 250,
      amount : 10
    },
    {
      id: 2,
      name: 'пицца маргарита',
      price: 300,
      amount : 8
    },
    {
      id: 3,
      name: 'бургер',
      price: 150,
      amount : 17
    },
    {
      id: 4,
      name: 'ролл креветка стандарт',
      price: 100,
      amount : 6
    },
    {
      id: 5,
      name: 'пицца фирменная',
      price: 200,
      amount : 3
    },
  ];
const cart = [];

let sum = 0;

webix.ui({
    cols:[
        { 
            rows: [
                { view:"template", id:"storageHeader", type:"header", template:"Склад" },
                { view:"datatable", height: 300, id:"storage", autoConfig:true, data:[ ...storage ], }
            ]
        },
        {
            rows: [
                { view:"template", id:"cartHeader", type:"header", template:"Корзина" },
                { view:"datatable", height: 300, id:"cart", autoConfig:true, data:[ ...cart ] },
                { view:"template", id:"cartFooter", type:"header", template: "Сумма 0" }
            ]
        }
    ]
});

const storageItem = $$("storage");
const cartItem = $$("cart");
const cartFooter = $$("cartFooter");

const countCartSum = (totalSum = 0) => {
  totalSum = 0;
  cart.forEach(({price, amount}) => totalSum += price * amount )
  return totalSum;
}
function changeAmount  (id, e, node) {
  const item = this.getItem(id);
  if (item) {
    let storageElem = storage.find((elem)=>{
      return elem.id == item.id;
    });
    let cartElem = cart.find((elem)=>{
      return elem.id == item.id;
    });
    if (this.data.owner == "storage"){
      storageElem.amount--;
      if (storageElem.amount == 0){
        storage.splice(storage.indexOf(storageElem), 1);
      }
      if (cartElem){
        cartElem.amount++;
      } else {  
        cartElem = {...storageElem};    
        cart.push(cartElem);
        cartElem = cart.find((elem)=>{
          return elem.id == item.id;
        });
        cartElem.amount = 1;
      }    
    } else if (this.data.owner == "cart"){
      if (storageElem){
        storageElem.amount++;
        cartElem.amount--;
      } else {
        storageElem = {...cartElem};    
        storage.push(storageElem);
        storageElem = storage.find((elem)=>{
          return elem.id == item.id;
        });
        storageElem.amount = 1;
      }
      
      if (cartElem.amount == 0){
        cart.splice(cart.indexOf(cartElem), 1);
      }
      
    }
  }
  storageItem.define("data", storage);
  cartItem.define("data", cart);
  storageItem.render();
  cartItem.render();
  cartFooter.setHTML(`Сумма ${countCartSum()}`);
}

storageItem.attachEvent("onItemClick", changeAmount);
cartItem.attachEvent("onItemClick", changeAmount);