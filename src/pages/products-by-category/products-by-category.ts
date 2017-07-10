import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from '../product-details/product-details';


@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {
  WooCommerce: any;
  products: any[];
  category: any;
  page: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.page = 1;
    this.category = this.navParams.get('category');

    this.WooCommerce = WC({
      url: "http://store.gustavodecker.com",
      consumerKey:"ck_f95608de7e483733b0bc55d8f68aeeefbaac6ee2",
      consumerSecret:"cs_15f47b7d609db08b8d9f5e4a2f2c282586d4c0ca"
    });

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then((data)=>{
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err)=>{
      console.log(err)
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event){

    this.page++;
    console.log("Getting Page: " + this.page);

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then((data)=>{
      let temp = (JSON.parse(data.body).products);

      this.products = this.products.concat(JSON.parse(data.body).products);
      console.log(this.products);
      event.complete();

      if(temp.length < 10){
        event.enable(false);
      }
    })
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage,{'product': product});
  }

}
