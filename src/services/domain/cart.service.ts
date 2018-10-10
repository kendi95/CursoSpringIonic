import { Injectable } from "@angular/core";
import { Cart } from "../../dto/models/cart";
import { StorageService } from "../storage.service";
import { ProdutoDTO } from "../../dto/models/produto.dto";


@Injectable()
export class CartService{

    constructor(public storage: StorageService){}
    createOrClearCart(): Cart{
        let cart: Cart = {items: []};
        this.storage.setCart(cart);
        return cart;
    }

    getCart(): Cart{
        let cart: Cart = this.storage.getCart();
        if(cart == null){
            cart = this.createOrClearCart();
        }
        return cart;
    }

    addProduto(produto: ProdutoDTO): Cart{
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position == -1){
            cart.items.push({quantidade: 1, produto: produto});
        }
        this.storage.setCart(cart);
        return cart;
    }

    removeProduto(produto: ProdutoDTO): Cart{
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position != -1){
            cart.items.splice(position, 1);
        }
        this.storage.setCart(cart);
        return cart;
    }

    increaseQuantity(produto: ProdutoDTO): Cart{
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position != -1){
            cart.items[position].quantidade++;
        }
        this.storage.setCart(cart);
        return cart;
    }

    decreaseQuantity(produto: ProdutoDTO): Cart{
        let cart = this.getCart();
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if(position != -1){
            cart.items[position].quantidade--;
        }
        this.storage.setCart(cart);
        return cart;
    }

    total(): number{
        let cart = this.getCart();
        let soma = 0;
        for(var i = 0; i < cart.items.length; i++){
            soma = soma + cart.items[i].produto.preco * cart.items[i].quantidade;
        }
        return soma;
    }

}