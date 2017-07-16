import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController} from 'ionic-angular';
import { HomePage } from '../home/home';
import { Signup } from '../signup/signup';
import { Login } from '../login/login';
import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';
import { Storage } from "@ionic/storage";
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {

  homePage: Component;
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl: NavController;
  loggedIn: boolean;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController) {
    this.homePage = HomePage
    this.categories =  [];
    this.user = {};

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

  ionViewDidEnter() {

    this.storage.ready().then(()=>{
      this.storage.get("userLoginInfo").then((userLoginInfo)=>{
        if(userLoginInfo != null){
          console.log("User logged in...");
          this.user=userLoginInfo.user;
          console.log(this.user);
          this.loggedIn=true;
        }else{
          console.log("No user found...");
          this.user ={};
          this.loggedIn = false;
        }
      })
    })

  }

  openCategoryPage(category){
    console.log(category);
    this.childNavCtrl.setRoot(ProductsByCategoryPage ,{'category': category});

  }

  openPage(pageName: string){
    if(pageName == "signup"){
      this.navCtrl.push(Signup);
    }
    if(pageName == "login"){
      this.navCtrl.push(Login);
    }
    if(pageName == "cart"){
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }
    if(pageName == "logout"){
      this.storage.remove("userLoginInfo").then(()=>{
        this.user = {};
        this.loggedIn = false;
        console.log("user logout...");
      })
    }
  }

}
