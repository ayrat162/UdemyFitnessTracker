import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductsService } from '../services/products.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productName = 'A Book';
  products = ['A Book', 'A Tree'];
  private productsSubscription: Subscription 

  constructor(private productsService: ProductsService) {
    this.productsSubscription = this.productsService.productsUpdated.subscribe(() => {
      this.products = this.productsService.getProducts();
    });
   }

  ngOnInit(): void {
    this.products = this.productsService.getProducts();
  }

  onAddProduct(form: NgForm): void {
    if (form.valid) {
      this.productsService.addProduct(form.value.productName);
    }
  }

  ngOnDestroy(){
    this.productsSubscription.unsubscribe();
  }
}
