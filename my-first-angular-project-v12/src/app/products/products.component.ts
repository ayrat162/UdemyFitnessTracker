import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productName = 'A Book';
  products = ['A Book', 'A Tree'];

  constructor() { }

  ngOnInit(): void {
  }

  onAddProduct(form: NgForm): void {
    if(form.valid){
      this.products.push(form.value.productName);
    }
  }

  onRemoveProduct(productName: string): void {
    this.products = this.products.filter(p => p !== productName);
  }
}
