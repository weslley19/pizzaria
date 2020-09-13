// Quantidade de pizzas no modal
let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (element) => {
    return document.querySelector(element);
};

const cAll = (element) => {
    return document.querySelectorAll(element);
};

/**
 * 
 * Listagem das pizzas 
 * Mapea o array 
 */
pizzaJson.map((item, index) => {
    // Clonar a div
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    // Preencher as informações
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price[2].toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // Prevenir a atualização de click nos links
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        // Monta modal
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            // Recolocar a classe na G
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            // Coloca os tamanhos
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        c('.pizzaInfo--actualPrice').innerHTML = `RS ${pizzaJson[key].price[2].toFixed(2)}`;

        // Cada preço e tamanho
        cAll('.pizzaInfo--size').forEach((price, priceItem) => {
            price.addEventListener('click', () => {
                c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[priceItem].toFixed(2)}`;
            });
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        // Atrasar tempo de exibição
        c('.pizzaWindowArea').style.opacity = 0;
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        c('.pizzaWindowArea').style.display = 'flex';
    });

    // Adiciona
    c('.pizza-area').append(pizzaItem);
});

// Fechar modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = '0';
    setTimeout((item) => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 300);
}

// Chamar a função closeModal
cAll('.pizzaInfo--cancelButton, .pizzaInfo--addButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// Aumentar quantidade
function moreQtd() {
    modalQt += 1;
    c('.pizzaInfo--qt').innerHTML = modalQt;
}

c('.pizzaInfo--qtmais').addEventListener('click', moreQtd);

// Diminuir quantidade
function descreseQtd() {
    if (modalQt > 1) {
        modalQt -= 1;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    } else {
        alert('Quantidade não pode ser menor que 1');
    }
}

c('.pizzaInfo--qtmenos').addEventListener('click', descreseQtd);


// Tamanhos
cAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// Adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
    // Tamanho
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    // Preço total
    let priceTotal = pizzaJson[modalKey].price * modalQt;

    // Sabe se ja tem a pizza
    let identification = pizzaJson[modalKey].name + '@' + size;

    let key = cart.findIndex((item) => {
        return item.identification == identification;
    });

    // Verificar na chave se tem o valor
    if (key > -1) {
        cart[key].qtd += modalQt;
    } else {
        // O key so é acessivel dentro da função, por isso o modalKey assume o valor de key
        cart.push({
            identification,
            id: pizzaJson[modalKey].id,
            size,
            qtd: modalQt,
            price: pizzaJson[modalKey].price,
            priceTotal: priceTotal
        });
    }

    updateCart();
});

// Atualizar carrinho
function updateCart() {

    // Mobile contagem de itens
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let discount = 0;
        let subtotal = 0;
        let total = 0;

        // Ver se a pizza do Json é igual a que ta no carrinho
        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == cart[i].id;
            });

            // Preço individual das pizzas
            subtotal += pizzaItem.price[cart[i].size] * cart[i].qtd;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSize;
            switch (cart[i].size) {
                case 0:
                    pizzaSize = 'P';
                    break;
                case 1:
                    pizzaSize = 'M';
                    break;
                case 2:
                    pizzaSize = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSize})`;

            cartItem.querySelector('.cart--item img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qtd > 1) {
                    cart[i].qtd--;
                } else if (cart.length == 1) {
                    (confirm('Deseja fechar o carrinho?') == true) ? cart.splice(i, 1) : '';
                } else {
                    (confirm('Deseja remover essa pizza?') == true) ? cart.splice(i, 1) : '';
                }

                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qtd++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        discount = subtotal * 0.1;
        total = subtotal - discount;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

// Abrir carrinho no mobile
c('.menu-openner').addEventListener('click', () => {
    if (cart.length) {
        c('aside').style.left = 0;
    }
});

// Fechar carrinho no mobile
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

// Mensagem de compra finalizada
c('.cart--finalizar').addEventListener('click', () => {
    // Animação de entrada
    c('.buy-success').style.opacity = 0;
    setTimeout(() => {
        c('.buy-success').style.opacity = 1;
    }, 200);
    c('.buy-success').style.display = 'flex';
    c('.buy-success-content-img img').src = 'images/success.png';
    c('.buy-success-content-msg').innerHTML = 'Pedido realizado com sucesso';

    setTimeout(() => {
        c('.buy-success').style.opacity = 0;
        setTimeout(() => {
            c('.buy-success').style.display = 'none';
        }, 300);
    }, 2000);

    c('aside').style.display = 'none';

    c('.menu-openner span').innerHTML = 0;
    cart = [];

    // Recarrega a página após finalizar o pedido
    setTimeout(() => {
        document.location.reload(true);
    }, 2500);
});
