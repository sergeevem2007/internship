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
  const cartArr = cartItem.data.pull;
  for (let key in cartArr){
    let {price, amount} = cartArr[key];
    totalSum += price * amount
  }
  return totalSum;
}

storageItem.attachEvent("onItemClick", function(id, e, node){
  const item = this.getItem(id);
  item.amount--;
  let findItem = cartItem.find(function(obj){
    return obj.id == item.id;
  });
  if (findItem.length != 0) {
    findItem[0].amount++;  
  } else {
    findItem = {...item};
    cartItem.add(findItem);
    findItem.amount = 1;
  }
  if (item.amount == 0) {
    storageItem.remove(item.id);
  }
  storageItem.render();
  cartItem.render();
  cartFooter.setHTML(`Сумма ${countCartSum()}`);
});

cartItem.attachEvent("onItemClick", function(id, e, node){
  const item = this.getItem(id);
  item.amount--;
  let findItem = storageItem.find(function(obj){
    return obj.id == item.id;
  });
  if (findItem.length != 0) {
    findItem[0].amount++;  
  } else {
    findItem = {...item};
    storageItem.add(findItem);
    findItem.amount = 1;
    // cartItem.render();
  }
  if (item.amount == 0) {
    cartItem.remove(item.id);
  }
  storageItem.render();
  cartItem.render();
  cartFooter.setHTML(`Сумма ${countCartSum()}`);
});
