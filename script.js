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
const storageBody = document.querySelector('.storage-body');
const cartBody = document.querySelector('.cart-body');
const cartSum = document.querySelector('.cart-sum');


const countCartSum = () => {
  let totalSum = 0;
  cart.forEach((elem) =>{
    const {id, name, price, amount} = elem;
    return totalSum += price * amount;
  })
  return totalSum;
}

const render = (array, container) => {
  container.textContent = '';
  
  array.forEach((elem) =>{
    const {id, name, price, amount} = elem;
    if (amount === 0) {
      return;
    }
    itemArray = `
        <div class="food-row">
					<span class="food-name" data-id="${id}">${name}</span>
					<strong class="food-price">${price} ₽</strong>
					<div class="food-counter">
						<span class="counter">${amount} шт</span>
					</div>
				</div>
				<!-- /.foods-row -->
    `;
    container.insertAdjacentHTML('beforeend', itemArray);
  });
  cartSum.textContent = `${countCartSum()} ₽`;
}

render(storage, storageBody);
render(cart, cartBody);


const changeAmount = (event) => {
  const target = event.target;
  if (target.dataset.id){
    let storageItem = storage.find((item)=>{
      return item.id == target.dataset.id;
    });
    let cartItem = cart.find((item)=>{
      return item.id == target.dataset.id;
    });
    if (target.closest('.storage')){
      storageItem.amount--;
      if (cartItem){
        cartItem.amount++;
      } else {  
        cartItem = {...storageItem};    
        cart.push(cartItem);
        cartItem = cart.find((item)=>{
          return item.id == target.dataset.id;
        });
        cartItem.amount = 1;
      }
    } else if (target.closest('.cart')){
      storageItem.amount++;
      cartItem.amount--;
    }
    
    render(storage, storageBody);
    render(cart, cartBody);
  }
}


storageBody.addEventListener('click', changeAmount);
cartBody.addEventListener('click', changeAmount);

