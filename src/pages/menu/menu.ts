import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Signup } from '../signup/signup';
import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {

  homePage: Component;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = HomePage
    this.categories =  [];

    this.WooCommerce = WC({
      url: "http://store.gustavodecker.com",
      consumerKey:"ck_f95608de7e483733b0bc55d8f68aeeefbaac6ee2",
      consumerSecret:"cs_15f47b7d609db08b8d9f5e4a2f2c282586d4c0ca"
    });

    this.WooCommerce.getAsync('products/categories').then((data) =>{
      console.log(JSON.parse(data.body).product_categories);

      let temp: any[]=JSON.parse(data.body).product_categories;

      for(let i=0; i < temp.length; i++){
        if(temp[i].parent==0){

          if(temp[i].slug=='clothing'){
            temp[i].icon='shirt';
          }
          if(temp[i].slug=='music'){
            temp[i].icon='musical-notes';
          }
          if(temp[i].slug=='posters'){
            temp[i].icon='images';
          }

          this.categories.push(temp[i]);
        }
      }
    }, (err)=>{
      console.log(err)
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Menu');
  }

  openCategoryPage(category){
    console.log(category);
    this.childNavCtrl.setRoot(ProductsByCategoryPage ,{'category': category});

  }
  
  openPage(pageName: string){
    if(pageName == "signup"){
      this.navCtrl.push(Signup);
    }
  }

}
