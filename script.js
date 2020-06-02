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
                { view:"template", type:"header", template:"Склад" },
                { view:"datatable", autoConfig:true, data:[ ...storage ] }
            ]
        },
        {
            rows: [
                { view:"template", type:"header", template:"Корзина" },
                { view:"datatable", autoConfig:true, data:[ ...cart ] },
            ]
        }
    ]
});

window.addEventListener('click', (event)=>{
    const target = event.target;

    let storageItem = storage.find((item)=>{
      return item.name == target.textContent;
    });
    let cartItem = cart.find((item)=>{
      return item.name == target.textContent;
    });
    if (target.closest('body')){
        storageItem.amount--;
        if (cartItem){
          cartItem.amount++;
        } else {
          cartItem = {...storageItem};    
          cart.push(cartItem);
          cartItem = cart.find((item)=>{
            return item.name == target.textContent;
          });
          cartItem.amount = 1;
        }
      } else if (target.closest('body')){
        storageItem.amount++;
        cartItem.amount--;
      }
    console.log(cart)
})