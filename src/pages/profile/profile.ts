import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { ClienteDTO } from '../../dto/models/cliente.dto';
import { API_CONFIG } from '../../config/api.config';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storate: StorageService,
    public clienteService: ClienteService) {}

  ionViewDidLoad() {

    let localUser = this.storate.getLocalUser();

    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response =>{
          this.cliente = response;
          this.getImageIfExists();
        },
        error =>{})
    }
    
  }

  getImageIfExists(){
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response =>{
        this.cliente.imageUrl = `${API_CONFIG.baseUrlBucket}/cp${this.cliente.id}.jpg`;
      },
      error =>{});
  }

}
