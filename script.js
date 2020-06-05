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

webix.ui({
    cols:[
        { 
            rows: [
                { view:"template", id:"storageHeader", type:"header", template:"Склад" },
                { view:"datatable", height: 300, id:"storage", autoConfig:true, data: storage }
            ]
        },
        {
            rows: [
                { view:"template", id:"cartHeader", type:"header", template:"Корзина" },
                { view:"datatable", height: 300, id:"cart", autoConfig:true, data: cart },
                { view:"template", id:"cartFooter", type:"header", template: "Сумма 0" }
            ]
        }
    ]
});

const storageItem = $$("storage");
const cartItem = $$("cart");
const cartFooter = $$("cartFooter");

const countCartSum = (totalSum = 0) => {
  // обходим массив и подсчитываем сумму
  cart.forEach(({price, amount}) => totalSum += price * amount )
  return totalSum;
}
function changeAmount  (id, e, node) {
  const item = this.getItem(id);
  if (item) {
    // создаем переменные которые ищут элемент в массиве, совпадающий с item
    let storageElem = storage.find((elem)=>{
      return elem.id == item.id;
    });
    let cartElem = cart.find((elem)=>{
      return elem.id == item.id;
    });
    // если клик произошел по storage
    if (this.data.owner == "storage"){
      storageElem.amount--;
      // если количество 0, удаляем элемент из массива
      if (storageElem.amount == 0){
        storage.splice(storage.indexOf(storageElem), 1);
      }
      // если элемент в массиве существует, увеличиваем количество
      if (cartElem){
        cartElem.amount++;
      } else {
        // иначе создаем копию элемента и задаем количество 1 
        cartElem = {...storageElem};    
        cart.push(cartElem);
        cartElem.amount = 1;
      }
      // если клик произошел по cart    
    } else if (this.data.owner == "cart"){
      // если элемент в массиве storage существует, увеличиваем количество в storage, уменьшаем в cart
      if (storageElem){
        storageElem.amount++;
        cartElem.amount--;
        // если количество 0, удаляем элемент из массива
        if (cartElem.amount == 0){
          cart.splice(cart.indexOf(cartElem), 1);
        }
        // иначе создаем копию элемента и задаем количество 1
      } else {
        cartElem.amount--;
        storageElem = {...cartElem};    
        storage.push(storageElem);
        storageElem.amount = 1;
      }
    }
  }
  // очищаем все элементы компонента
  storageItem.clearAll();
  cartItem.clearAll();
  // задаем компонентам новые параметры
  storageItem.define("data", storage);
  cartItem.define("data", cart);
  // выводим сумму
  cartFooter.setHTML(`Сумма ${countCartSum()}`);
}

storageItem.attachEvent("onItemClick", changeAmount);
cartItem.attachEvent("onItemClick", changeAmount);