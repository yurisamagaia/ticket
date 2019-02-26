import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioEditarPage } from './usuario-editar';

@NgModule({
  declarations: [
    UsuarioEditarPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioEditarPage),
  ],
})
export class UsuarioEditarPageModule {}
