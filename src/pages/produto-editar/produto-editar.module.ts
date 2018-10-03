import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdutoEditarPage } from './produto-editar';

@NgModule({
  declarations: [
    ProdutoEditarPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdutoEditarPage),
  ],
})
export class ProdutoEditarPageModule {}
